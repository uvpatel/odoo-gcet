import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, CalendarOff, Clock, UserPlus, FileText, ArrowRight, UserMinus, Briefcase } from "lucide-react";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData() {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, presentToday, pendingLeaves, activeLeaves, recentCheckIns] = await Promise.all([
        User.countDocuments({ isActive: true }),
        Attendance.countDocuments({ date: today, status: "Present" }),
        Leave.countDocuments({ status: "Pending" }),
        Leave.countDocuments({
            status: "Approved",
            from: { $lte: today },
            to: { $gte: today }
        }),
        Attendance.find({ status: "Present", date: today })
            .sort({ checkIn: -1 })
            .limit(5)
            .populate("user", "name email profileImage jobTitle")
            .lean()
    ]);

    return { totalUsers, presentToday, pendingLeaves, activeLeaves, recentCheckIns };
}

export default async function DashboardPage() {
    const { totalUsers, presentToday, pendingLeaves, activeLeaves, recentCheckIns } = await getData();

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h2>
                    <p className="text-muted-foreground">
                        {currentDate}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Link href="/dashboard/attendance/new">
                            <Clock className="mr-2 h-4 w-4" />
                            Manual Check-in
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active team members
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presentToday}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {totalUsers > 0 ? Math.round((presentToday / totalUsers) * 100) : 0}% attendance rate
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <UserMinus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLeaves}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Approved leaves today
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <CalendarOff className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingLeaves}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Recent Activity / Attendance */}
                <Card className="col-span-4 shadow-sm border-none ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle>Live Attendance</CardTitle>
                        <CardDescription>Real-time check-ins from your team today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(recentCheckIns as any[]).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3 bg-muted/10 rounded-lg border border-dashed">
                                    <div className="p-3 bg-background rounded-full shadow-sm">
                                        <Clock className="h-6 w-6 opacity-40" />
                                    </div>
                                    <p className="text-sm">No check-ins recorded yet.</p>
                                </div>
                            ) : (
                                (recentCheckIns as any[]).map((record, i) => (
                                    <div key={i} className="flex items-center justify-between group p-3 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-border/50">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                <AvatarImage src={record.user?.profileImage} alt={record.user?.name} objectFit="cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {record.user?.name?.substring(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                                                    {record.user?.name || "Unknown User"}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3" />
                                                    {record.user?.jobTitle || "Employee"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                            <Clock className="mr-1.5 h-3 w-3" />
                                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Checked In"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6 pt-2">
                            <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-primary hover:bg-transparent" asChild>
                                <Link href="/dashboard/attendance" className="flex items-center justify-center gap-2 group">
                                    <span>View Full Activity Log</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="col-span-3 space-y-6">
                    <Card className="shadow-sm border-none ring-1 ring-border/50">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage your workforce efficiently</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button variant="outline" className="w-full justify-start h-14 hover:bg-muted/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all group" asChild>
                                <Link href="/dashboard/users">
                                    <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Add Employee</div>
                                        <div className="text-xs text-muted-foreground font-normal">Onboard new team member</div>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-14 hover:bg-muted/50 hover:border-orange-200 dark:hover:border-orange-800 transition-all group" asChild>
                                <Link href="/dashboard/leaves">
                                    <div className="h-9 w-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Leave Requests</div>
                                        <div className="text-xs text-muted-foreground font-normal">Approve or reject leaves</div>
                                    </div>
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-14 hover:bg-muted/50 hover:border-green-200 dark:hover:border-green-800 transition-all group" asChild>
                                <Link href="/dashboard/attendance">
                                    <div className="h-9 w-9 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3 text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Attendance</div>
                                        <div className="text-xs text-muted-foreground font-normal">Monitor daily logs</div>
                                    </div>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Mini Report / Insight or Tip */}
                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-2xl"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 opacity-80" />
                                Payroll Reminder
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm opacity-90 mb-4 leading-relaxed">
                                Payroll processing is scheduled for the 30th. Please maximize attendance accuracy before this date.
                            </p>
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-none" asChild>
                                <Link href="/dashboard/payroll">Manage Payroll</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
