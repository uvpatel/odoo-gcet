"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    Banknote,
    FileBarChart,
    LogOut,
    Menu,
    Hexagon,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard", roles: ["admin"] },
    { icon: LayoutDashboard, label: "Overview", href: "/employee/dashboard", roles: ["employee"] },
    { icon: ShieldCheck, label: "Admin Panel", href: "/admin/dashboard", roles: ["admin"] },
    { icon: Users, label: "Employees", href: "/admin/employees", roles: ["admin"] },
    { icon: CalendarCheck, label: "Attendance", href: "/admin/attendance", roles: ["admin"] },
    { icon: CalendarCheck, label: "Attendance", href: "/employee/attendance", roles: ["employee"] },
    { icon: CalendarDays, label: "Leaves", href: "/admin/leaves", roles: ["admin"] },
    { icon: CalendarDays, label: "Leaves", href: "/employee/leaves", roles: ["employee"] },
    { icon: Banknote, label: "Payroll", href: "/admin/payroll", roles: ["admin"] },
    { icon: Banknote, label: "Payroll", href: "/employee/payroll", roles: ["employee"] },
    { icon: FileBarChart, label: "Reports", href: "/admin/reports", roles: ["admin"] },
];

export function Sidebar({ role = "employee" }: { role?: "admin" | "employee" }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

    return (
        <motion.aside
            initial={{ width: 260 }}
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex h-screen flex-col border-r bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-50 overflow-hidden"
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between p-6 h-20 border-b border-border/50">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Hexagon className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Dayflow</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn("h-8 w-8", isCollapsed && "mx-auto")}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-hide">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="block group relative">
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div
                                className={cn(
                                    "relative flex items-center gap-x-3 rounded-xl px-3 py-3 transition-colors duration-200",
                                    isActive
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-primary")} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User / Logout Section */}
            <div className="p-4 border-t border-border/50 bg-muted/5">
                <SignOutButton>
                    <Button variant="ghost" className={cn("w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors", isCollapsed ? "justify-center px-0" : "justify-start")}>
                        <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </Button>
                </SignOutButton>
            </div>
        </motion.aside>
    );
}
