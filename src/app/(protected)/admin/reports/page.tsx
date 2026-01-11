import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Payroll from "@/models/Payroll";
import { ReportsCharts } from "@/components/dashboard/ReportsCharts";

async function getReports() {
    await connectDB();

    const attendanceReport = await Attendance.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                present: {
                    $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
                },
                total: { $sum: 1 }
            }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
    ]);

    const payrollReport = await Payroll.aggregate([
        {
            $group: {
                _id: "$month", // Use "month" field (string YYYY-MM) directly
                totalPayout: { $sum: "$netSalary" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return { attendanceReport, payrollReport };
}

import { requireRole } from "@/lib/auth";

export default async function ReportsPage() {
    await requireRole(["admin"]);
    const { attendanceReport, payrollReport } = await getReports();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>

            {/* Charts Section */}
            <ReportsCharts attendanceData={attendanceReport} payrollData={payrollReport} />

            {/* Summary KPI Cards could go here if needed, but charts cover it */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Data Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Generated from {attendanceReport.length} days of attendance and {payrollReport.length} payroll cycles.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
