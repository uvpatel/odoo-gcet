import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    try {
        // Example: Total Salary per month
        const report = await Payroll.aggregate([
            {
                $group: {
                    _id: "$month",
                    totalPayout: { $sum: "$netSalary" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate payroll report" }, { status: 500 });
    }
}
