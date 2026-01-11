"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce"; // I might need to create this

export function AttendanceFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set("q", debouncedSearch);
        } else {
            params.delete("q");
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedSearch, pathname, router, searchParams]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search employee..."
                className="pl-9 bg-background/50 border-none ring-1 ring-border/50 focus-visible:ring-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}
