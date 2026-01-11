import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        // 1. Find today's record
        const record = await Attendance.findOne({
            user: user._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (!record) {
            return NextResponse.json(
                { error: "No check-in record found for today. Please check in first." },
                { status: 400 }
            );
        }

        if (record.checkOut) {
            return NextResponse.json(
                { error: "Already checked out today." },
                { status: 400 }
            );
        }

        // 2. Update Check-out
        record.checkOut = now;

        // Calculate status/hours if needed (e.g., check for half-day if check-out is too early)
        // For simplicity, we keep it as Present unless logic dictates otherwise

        await record.save();

        revalidatePath("/admin/dashboard");
        revalidatePath("/employee/dashboard");
        revalidatePath("/admin/attendance");
        revalidatePath("/employee/attendance");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");

        return NextResponse.json(record, { status: 200 });

    } catch (error) {
        console.error("Check-out error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
