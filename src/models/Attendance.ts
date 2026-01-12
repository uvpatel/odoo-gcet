// models/Attendance.ts
import { Schema, model, models, Types } from "mongoose";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  HALF_DAY = "HALF_DAY",
  LEAVE = "LEAVE",
}

export interface IAttendance {
  employeeId: Types.ObjectId;
  date: Date;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: String,
    checkOut: String,
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: true,
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default models.Attendance ||
  model<IAttendance>("Attendance", AttendanceSchema);
