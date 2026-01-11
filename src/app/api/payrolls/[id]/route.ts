import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const { id } = await params;
        const payroll = await Payroll.findById(id).populate("user", "name email department jobTitle");

        if (!payroll) {
            return NextResponse.json({ error: "Payroll record not found" }, { status: 404 });
        }

        return NextResponse.json(payroll);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch payroll" }, { status: 500 });
    }
}
