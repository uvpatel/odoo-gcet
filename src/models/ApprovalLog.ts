// models/ApprovalLog.ts
import { Schema, model, models, Types } from "mongoose";

export interface IApprovalLog {
  actionType: "LEAVE" | "ATTENDANCE";
  actionId: Types.ObjectId;
  approvedBy: Types.ObjectId;
  comment?: string;
}

const ApprovalLogSchema = new Schema<IApprovalLog>(
  {
    actionType: String,
    actionId: Schema.Types.ObjectId,
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    comment: String,
  },
  { timestamps: true }
);

export default models.ApprovalLog ||
  model<IApprovalLog>("ApprovalLog", ApprovalLogSchema);
