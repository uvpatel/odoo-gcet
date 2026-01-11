import { model, models, Schema, Types } from "mongoose";

export type AttendanceStatus = "Present" | "Absent" | "Half-day" | "Leave";

export interface IAttendance {
    user: Types.ObjectId;
    date: Date;

    checkIn?: Date;
    checkOut?: Date;

    status: AttendanceStatus;
}

const AttendanceSchema = new Schema<IAttendance>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },

        checkIn: Date,
        checkOut: Date,

        status: {
            type: String,
            enum: ["Present", "Absent", "Half-day", "Leave"],
            default: "Present",
        },
    },
    { timestamps: true }
);

// one record per user per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default models.Attendance ||
    model<IAttendance>("Attendance", AttendanceSchema);
