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
import { useFormStatus } from "react-dom";
import { updateUser } from "@/actions/admin/employee.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                </>
            ) : (
                "Save Changes"
            )}
        </Button>
    );
}

export function EditEmployeeDialog({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    const [state, setState] = useState<any>(null);

    async function clientAction(formData: FormData) {
        const result = await updateUser(null, formData);
        setState(result);
        if (result.success) {
            onOpenChange(false);
            toast.success(result.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>
                        Make changes to the employee profile.
                    </DialogDescription>
                </DialogHeader>

                <form action={clientAction} className="grid gap-4 py-4">
                    <input type="hidden" name="userId" value={user._id.toString()} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Full Name</Label>
                        <div className="col-span-3">
                            <Input id="name" name="name" defaultValue={user.name} required className="col-span-3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <div className="col-span-3">
                            <Input id="email" name="email" type="email" defaultValue={user.email} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <div className="col-span-3">
                            <Select name="role" defaultValue={user.role}>
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
                        <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
                        <div className="col-span-3">
                            <Input id="jobTitle" name="jobTitle" defaultValue={user.jobTitle} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">Salary</Label>
                        <div className="col-span-3">
                            <Input id="salary" name="salary" type="number" defaultValue={user.salary} required />
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
