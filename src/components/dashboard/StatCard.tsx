import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    className?: string;
    trendLabelClass?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    className,
    trendLabelClass
}: StatCardProps) {
    return (
        <div className={cn("rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md", className)}>
            <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            </div>
            {trend && (
                <div className="flex items-center mt-1">
                    {trendUp !== undefined && (
                        trendUp ?
                            <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" /> :
                            <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
                    )}
                    <span className={cn("text-xs font-medium",
                        trendLabelClass ? trendLabelClass : (trendUp ? "text-emerald-500" : "text-rose-500")
                    )}>
                        {trend}
                    </span>
                </div>
            )}
        </div>
    );
}
