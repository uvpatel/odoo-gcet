import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const month = searchParams.get("month");

        const query: any = {};
        if (userId) query.user = userId;
        if (month) query.month = month;

        const payrolls = await Payroll.find(query)
            .populate("user", "name email")
            .sort({ month: -1 });

        return NextResponse.json(payrolls);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const payroll = await Payroll.create(body);
        return NextResponse.json(payroll, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
