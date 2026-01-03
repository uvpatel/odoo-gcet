import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redirect } from "next/navigation";

export type AuthUser = IUser & { _id: string };

/**
 * Retrieves the current authenticated user from MongoDB.
 * Syncs with Clerk if the user exists in Clerk but not in DB (First login).
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    await connectDB();
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    // Find user in DB
    let user = await User.findOne({ clerkId: clerkUser.id });

    // Sync if user doesn't exist
    if (!user) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) return null; // Should not happen with valid Clerk user

        // Default role is 'employee', first user might be hardcoded as admin manually or via env logic later
        // For now, simple creation
        user = await User.create({
            clerkId: clerkUser.id,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User",
            email: email,
            role: "employee", // Default role
            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`, // Generate simple ID
            profileImage: clerkUser.imageUrl,
        });
    }

    return user ? (user.toObject() as AuthUser) : null;
}

/**
 * Ensures the currentUser has the required role. Throws or redirects if not.
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await getAuthUser();
    if (!user) {
        redirect("/sign-in");
    }

    if (!allowedRoles.includes(user.role)) {
        throw new Error("Unauthorized: Insufficient permissions");
    }

    return user;
}
