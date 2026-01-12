// actions/leave.actions.ts
"use server";

import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { auth } from "@clerk/nextjs/server";

export async function applyLeave(data: {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectDB();

  return await Leave.create({
    employeeId: userId,
    ...data,
    status: "PENDING",
  });
}


// actions/leave.actions.ts
export async function approveLeave(
  leaveId: string,
  status: "APPROVED" | "REJECTED",
  comment?: string
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // RBAC check
  if (sessionClaims?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  await connectDB();

  return await Leave.findByIdAndUpdate(
    leaveId,
    {
      status,
      adminComment: comment,
    },
    { new: true }
  );
}