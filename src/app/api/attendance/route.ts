 // GET (Admin), POST// app/api/attendance/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await requireAuth(req);
  await connectDB();

  const body = await req.json();

  const attendance = await Attendance.create({
    employeeId: body.employeeId,
    date: new Date(),
    checkIn: body.checkIn,
    status: "PRESENT",
  });

  return NextResponse.json(attendance);
}
