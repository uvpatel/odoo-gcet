"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
    const { user } = useUser();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background/50 backdrop-blur-md px-6 sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative hidden md:block w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full  pl-9 md:w-[300px] lg:w-[300px] border-none shadow-none bg-muted/20 focus-visible:bg-background transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                </Button>

                <div className="h-8 w-px bg-border/50 mx-1" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium leading-none">{user?.fullName || "Admin User"}</p>
                        <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || "admin@dayflow.com"}</p>
                    </div>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
