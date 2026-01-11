import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/db";
import Payroll from "@/models/Payroll";
import { getAuthUser } from "@/lib/auth";
import { Banknote, CreditCard, Wallet, Download, Eye, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";

export default async function PayrollPage() {
    await connectDB();
    const user = await getAuthUser();
    if (!user) return null;

    const query = { user: user._id };

    const payrolls = await Payroll.find(query)
        .sort({ month: -1 });

    // Calculate Summary
    const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions, 0);
    const avgNet = payrolls.length > 0 ? totalNet / payrolls.length : 0;
    const latestSalary = payrolls[0]?.netSalary || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Your Payroll
                    </h2>
                    <p className="text-muted-foreground">
                        Track your earnings, deductions and view payslips
                    </p>
                </div>
                <Button variant="outline" className="w-fit">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Last Payout"
                    value={`$${latestSalary.toLocaleString()}`}
                    description="Latest month"
                    icon={<Wallet className="h-4 w-4" />}
                    colorClass="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
                    delay={0.1}
                />
                <StatsCard
                    title="Total Earned"
                    value={`$${totalNet.toLocaleString()}`}
                    description="Project to date"
                    icon={<Banknote className="h-4 w-4" />}
                    colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                    delay={0.2}
                />
                <StatsCard
                    title="Total Deductions"
                    value={`$${totalDeductions.toLocaleString()}`}
                    description="Tax & benefits"
                    icon={<CreditCard className="h-4 w-4" />}
                    colorClass="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
                    delay={0.3}
                />
                <StatsCard
                    title="Avg. Monthly"
                    value={`$${avgNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    description="Net average"
                    icon={<TrendingUp className="h-4 w-4" />}
                    colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
                    delay={0.4}
                />
            </div>

            {/* Salary History */}
            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Earnings History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="pl-6">Month</TableHead>
                                <TableHead>Base Salary</TableHead>
                                <TableHead>Deductions</TableHead>
                                <TableHead>Net Salary</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Action</TableHead>
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
                                        <TableCell className="pl-6 font-medium">
                                            <Badge variant="secondary" className="font-semibold">
                                                {payroll.month}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${payroll.baseSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-destructive">-${payroll.deductions.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                                            ${payroll.netSalary.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="success" className="rounded-full px-3">Paid</Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
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

