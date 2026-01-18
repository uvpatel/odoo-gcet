// // lib/auth.ts
// import jwt from "jsonwebtoken";
// import User from "@/models/User";
// import { connectDB } from "./db";

// export async function requireAuth(req: Request) {
//   const token = req.headers.get("authorization")?.split(" ")[1];
//   if (!token) throw new Error("Unauthorized");

//   const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//   await connectDB();
//   const user = await User.findById(decoded.userId);
//   if (!user) throw new Error("User not found");

//   return user;
// }


// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ← your auth config

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  role?: string;
  // ... other fields you need
} | null;

/**
 * Get current authenticated user on server components / server actions
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id as string,
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role, // if you extend user model
    // image: session.user.image,
    // etc...
  };
}

// Optional: throw version for protected routes/actions
export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}