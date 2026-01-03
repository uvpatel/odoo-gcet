import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

import { getAuthUser } from "@/lib/auth";

export default async function AttendancePage() {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return null;

    const query = user.role === "admin" ? {} : { user: user._id };

    const logs = await Attendance.find(query)
        .populate("user", "name email")
        .sort({ date: -1 })
        .limit(50);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log._id.toString()}>
                                    <TableCell className="font-medium">
                                        {log.user?.name || "Unknown"}
                                        <div className="text-xs text-muted-foreground">{log.user?.email}</div>
                                    </TableCell>
                                    <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : "-"}</TableCell>
                                    <TableCell>{log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === "Absent" ? "destructive" : "success"}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
