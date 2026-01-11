"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface ReportsChartsProps {
    attendanceData: {
        _id: string; // date string
        present: number;
        total: number;
    }[];
    payrollData: {
        _id: number | string; // month
        totalPayout: number;
        count: number;
    }[];
}

export function ReportsCharts({ attendanceData, payrollData }: ReportsChartsProps) {
    // Process attendance data for the chart
    const processedAttendance = useMemo(() => {
        return attendanceData.map(d => ({
            date: d._id.split('-').slice(1).join('/'), // MM/DD
            Present: d.present,
            Absent: d.total - d.present,
            Total: d.total
        })).reverse(); // Recharts often renders left-to-right, if data is desc, reverse it
    }, [attendanceData]);

    // Process payroll data
    const processedPayroll = useMemo(() => {
        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return payrollData.map(d => {
            let label = d._id.toString();
            if (typeof d._id === 'string' && d._id.includes('-')) {
                const monthIndex = parseInt(d._id.split('-')[1]);
                if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
                    label = monthNames[monthIndex];
                } else {
                    label = d._id; // Fallback to original string if parsing fails or month is out of range
                }
            } else if (typeof d._id === 'number') {
                if (d._id >= 1 && d._id <= 12) {
                    label = monthNames[d._id];
                } else {
                    label = d._id.toString(); // Fallback to string if number is out of range
                }
            }
            return {
                month: label,
                Payout: d.totalPayout,
                Employees: d.count
            };
        });
    }, [payrollData]);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Attendance Trends (7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedAttendance}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500} />
                            <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Monthly Payroll Expenses
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedPayroll}>
                            <defs>
                                <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                            <Tooltip
                                formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, "Total Payout"]}
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Area type="monotone" dataKey="Payout" stroke="#8884d8" fillOpacity={1} fill="url(#colorPayout)" animationDuration={1500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
