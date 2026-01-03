"use server";

import { connectDB } from "@/lib/db";
import Attendance, { IAttendance } from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTodayAttendance() {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return null;

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const record = await Attendance.findOne({
        user: user._id,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    // We can't pass the full Mongoose doc to client component easily because of Date objects/Methods
    // manually serialize
    if (!record) return null;

    return {
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        status: record.status,
    };
}

export async function checkInAction() {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return { success: false, message: "Unauthorized" };

        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        const existing = await Attendance.findOne({
            user: user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existing) {
            if (existing.status === "Leave") {
                return { success: false, message: "You are on approved leave today." };
            }
            return { success: false, message: "Already checked in today." };
        }

        await Attendance.create({
            user: user._id,
            date: startOfDay,
            checkIn: now,
            status: "Present"
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");
        return { success: true, message: "Checked in successfully" };

    } catch (e: any) {
        return { success: false, message: e.message || "Error checking in" };
    }
}

export async function checkOutAction() {
    try {
        await connectDB();
        const user = await getAuthUser();
        if (!user) return { success: false, message: "Unauthorized" };

        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

        const record = await Attendance.findOne({
            user: user._id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!record) {
            return { success: false, message: "You must check in first." };
        }
        if (record.checkOut) {
            return { success: false, message: "Already checked out." };
        }

        record.checkOut = now;
        await record.save();

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/attendance");
        return { success: true, message: "Checked out successfully" };

    } catch (e: any) {
        return { success: false, message: e.message || "Error checking out" };
    }
}
