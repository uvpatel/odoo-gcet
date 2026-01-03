import { StatCard } from "@/components/dashboard/StatCard";
import { FlowGraph } from "@/components/dashboard/FlowGraph";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Morning, Alex 👋</h1>
                <p className="text-muted-foreground">Here's what's happening at Dayflow today.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Employees"
                    value="128"
                    icon={Users}
                    trend="+4% this month"
                    trendUp={true}
                />
                <StatCard
                    title="On Time Today"
                    value="112"
                    icon={CheckCircle}
                    trend="92% attendance"
                    trendUp={true}
                />
                <StatCard
                    title="Late Arrivals"
                    value="8"
                    icon={Clock}
                    trend="-2% vs yesterday"
                    trendUp={true} // Interpreted as improvement (less late)
                    trendLabelClass="text-emerald-500"
                />
                <StatCard
                    title="On Leave"
                    value="8"
                    icon={AlertCircle}
                    trend="Scheduled"
                    trendUp={false}
                    trendLabelClass="text-muted-foreground"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Real-time Activity</h3>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Recent Actions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                    <span className="text-xs font-bold">JD</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">John Doe checked in</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
