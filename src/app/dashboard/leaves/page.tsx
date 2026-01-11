import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LeavesRedirect() {
    const user = await getAuthUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === "admin") {
        redirect("/admin/leaves");
    } else {
        redirect("/employee/leaves");
    }
}
