import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { leaveStatusSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await getAuthUser();

        // 1. RBAC: Only admins can approve/reject
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const validation = leaveStatusSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { status, adminComment } = validation.data;

        const leave = await Leave.findById(id);
        if (!leave) {
            return NextResponse.json({ error: "Leave not found" }, { status: 404 });
        }

        if (leave.status !== "Pending" && leave.status !== status) {
            // Optional: Prevent editing already processed leaves unless necessary
            // return NextResponse.json({ error: "Leave request already processed" }, { status: 400 });
        }

        leave.status = status;
        leave.adminComment = adminComment;
        await leave.save();

        // 2. Side Effect: If Approved, Auto-generate Attendance Records as 'Leave'
        if (status === "Approved") {
            const startDate = new Date(leave.from);
            const endDate = new Date(leave.to);

            // Iterate through days
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const currentDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));

                // Check if attendance exists, if so, update status, else create
                // Upsert logic
                await Attendance.updateOne(
                    { user: leave.user, date: currentDay },
                    {
                        $set: {
                            status: "Leave",
                            // Clear checkIn/checkOut if they existed (optional, depending on policy)
                            checkIn: null,
                            checkOut: null
                        }
                    },
                    { upsert: true }
                );
            }
        }

        return NextResponse.json(leave);

    } catch (error) {
        console.error("Leave Update Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
