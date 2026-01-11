import { Schema, model, models, Types } from "mongoose";

export type LeaveType = "Paid" | "Sick" | "Unpaid";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface ILeave {
    user: Types.ObjectId;
    type: LeaveType;
    from: Date;
    to: Date;
    reason?: string;
    status: LeaveStatus;
    adminComment?: string;
}

const LeaveSchema = new Schema<ILeave>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["Paid", "Sick", "Unpaid"], required: true },

        from: Date,
        to: Date,
        reason: String,

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        adminComment: String,
    },
    { timestamps: true }
);

export default models.Leave || model<ILeave>("Leave", LeaveSchema);
