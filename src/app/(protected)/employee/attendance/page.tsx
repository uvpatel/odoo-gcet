import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { getAuthUser } from "@/lib/auth";
import { Calendar, UserCheck, UserMinus, Clock, MapPin } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default async function AttendancePage() {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return null;

    const query = { user: user._id };

    const logs = await Attendance.find(query)
        .sort({ date: -1 })
        .limit(31); // Show last month of records

    // Calculate Summary
    const totalDays = logs.length;
    const presentDays = logs.filter(l => l.status === "Present" || l.status === "Half-day").length;
    const leaveDays = logs.filter(l => l.status === "Leave").length;
    const absentDays = logs.filter(l => l.status === "Absent").length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Your Attendance
                </h2>
                <p className="text-muted-foreground">
                    Review your daily check-ins and performance
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Records"
                    value={totalDays}
                    description="Last 31 days"
                    icon={<Calendar className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.1}
                />
                <StatsCard
                    title="Days Present"
                    value={presentDays}
                    description={`${totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0}% attendance`}
                    icon={<UserCheck className="h-4 w-4" />}
                    colorClass="text-green-600 bg-green-100 dark:bg-green-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="On Leave"
                    value={leaveDays}
                    description="Approved leaves"
                    icon={<UserMinus className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="Absences"
                    value={absentDays}
                    description="Missing check-ins"
                    icon={<Clock className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.4}
                />
            </div>

            {/* Attendance History */}
            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="pl-6">Date</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Working Hours</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No attendance logs found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => {
                                    const checkIn = log.checkIn ? new Date(log.checkIn) : null;
                                    const checkOut = log.checkOut ? new Date(log.checkOut) : null;
                                    let hours = "-";
                                    if (checkIn && checkOut) {
                                        const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                                        hours = `${diff.toFixed(1)} hrs`;
                                    }

                                    return (
                                        <TableRow key={log._id.toString()} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="pl-6 font-medium">
                                                {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </TableCell>
                                            <TableCell>
                                                {checkIn ? (
                                                    <div className="flex items-center text-green-600 dark:text-green-400">
                                                        <Clock className="w-3 h-3 mr-2" />
                                                        {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {checkOut ? (
                                                    <div className="flex items-center text-orange-600 dark:text-orange-400">
                                                        <Clock className="w-3 h-3 mr-2" />
                                                        {checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {hours}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        log.status === "Present" ? "success" :
                                                            log.status === "Absent" ? "destructive" :
                                                                log.status === "Half-day" ? "warning" : "secondary"
                                                    }
                                                    className="rounded-full"
                                                >
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

