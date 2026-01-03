"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: string; // e.g., "+12% from last month"
    colorClass?: string; // e.g., "text-primary bg-primary/10"
    delay?: number;
}

export function StatsCard({ title, value, description, icon, trend, colorClass = "text-primary bg-primary/10", delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/50 hover:shadow-md transition-all hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <div className={cn("rounded-lg p-2", colorClass)}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold tracking-tight">{value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                    {trend && (
                        <div className="mt-2 flex items-center text-xs font-medium text-green-600">
                            {trend}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
