import { Suspense } from "react";
import { getDashboardStats, getRecentCheckIns } from "@/lib/services/dashboard.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Users, UserCheck, UserMinus, CalendarOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic"; // Ensure real-time data

async function DashboardContent() {
    const [stats, recentActivity] = await Promise.all([
        getDashboardStats(),
        getRecentCheckIns()
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Employees"
                    value={stats.totalUsers}
                    description="Active workforce"
                    icon={<Users className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.1}
                />
                <StatsCard
                    title="Present Today"
                    value={stats.presentToday}
                    description={`${stats.attendanceRate}% attendance rate`}
                    icon={<UserCheck className="h-4 w-4" />}
                    colorClass="text-green-600 bg-green-100 dark:bg-green-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="On Leave"
                    value={stats.activeLeaves}
                    description="Approved leaves"
                    icon={<UserMinus className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="Pending Requests"
                    value={stats.pendingLeaves}
                    description="Requires attention"
                    icon={<CalendarOff className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.4}
                />
            </div>

            {/* Main Content Split */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7 h-full">
                <RecentActivityList activities={recentActivity} />
                <QuickActions />
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7 h-96">
                <div className="lg:col-span-4 h-full rounded-xl bg-muted/20 animate-pulse border border-border/50" />
                <div className="lg:col-span-3 h-full rounded-xl bg-muted/20 animate-pulse border border-border/50" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h2>
                    <p className="text-muted-foreground">
                        {date}
                    </p>
                </div>
                <div>
                    <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Link href="/dashboard/attendance/new">
                            <Clock className="mr-2 h-4 w-4" />
                            Manual Check-in
                        </Link>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
