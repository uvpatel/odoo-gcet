"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { runPayroll } from "@/app/actions/payroll.actions";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
            {pending ? "Processing..." : "Run Payroll"}
        </Button>
    );
}

const initialState = {
    message: "",
    success: false
};

export function RunPayrollDialog() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(runPayroll, initialState);

    // Close dialog on success
    if (state.success && open) {
        setOpen(false);
        toast.success(state.message);
        // Reset state helper if needed, but here we just rely on unmount/remount usually or manual reset if persistent
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Run Payroll</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Run Payroll</DialogTitle>
                    <DialogDescription>
                        Calculate and generate payroll records for all active employees for a specific month.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="month">Month</Label>
                        <Select name="month" required defaultValue={new Date().getMonth().toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="year">Year</Label>
                        <Select name="year" required defaultValue={new Date().getFullYear().toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {[0, 1, 2].map((i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {!state.success && state.message && (
                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{state.message}</p>
                    )}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
