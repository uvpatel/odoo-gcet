"use server";

import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { leaveRequestSchema, leaveStatusSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function requestLeave(prevState: any, formData: FormData) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return { success: false, message: "Unauthorized" };

        const rawData = {
            type: formData.get("type"),
            from: new Date(formData.get("from") as string).toISOString(), // Ensure ISO for Zod
            to: new Date(formData.get("to") as string).toISOString(),
            reason: formData.get("reason"),
        };

        const validation = leaveRequestSchema.safeParse(rawData);
        if (!validation.success) {
            return {
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten().fieldErrors
            };
        }

        const { type, from, to, reason } = validation.data;
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate > toDate) {
            return { success: false, message: "Start date cannot be after end date" };
        }

        // Overlap Check
        const overlap = await Leave.countDocuments({
            user: user._id,
            status: { $in: ["Pending", "Approved"] },
            $or: [
                { from: { $lte: toDate }, to: { $gte: fromDate } }
            ]
        });

        if (overlap > 0) {
            return { success: false, message: "You already have a leave request in this period." };
        }

        await Leave.create({
            user: user._id,
            type,
            from: fromDate,
            to: toDate,
            reason,
            status: "Pending"
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/leaves");
        revalidatePath("/employee/dashboard");
        revalidatePath("/employee/leaves");
        revalidatePath("/dashboard/leaves");
        return { success: true, message: "Leave requested successfully" };

    } catch (e: any) {
        return { success: false, message: e.message || "Error requesting leave" };
    }
}

export async function updateLeaveStatus(leaveId: string, status: "Approved" | "Rejected") {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user || user.role !== "admin") {
            return { success: false, message: "Unauthorized. Admin only." };
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) return { success: false, message: "Leave not found" };

        leave.status = status;
        await leave.save();

        // If Approved, update Attendance
        if (status === "Approved") {
            const startDate = new Date(leave.from);
            const endDate = new Date(leave.to);

            // Loop through dates
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const currentDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));

                // Upsert attendance as 'Leave'
                // We preserve 'Absent' if strictly needed, but 'Leave' usually overrides everything else
                await Attendance.updateOne(
                    { user: leave.user, date: currentDay },
                    {
                        $set: {
                            status: "Leave",
                            checkIn: null, // Clear these if they exist
                            checkOut: null
                        }
                    },
                    { upsert: true }
                );
            }
        }

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/leaves");
        revalidatePath("/employee/dashboard");
        revalidatePath("/employee/leaves");
        revalidatePath("/dashboard/leaves");
        revalidatePath("/admin/attendance");
        revalidatePath("/employee/attendance");
        return { success: true, message: `Leave ${status}` };

    } catch (e: any) {
        return { success: false, message: e.message || "Error updating leave" };
    }
}
