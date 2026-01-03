"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimer(newTimer);
    }, [callback, delay, timer]);
}

export function UserSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebounce((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search employees..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
            />
        </div>
    );
}
