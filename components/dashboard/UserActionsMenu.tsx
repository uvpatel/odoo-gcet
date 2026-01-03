"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toggleUserStatus } from "@/app/actions/user.actions";
import { toast } from "sonner";

interface UserActionsMenuProps {
    userId: string;
    isActive: boolean;
}

export function UserActionsMenu({ userId, isActive }: UserActionsMenuProps) {
    const handleStatusToggle = async () => {
        const result = await toggleUserStatus(userId);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toast.info("Profile view coming soon")}>
                    View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Edit details coming soon")}>
                    Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className={isActive ? "text-destructive focus:text-destructive" : "text-green-600 focus:text-green-600"}
                    onClick={handleStatusToggle}
                >
                    {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
