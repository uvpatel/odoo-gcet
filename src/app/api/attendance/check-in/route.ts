import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Define "Today" based on server time (UTC)
        // Set to midnight to standardize
        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        // 1. Check if record already exists for today
        const existingRecord = await Attendance.findOne({
            user: user._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingRecord) {
            return NextResponse.json(
                { error: "Already checked in for today." },
                { status: 400 }
            );
        }

        // 2. Create Check-in Record
        const newRecord = await Attendance.create({
            user: user._id,
            date: startOfDay, // Normalize date field
            checkIn: now,
            status: "Present"
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/employee/dashboard");
        revalidatePath("/admin/attendance");
        revalidatePath("/employee/attendance");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");

        return NextResponse.json(newRecord, { status: 201 });

    } catch (error) {
        console.error("Check-in error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
