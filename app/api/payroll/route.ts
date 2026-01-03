import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: Fetch Payroll History (Employee: Own, Admin: All/Filter)
export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const month = searchParams.get("month");

        let query: any = {};
        if (user.role !== "admin") {
            query.user = user._id;
        } else {
            const userId = searchParams.get("userId");
            if (userId) query.user = userId;
        }

        if (month) query.month = month;

        const payrolls = await Payroll.find(query)
            .populate("user", "name email department jobTitle")
            .sort({ month: -1 });

        return NextResponse.json(payrolls);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST: Generate Payroll (Admin Only)
export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();

        // 1. RBAC
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
        }

        const body = await req.json();
        const { month, userId } = body;
        // month format "YYYY-MM"

        if (!month) {
            return NextResponse.json({ error: "Month is required (YYYY-MM)" }, { status: 400 });
        }

        // Determine users to process
        let usersToProcess = [];
        if (userId) {
            const targetUser = await User.findById(userId);
            if (targetUser) usersToProcess.push(targetUser);
        } else {
            usersToProcess = await User.find({ isActive: true, role: "employee" }); // Only generate for employees? Or admins too?
        }

        const results = [];

        // Parse dates for attendance lookup
        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
        const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59));

        for (const emp of usersToProcess) {
            if (!emp.salary) {
                results.push({ email: emp.email, status: "Skipped (No Salary)" });
                continue;
            }

            // Count Absence
            const absentDays = await Attendance.countDocuments({
                user: emp._id,
                date: { $gte: startDate, $lte: endDate },
                status: "Absent" // Strict 'Absent' check. 'Leave' might be paid or unpaid depending on type, simplified here.
            });

            // Simplistic Calculation
            const dailyRate = emp.salary / 30; // Standard 30 days
            const deductionAmount = Math.round(absentDays * dailyRate);
            const netSalary = Math.max(0, emp.salary - deductionAmount);

            // Create or Update Payroll
            // We use findOneAndUpdate with upsert to ensure idempotency
            const payroll = await Payroll.findOneAndUpdate(
                { user: emp._id, month },
                {
                    user: emp._id,
                    month,
                    baseSalary: emp.salary,
                    deductions: deductionAmount,
                    netSalary: netSalary
                },
                { upsert: true, new: true }
            );
            results.push({ email: emp.email, status: "Generated", netSalary });
        }

        return NextResponse.json({ message: "Payroll processing complete", results });

    } catch (error) {
        console.error("Payroll Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
