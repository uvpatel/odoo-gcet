import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { requireRole } from "@/lib/auth";
import { Users, UserCheck, UserMinus, CalendarClock, Download } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceFilters } from "@/components/dashboard/AttendanceFilters";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { Button } from "@/components/ui/button";
import User from "@/models/User";

export default async function AttendancePage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    await connectDB();
    const userRole = await requireRole(["admin"]);
    const queryTerm = searchParams.q || "";

    // Calculate Stats for Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await Attendance.find({
        date: { $gte: today, $lt: tomorrow }
    });

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const presentToday = todayStats.filter(s => s.status === "Present" || s.status === "Half-day").length;
    const onLeaveToday = todayStats.filter(s => s.status === "Leave").length;
    const absentToday = totalEmployees - presentToday - onLeaveToday;

    // Fetch Logs with search
    let query: any = {};
    if (queryTerm) {
        const users = await User.find({
            name: { $regex: queryTerm, $options: "i" }
        }).select("_id");
        query.user = { $in: users.map(u => u._id) };
    }

    const logs = await Attendance.find(query)
        .populate("user", "name email avatar")
        .sort({ date: -1 })
        .limit(50);

    const serializedLogs = logs.map(l => ({
        ...l.toObject(),
        _id: l._id.toString(),
        user: l.user ? {
            name: (l.user as any).name,
            email: (l.user as any).email
        } : null,
        date: l.date.toISOString(),
        checkIn: l.checkIn ? l.checkIn.toISOString() : "-",
        checkOut: l.checkOut ? l.checkOut.toISOString() : "-"
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Attendance Management
                    </h2>
                    <p className="text-muted-foreground">
                        Monitor and track employee attendance records
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportButton
                        data={serializedLogs}
                        filename={`attendance_report_${new Date().toISOString().split('T')[0]}`}
                        columns={[
                            { header: "Employee", key: "user.name" },
                            { header: "Email", key: "user.email" },
                            { header: "Date", key: "date" },
                            { header: "Check In", key: "checkIn" },
                            { header: "Check Out", key: "checkOut" },
                            { header: "Status", key: "status" }
                        ]}
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Workforce"
                    value={totalEmployees}
                    description="Active employees"
                    icon={<Users className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.1}
                />
                <StatsCard
                    title="Present Today"
                    value={presentToday}
                    description={`${((presentToday / totalEmployees) * 100).toFixed(1)}% attendance rate`}
                    icon={<UserCheck className="h-4 w-4" />}
                    colorClass="text-green-600 bg-green-100 dark:bg-green-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="On Leave"
                    value={onLeaveToday}
                    description="Approved today"
                    icon={<UserMinus className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="Absent"
                    value={absentToday > 0 ? absentToday : 0}
                    description="Missing check-ins"
                    icon={<CalendarClock className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.4}
                />
            </div>

            {/* Main Table Card */}
            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg font-semibold">Attendance Logs</CardTitle>
                    <AttendanceFilters />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t border-border/50">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6">Employee</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No attendance records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log._id.toString()} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="pl-6 font-medium">
                                                <div className="flex flex-col">
                                                    <span>{log.user?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground font-normal">{log.user?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {log.checkIn ? (
                                                    <div className="flex items-center text-green-600 dark:text-green-400">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                                                        {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                ) : <span className="text-muted-foreground">-</span>}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {log.checkOut ? (
                                                    <div className="flex items-center text-orange-600 dark:text-orange-400">
                                                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                                                        {new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                ) : <span className="text-muted-foreground">-</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        log.status === "Present" ? "success" :
                                                            log.status === "Absent" ? "destructive" :
                                                                log.status === "Half-day" ? "warning" : "secondary"
                                                    }
                                                    className="rounded-full px-3 py-0.5"
                                                >
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

