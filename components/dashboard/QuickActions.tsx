"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, FileText, Clock, Settings } from "lucide-react";

export function QuickActions() {
    return (
        <Card className="col-span-1 lg:col-span-3 h-full border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks & management tools</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                {[
                    { label: "New Employee", desc: "Add to workforce", icon: UserPlus, href: "/dashboard/users", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Review Leaves", desc: "Approvals pending", icon: FileText, href: "/dashboard/leaves", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
                    { label: "Attendance", desc: "Monitor activity", icon: Clock, href: "/dashboard/attendance", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
                    //  { label: "Settings", desc: "System config", icon: Settings, href: "/dashboard/settings", color: "text-gray-600 bg-gray-50 dark:bg-gray-800" },
                ].map((action, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-start h-16 hover:bg-muted/50 hover:border-primary/20 transition-all group px-4"
                        asChild
                    >
                        <Link href={action.href}>
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${action.color} group-hover:scale-105 transition-transform`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-sm">{action.label}</div>
                                <div className="text-xs text-muted-foreground font-normal">{action.desc}</div>
                            </div>
                        </Link>
                    </Button>
                ))}

                {/* Payroll Insight Card integrated here or separately */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 rounded-full bg-white/20 blur-2xl"></div>
                    <h4 className="font-semibold text-sm mb-1 relative z-10">Payroll Reminder</h4>
                    <p className="text-xs opacity-90 mb-3 relative z-10">Run payroll by the 30th.</p>
                    <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-0" asChild>
                        <Link href="/dashboard/payroll">Process Now</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
