import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import { getAuthUser } from "@/lib/auth";

export interface DashboardStats {
    totalUsers: number;
    presentToday: number;
    pendingLeaves: number;
    activeLeaves: number;
    attendanceRate: number;
}

export interface RecentActivity {
    id: string;
    user: {
        name: string;
        image: string;
        jobTitle: string;
    };
    checkIn: Date | null;
    checkOut: Date | null;
    status: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    await connectDB();

    // Normalize today date boundary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalUsers, presentToday, pendingLeaves, activeLeaves] = await Promise.all([
        User.countDocuments({ isActive: true }),
        Attendance.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            status: "Present"
        }),
        Leave.countDocuments({ status: "Pending" }),
        Leave.countDocuments({
            status: "Approved",
            from: { $lte: today },
            to: { $gte: today }
        })
    ]);

    // Avoid division by zero
    const attendanceRate = totalUsers > 0
        ? Math.round((presentToday / totalUsers) * 100)
        : 0;

    return {
        totalUsers,
        presentToday,
        pendingLeaves,
        activeLeaves,
        attendanceRate
    };
}

export async function getRecentCheckIns(): Promise<RecentActivity[]> {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await Attendance.find({
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ["Present", "Half-day"] }
    })
        .sort({ checkIn: -1 })
        .limit(10)
        .populate("user", "name profileImage jobTitle")
        .lean();

    return records.map((r: any) => ({
        id: r._id.toString(),
        user: {
            name: r.user?.name || "Unknown",
            image: r.user?.profileImage || "",
            jobTitle: r.user?.jobTitle || "Employee"
        },
        checkIn: r.checkIn ? new Date(r.checkIn) : null,
        checkOut: r.checkOut ? new Date(r.checkOut) : null,
        status: r.status
    }));
}
