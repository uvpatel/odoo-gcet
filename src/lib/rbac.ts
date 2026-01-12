// lib/rbac.ts
import { UserRole } from "@/models/User";

export function requireRole(userRole: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(userRole)) {
    throw new Error("Forbidden: Insufficient permissions");
  }
}
