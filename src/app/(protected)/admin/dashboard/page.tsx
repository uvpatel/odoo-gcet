import { Suspense } from "react";
import { getDashboardStats } from "@/services/dashboard.service";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { requireRole } from "@/lib/auth";
import { Users, UserCheck, UserMinus, CalendarOff, Settings, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

// 📊 app/(protected)/admin/dashboard/page.tsx
// This page:
// - Fetches dashboard metrics
// - Displays admin insights
// - Uses server components for data
// - Shows proper loading & empty states

export const dynamic = "force-dynamic";

async function AdminDashboardContent() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Employees"
                    value={stats.totalUsers}
                    description="Registered users"
                    icon={<Users className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.1}
                />
                <StatsCard
                    title="Present Today"
                    value={stats.presentToday}
                    description={`${stats.attendanceRate}% of workforce`}
                    icon={<UserCheck className="h-4 w-4" />}
                    colorClass="text-green-600 bg-green-100 dark:bg-green-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="Pending Approvals"
                    value={stats.pendingLeaves}
                    description="Leave requests"
                    icon={<CalendarOff className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="System Status"
                    value="Healthy"
                    description="All services operational"
                    icon={<Activity className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.4}
                />
            </div>

            {/* Admin Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">User Management</h3>
                            <p className="text-sm text-muted-foreground">Manage employees & roles</p>
                        </div>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/admin/employees">Manage Users</Link>
                    </Button>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                            <CalendarOff className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Leave Requests</h3>
                            <p className="text-sm text-muted-foreground">Approve or reject leaves</p>
                        </div>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/admin/leaves">View Requests</Link>
                    </Button>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">System Settings</h3>
                            <p className="text-sm text-muted-foreground">Configure application</p>
                        </div>
                    </div>
                    <Button className="w-full" variant="outline" disabled>
                        Coming Soon
                    </Button>
                </div>
            </div>
        </div>
    );
}

function AdminSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-muted/20 animate-pulse border border-border/50" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-3 h-48">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-full rounded-xl bg-muted/20 animate-pulse border border-border/50" />
                ))}
            </div>
        </div>
    );
}

export default async function AdminPage() {
    try {
        await requireRole(["admin"]);
    } catch (error) {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Admin Panel
                    </h2>
                    <p className="text-muted-foreground">
                        System overview and management controls
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-sm font-medium flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        Administrator Access
                    </div>
                </div>
            </div>

            <Suspense fallback={<AdminSkeleton />}>
                <AdminDashboardContent />
            </Suspense>
        </div>
    );
}
