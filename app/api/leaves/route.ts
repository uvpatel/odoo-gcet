import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { leaveRequestSchema } from "@/lib/validations";

export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let query = {};
        if (user.role !== "admin") {
            // Employees see only their own leaves
            query = { user: user._id };
        } else {
            // Admins can see specific user's leaves if passed in params, otherwise all
            const { searchParams } = new URL(req.url);
            const userId = searchParams.get("userId");
            if (userId) query = { user: userId };
        }

        const leaves = await Leave.find(query).populate("user", "name email").sort({ createdAt: -1 });
        return NextResponse.json(leaves);

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const validation = leaveRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { type, from, to, reason } = validation.data;
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate > toDate) {
            return NextResponse.json({ error: "'From' date must be before 'To' date" }, { status: 400 });
        }

        // Check for overlapping leaves
        const overlap = await Leave.countDocuments({
            user: user._id,
            status: { $in: ["Pending", "Approved"] }, // Don't care if Rejected
            $or: [
                { from: { $lte: toDate }, to: { $gte: fromDate } }
            ]
        });

        if (overlap > 0) {
            return NextResponse.json({ error: "You already have a leave request in this date range." }, { status: 409 });
        }

        const leave = await Leave.create({
            user: user._id,
            type,
            from: fromDate,
            to: toDate,
            reason,
            status: "Pending"
        });

        return NextResponse.json(leave, { status: 201 });

    } catch (error) {
        console.error("Leave Create Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
