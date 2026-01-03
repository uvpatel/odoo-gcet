"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { updateLeaveStatus } from "@/app/actions/leave.actions";
import { useState } from "react";

export function LeaveActions({ id, status }: { id: string, status: string }) {
    const [loading, setLoading] = useState(false);

    if (status !== "Pending") return null;

    const handleAction = async (action: "Approved" | "Rejected") => {
        setLoading(true);
        await updateLeaveStatus(id, action);
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                onClick={() => handleAction("Approved")}
                disabled={loading}
                title="Approve"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={() => handleAction("Rejected")}
                disabled={loading}
                title="Reject"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
        </div>
    );
}
