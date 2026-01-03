import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import Leave from "@/models/Leave";
import { getAuthUser } from "@/lib/auth";
import { RequestLeaveDialog } from "@/components/dashboard/RequestLeaveDialog";
import { LeaveActions } from "@/components/dashboard/LeaveActions";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { redirect } from "next/navigation";

export default async function LeavesPage() {
    await connectDB();
    const user = await getAuthUser();

    if (!user) redirect("/sign-in");

    // RBAC for filtering
    const query = user.role === "admin" ? {} : { user: user._id };

    const leaves = await Leave.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    const serializedLeaves = leaves.map(l => ({
        ...l.toObject(),
        _id: l._id.toString(),
        user: l.user ? {
            name: (l.user as any).name,
            email: (l.user as any).email
        } : null,
        from: l.from.toISOString(),
        to: l.to.toISOString()
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Leave Requests
                    </h2>
                    <p className="text-muted-foreground">Manage time off and view history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportButton
                        data={serializedLeaves}
                        filename={`${user.role}_leaves_report_${new Date().toISOString().split('T')[0]}`}
                        columns={[
                            { header: "Employee", key: "user.name" },
                            { header: "Email", key: "user.email" },
                            { header: "Type", key: "type" },
                            { header: "From", key: "from" },
                            { header: "To", key: "to" },
                            { header: "Reason", key: "reason" },
                            { header: "Status", key: "status" }
                        ]}
                    />
                    <RequestLeaveDialog />
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                {user.role === "admin" && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaves.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No leave requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leaves.map((leave) => (
                                    <TableRow key={leave._id.toString()}>
                                        <TableCell className="font-medium">
                                            <div>{leave.user?.name || "Unknown"}</div>
                                            <div className="text-xs text-muted-foreground">{leave.user?.email}</div>
                                        </TableCell>
                                        <TableCell>{leave.type}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {new Date(leave.from).toLocaleDateString()}
                                                <span className="text-muted-foreground mx-1">→</span>
                                                {new Date(leave.to).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground" title={leave.reason}>
                                            {leave.reason}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                leave.status === "Approved" ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" :
                                                    leave.status === "Rejected" ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" :
                                                        "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                                            }>
                                                {leave.status}
                                            </Badge>
                                        </TableCell>
                                        {user.role === "admin" && (
                                            <TableCell className="text-right">
                                                <LeaveActions id={leave._id.toString()} status={leave.status} />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
