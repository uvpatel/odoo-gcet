import { EmployeeTable } from "@/components/directory/EmployeeTable";
import { Plus, Search, Filter } from "lucide-react";

export default function DirectoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Employee Directory</h1>
                    <p className="text-muted-foreground">Manage your team and view their status.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full bg-secondary/50 pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
                    />
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary rounded-lg">
                    <Filter className="h-4 w-4" />
                </button>
            </div>

            <EmployeeTable />
        </div>
    );
}
