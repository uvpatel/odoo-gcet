import { Header } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout({ children, role }: { children: React.ReactNode, role?: "admin" | "employee" }) {
    return (
        <div className="flex h-screen bg-muted/20 overflow-hidden">
            <Sidebar role={role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
