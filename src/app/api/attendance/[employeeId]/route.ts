import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Attendance from "@/models/Attendance"

export async function GET(
  request: Request,
  context: { params: Promise<{ employeeId: string }> }
) {
  try {
    const { employeeId } = await context.params

    await connectDB()

    const attendance = await Attendance.find({
      employeeId,
    }).sort({ date: -1 })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}
