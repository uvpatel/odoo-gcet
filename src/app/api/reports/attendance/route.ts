import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    try {
        // Example: Aggregation for monthly attendance
        const report = await Attendance.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    present: {
                        $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
                    },
                    absent: {
                        $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate attendance report" }, { status: 500 });
    }
}
