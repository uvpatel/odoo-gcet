// models/Leave.ts
import { Schema, model, models, Types } from "mongoose";

export enum LeaveType {
  PAID = "PAID",
  SICK = "SICK",
  UNPAID = "UNPAID",
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ILeave {
  employeeId: Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: Types.ObjectId;
  adminComment?: string;
}

const LeaveSchema = new Schema<ILeave>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: true,
    },
    startDate: Date,
    endDate: Date,
    reason: String,
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    adminComment: String,
  },
  { timestamps: true }
);

export default models.Leave || model<ILeave>("Leave", LeaveSchema);
