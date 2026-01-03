"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Users,
    Clock,
    Calendar,
    LayoutDashboard,
    LogOut,
    Settings,
    Activity
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Activity, label: "My Flow", href: "/dashboard/flow" },
    { icon: Users, label: "Directory", href: "/dashboard/directory" },
    { icon: Clock, label: "Attendance", href: "/dashboard/attendance" },
    { icon: Calendar, label: "Leaves", href: "/dashboard/leaves" },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { signOut } = useClerk();

    return (
        <div className="flex h-screen w-64 flex-col bg-card border-r border-border shadow-sm pt-8 pb-4">
            <div className="px-6 mb-10 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold font-tracking-tight text-foreground">Dayflow</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group",
                                isActive
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/25"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className={cn("h-5 w-5 relative z-10", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                            <span className={cn("font-medium relative z-10", isActive ? "font-semibold" : "")}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 mt-auto">
                <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
