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

    // Link by email if pre-created by Admin
    if (!user) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) return null;

        const existingByEmail = await User.findOne({ email });

        if (existingByEmail) {
            existingByEmail.clerkId = clerkUser.id;
            existingByEmail.profileImage = clerkUser.imageUrl || existingByEmail.profileImage;
            await existingByEmail.save();
            user = existingByEmail;
        } else {
            // Default logic if not pre-created (Auto-provisioning)
            user = await User.create({
                clerkId: clerkUser.id,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User",
                email: email,
                role: "employee",
                employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
                profileImage: clerkUser.imageUrl,
            });
        }
    }

    if (!user?.isActive) {
        return null; // Block access for deactivated users
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
