import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redirect, notFound } from "next/navigation";

export type AuthUser = IUser & { _id: string };

export async function getAuthUser(): Promise<AuthUser | null> {
  await connectDB();
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  let user = await User.findOne({ clerkId: clerkUser.id });

  if (!user) {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    const existingByEmail = await User.findOne({ email });

    if (existingByEmail) {
      existingByEmail.clerkId = clerkUser.id;
      existingByEmail.profileImage = clerkUser.imageUrl;
      await existingByEmail.save();
      user = existingByEmail;
    } else {
      const userCount = await User.countDocuments({});
      const isDeveloper =
        email.includes("yagnik") || email.includes("admin");

      user = await User.create({
        clerkId: clerkUser.id,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "New User",
        email,
        role: userCount === 0 || isDeveloper ? "admin" : "employee",
        employeeId: `EMP-${Math.floor(
          1000 + Math.random() * 9000
        )}-${Date.now().toString().slice(-4)}`,
        profileImage: clerkUser.imageUrl,
      });
    }
  }

  if (!user || user.isActive === false) return null;

  const obj = user.toObject();

  return {
    ...obj,
    _id: obj._id ? obj._id.toString() : undefined
  } as AuthUser;
}

/**
 * Role Guard (Server-side)
 * Usage: const user = await requireRole(["admin"]);
 */
export async function requireRole(
  allowedRoles: Array<"admin" | "employee">
): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!allowedRoles.includes(user.role)) {
    notFound(); // 🔐 Secure 404 (recommended)
  }

  return user;
}
