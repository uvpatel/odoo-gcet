// POST (check-in/out)
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Attendance from "@/models/Attendance"

// ✅ REQUIRED: Named HTTP method export
export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  try {
    await connectDB()

    const attendance = await Attendance.find({
      employeeId: params.employeeId,
    }).sort({ date: -1 })

    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}
