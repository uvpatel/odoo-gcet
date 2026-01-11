import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReportsRedirect() {
    const user = await getAuthUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === "admin") {
        redirect("/admin/reports");
    } else {
        // Employees don't have a reports page, send to dashboard
        redirect("/employee/dashboard");
    }
}
