import { AppLayout } from "@/components/AppLayout";
import { getAuthUser } from "@/lib/auth";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAuthUser();
    const role = (user?.role as "admin" | "employee") || "employee";

    return <AppLayout role={role}>{children}</AppLayout>;
}
