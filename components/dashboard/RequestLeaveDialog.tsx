"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { requestLeave } from "@/app/actions/leave.actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Request
        </Button>
    );
}

export function RequestLeaveDialog() {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<any>(null);

    async function clientAction(formData: FormData) {
        const result = await requestLeave(null, formData);
        setState(result);
        if (result.success) {
            setOpen(false);
            alert("Leave Requested!"); // Replace with toast
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Request Leave
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Leave</DialogTitle>
                    <DialogDescription>
                        Submit a leave request for approval.
                    </DialogDescription>
                </DialogHeader>
                <form action={clientAction} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Leave Type</Label>
                        <Select name="type" required defaultValue="Paid">
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Paid">Paid Leave</SelectItem>
                                <SelectItem value="Sick">Sick Leave</SelectItem>
                                <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="from">From</Label>
                            <Input id="from" name="from" type="date" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="to">To</Label>
                            <Input id="to" name="to" type="date" required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea id="reason" name="reason" placeholder="Brief reason for leave..." required />
                    </div>

                    {state?.message && !state.success && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
