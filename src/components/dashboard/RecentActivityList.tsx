"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Briefcase, ArrowRight } from "lucide-react";
import { RecentActivity } from "@/services/dashboard.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function RecentActivityList({ activities }: { activities: RecentActivity[] }) {
    return (
        <Card className="col-span-1 lg:col-span-4 h-full border-none shadow-sm ring-1 ring-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Live Attendance
                </CardTitle>
                <CardDescription>Real-time updates from your team today.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3 bg-muted/10 rounded-xl border border-dashed">
                            <div className="p-3 bg-background rounded-full">
                                <Clock className="h-6 w-6 opacity-40" />
                            </div>
                            <p className="text-sm">No check-ins recorded yet today.</p>
                        </div>
                    ) : (
                        activities.map((activity, i) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="flex items-center justify-between group p-3 hover:bg-muted/50 rounded-xl transition-all border border-transparent hover:border-border/50"
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                        <AvatarImage src={activity.user.image} alt={activity.user.name} className="object-cover" />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                            {activity.user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                                            {activity.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Briefcase className="h-3 w-3" />
                                            {activity.user.jobTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        {activity.checkIn ? activity.checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Checked In'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary group" asChild>
                        <Link href="/dashboard/attendance">
                            View Full Report <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
