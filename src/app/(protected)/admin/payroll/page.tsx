import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import { RunPayrollDialog } from "@/components/dashboard/RunPayrollDialog";
import { requireRole } from "@/lib/auth";
import { Banknote, CreditCard, TrendingUp, Users, Download, Eye } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/dashboard/ExportButton";

export default async function PayrollPage({
    searchParams
}: {
    searchParams: { month?: string }
}) {
    await connectDB();
    const user = await requireRole(["admin"]);

    // Calculate Latest Month Stats
    const latestPayrollsList = await Payroll.find()
        .sort({ month: -1 })
        .limit(1);

    const currentMonth = searchParams.month || latestPayrollsList[0]?.month || new Date().toISOString().slice(0, 7);

    const monthlyPayrolls = await Payroll.find({ month: currentMonth })
        .populate("user", "name email salary");

    const totalPayout = monthlyPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalDeductions = monthlyPayrolls.reduce((sum, p) => sum + p.deductions, 0);
    const avgSalary = monthlyPayrolls.length > 0 ? totalPayout / monthlyPayrolls.length : 0;

    // Fetch All Payrolls for list
    const payrolls = await Payroll.find()
        .populate("user", "name email profileImage")
        .sort({ month: -1 })
        .limit(50);

    const serializedPayrolls = payrolls.map(p => ({
        ...p.toObject(),
        _id: p._id.toString(),
        user: p.user ? {
            name: (p.user as any)?.name,
            email: (p.user as any)?.email
        } : null
    }));

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Payroll Management
                    </h2>
                    <p className="text-muted-foreground">
                        Manage employee salaries, deductions and payouts
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportButton
                        data={serializedPayrolls}
                        filename={`payroll_report_${new Date().toISOString().split('T')[0]}`}
                        columns={[
                            { header: "Employee", key: "user.name" },
                            { header: "Email", key: "user.email" },
                            { header: "Month", key: "month" },
                            { header: "Base Salary", key: "baseSalary" },
                            { header: "Deductions", key: "deductions" },
                            { header: "Net Salary", key: "netSalary" }
                        ]}
                    />
                    {user.role === "admin" && <RunPayrollDialog />}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Payout"
                    value={`$${totalPayout.toLocaleString()}`}
                    description={`For ${currentMonth}`}
                    icon={<Banknote className="h-4 w-4" />}
                    colorClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
                    trend="+4.3% from last month"
                    delay={0.1}
                />
                <StatsCard
                    title="Employees Paid"
                    value={monthlyPayrolls.length}
                    description="Successfully processed"
                    icon={<Users className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="Total Deductions"
                    value={`$${totalDeductions.toLocaleString()}`}
                    description="Tax & other benefits"
                    icon={<CreditCard className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="Avg. Net Salary"
                    value={`$${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    description="Per employee"
                    icon={<TrendingUp className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.4}
                />
            </div>

            {/* Main Table Card */}
            <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg font-semibold">Salary History</CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            Showing records for all months
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t border-border/50">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6">Employee</TableHead>
                                    <TableHead>Month</TableHead>
                                    <TableHead>Base Salary</TableHead>
                                    <TableHead>Deductions</TableHead>
                                    <TableHead>Net Salary</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No payroll records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payrolls.map((payroll) => (
                                        <TableRow key={payroll._id.toString()} className="hover:bg-muted/20 transition-colors group">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{payroll.user?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{payroll.user?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-medium">
                                                    {payroll.month}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                ${payroll.baseSalary.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm text-destructive">
                                                -${payroll.deductions.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                ${payroll.netSalary.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

