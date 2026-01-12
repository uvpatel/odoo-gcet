// lib/requireAdmin.ts
import { auth } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();

  if (!userId) throw new Error("Unauthorized");
  if (sessionClaims?.role !== "ADMIN") throw new Error("Forbidden");

  return userId;
}
