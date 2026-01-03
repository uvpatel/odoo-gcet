"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Clock, CheckCircle2, LogOut } from "lucide-react";
import { checkInAction, checkOutAction } from "@/app/actions/attendance.actions";
import { toast } from "sonner"; // Assuming sonner is available or we use basic alert
import { motion } from "framer-motion";

interface CheckInProps {
    initialData: {
        checkIn: Date | null;
        checkOut: Date | null;
        status: string;
    } | null;
}

export function CheckInInterface({ initialData }: CheckInProps) {
    const [isPending, startTransition] = useTransition();

    // We can use optimistic updates if we want, but for simplicity/correctness we rely on server revalidation
    // However, since we passed initialData, we might want local state to update immediately
    // For Hackathon demo: simple state override after success
    const [status, setStatus] = useState<"none" | "checked-in" | "checked-out">(
        initialData?.checkOut ? "checked-out" :
            initialData?.checkIn ? "checked-in" : "none"
    );

    const handleCheckIn = () => {
        startTransition(async () => {
            const res = await checkInAction();
            if (res.success) {
                setStatus("checked-in");
                alert("Checked in successfully!"); // Replace with toast
            } else {
                alert(res.message);
            }
        });
    };

    const handleCheckOut = () => {
        startTransition(async () => {
            const res = await checkOutAction();
            if (res.success) {
                setStatus("checked-out");
                alert("Checked out successfully!");
            } else {
                alert(res.message);
            }
        });
    };

    return (
        <Card className="max-w-md mx-auto mt-8 border-none shadow-xl ring-1 ring-border/50 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 text-primary animate-in zoom-in duration-500">
                    <Clock className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">Attendance Tracker</CardTitle>
                <CardDescription>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    Status:
                    <span className={`px-2 py-1 rounded-full text-xs ${status === "checked-in" ? "bg-green-100 text-green-700" :
                            status === "checked-out" ? "bg-gray-100 text-gray-700" :
                                "bg-yellow-100 text-yellow-700"
                        }`}>
                        {status === "none" ? "Not Checked In" :
                            status === "checked-in" ? "Currently Working" : "Shift Completed"}
                    </span>
                </div>

                {/* Actions */}
                <div className="grid gap-4">
                    {status === "none" && (
                        <Button
                            size="lg"
                            className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                            onClick={handleCheckIn}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 animate-spin" /> : <MapPin className="mr-2" />}
                            Check In Now
                        </Button>
                    )}

                    {status === "checked-in" && (
                        <Button
                            size="lg"
                            variant="destructive"
                            className="w-full h-16 text-lg shadow-lg shadow-red-600/20"
                            onClick={handleCheckOut}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="mr-2 animate-spin" /> : <LogOut className="mr-2" />}
                            Check Out
                        </Button>
                    )}

                    {status === "checked-out" && (
                        <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                            <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                            <p>You've completed your shift for today.</p>
                            <p className="text-xs mt-1">See you tomorrow!</p>
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Server Time: {new Date().toLocaleTimeString()}
                </div>
            </CardContent>
        </Card>
    );
}
