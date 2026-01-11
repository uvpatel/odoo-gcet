"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { toggleUserStatus } from "@/actions/admin/employee.actions";
import { toast } from "sonner";

export function UserActions({ user }: { user: any }) {
    const [editOpen, setEditOpen] = useState(false);

    async function handleToggleStatus() {
        const result = await toggleUserStatus(user._id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                        Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleToggleStatus}
                        className={user.isActive ? "text-red-500 focus:text-red-500" : "text-green-500 focus:text-green-500"}
                    >
                        {user.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditEmployeeDialog
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}
