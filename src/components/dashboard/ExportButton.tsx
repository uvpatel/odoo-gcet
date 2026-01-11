"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    data: any[];
    filename: string;
    columns: { header: string; key: string | ((item: any) => string) }[];
}

export function ExportButton({ data, filename, columns }: ExportButtonProps) {
    const handleExport = () => {
        const headers = columns.map(col => col.header).join(",");
        const rows = data.map(item => {
            return columns.map(col => {
                let value;
                if (typeof col.key === 'function') {
                    value = col.key(item);
                } else {
                    value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                }
                // Handle potential undefined/null and escaping for CSV
                const stringValue = value !== undefined && value !== null ? String(value) : "";
                return `"${stringValue.replace(/"/g, '""')}"`;
            }).join(",");
        });

        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary hover:text-primary-foreground transition-all">
            <Download className="mr-2 h-4 w-4" />
            Download Report
        </Button>
    );
}
