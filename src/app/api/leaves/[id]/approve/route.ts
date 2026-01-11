import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const { id } = await params;
        const { status, adminComment } = await req.json();

        const leave = await Leave.findByIdAndUpdate(
            id,
            { status, adminComment },
            { new: true }
        );

        if (!leave) {
            return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
        }

        return NextResponse.json(leave);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update leave status" }, { status: 500 });
    }
}
