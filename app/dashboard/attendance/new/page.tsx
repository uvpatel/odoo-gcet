import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckInInterface } from "@/components/dashboard/CheckInInterface";
import { getTodayAttendance } from "@/app/actions/attendance.actions";

export default async function NewAttendancePage() {
    const data = await getTodayAttendance();

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manual Check-in</h2>
                    <p className="text-muted-foreground">Record your daily attendance.</p>
                </div>
            </div>

            <CheckInInterface initialData={data} />
        </div>
    );
}
