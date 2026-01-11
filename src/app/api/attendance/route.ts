import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const date = searchParams.get("date");

        const query: any = {};
        if (userId) query.user = userId;
        if (date) query.date = new Date(date);

        const attendance = await Attendance.find(query)
            .populate("user", "name email")
            .sort({ date: -1 });

        return NextResponse.json(attendance);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }
}
