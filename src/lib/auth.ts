// lib/auth.ts
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "./db";

export async function requireAuth(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) throw new Error("User not found");

  return user;
}
