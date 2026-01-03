import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redirect } from "next/navigation";

// 🔐 lib/auth.ts
// This file is responsible for:
// - Getting current Clerk user
// - Mapping Clerk user → internal User model
// - Role verification (ADMIN / EMPLOYEE)
// - Throwing authorization errors
// - Preventing client-side role trust

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

    // Find user in DB by Clerk ID
    let user = await User.findOne({ clerkId: clerkUser.id });

    // Link by email if pre-created by Admin (Onboarding flow)
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
            // Default logic if not pre-created (Auto-provisioning / Fallback)
            // In initial setup, we make the first user an admin.
            const userCount = await User.countDocuments({});

            // Developer Fallback: You can add your email here to always be admin
            const isDeveloper = email.includes("yagnik") || email.includes("admin");

            user = await User.create({
                clerkId: clerkUser.id,
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "New User",
                email: email,
                role: (userCount === 0 || isDeveloper) ? "admin" : "employee",
                employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
                profileImage: clerkUser.imageUrl,
            });
        }
    }

    // Role Enforcement: Block access for deactivated users
    if (!user || user.isActive === false) {
        return null;
    }

    // Convert Mongoose document to plain object and cast _id to string
    const userObj = user.toObject();
    return {
        ...userObj,
        _id: userObj._id.toString()
    } as unknown as AuthUser;
}

/**
 * Ensures the currentUser has the required role. Throws or redirects if not.
 * Usage: await requireRole(["admin"]);
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await getAuthUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!allowedRoles.includes(user.role)) {
        // In a real app, render a 403 page or component
        throw new Error("Unauthorized: Insufficient permissions for this resource.");
    }

    return user;
}
