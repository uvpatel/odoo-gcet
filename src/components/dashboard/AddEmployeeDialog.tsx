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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { createUser } from "@/actions/admin/employee.actions";
import { toast } from "sonner"; // Assuming sonner or use standard toast. Usually standard toast might be in hooks/use-toast

// Submit button component for pending state
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                </>
            ) : (
                "Add Employee"
            )}
        </Button>
    );
}

export function AddEmployeeDialog({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<any>(null);

    async function clientAction(formData: FormData) {
        const result = await createUser(null, formData);
        setState(result);
        if (result.success) {
            setOpen(false);
            toast.success(result.message);
        } else {
            toast.error(result.message || "Failed to add employee");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-primary hover:bg-primary/90 shadow-sm transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                        Create a new employee profile. They can sign in using this email address.
                    </DialogDescription>
                </DialogHeader>

                <form action={clientAction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Full Name
                        </Label>
                        <div className="col-span-3">
                            <Input id="name" name="name" placeholder="John Doe" required className="col-span-3" />
                            {state?.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <div className="col-span-3">
                            <Input id="email" name="email" type="email" placeholder="john@company.com" required />
                            {state?.errors?.email && <p className="text-xs text-red-500 mt-1">{state.errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <div className="col-span-3">
                            <Select name="role" defaultValue="employee">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">Employee</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="jobTitle" className="text-right">
                            Job Title
                        </Label>
                        <div className="col-span-3">
                            <Input id="jobTitle" name="jobTitle" placeholder="Software Engineer" required />
                            {state?.errors?.jobTitle && <p className="text-xs text-red-500 mt-1">{state.errors.jobTitle}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">
                            Salary (Monthly)
                        </Label>
                        <div className="col-span-3">
                            <Input id="salary" name="salary" type="number" placeholder="50000" required />
                            {state?.errors?.salary && <p className="text-xs text-red-500 mt-1">{state.errors.salary}</p>}
                        </div>
                    </div>

                    {state?.message && !state.success && (
                        <div className="col-span-4 text-center text-sm text-red-500 font-medium bg-red-50 p-2 rounded">
                            {state.message}
                        </div>
                    )}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
