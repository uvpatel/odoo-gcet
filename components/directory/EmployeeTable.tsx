import { MoreHorizontal, Mail, Phone } from "lucide-react";

const employees = [
    { id: 1, name: "Alice Johnson", role: "Product Manager", department: "Product", status: "Online", email: "alice@dayflow.app" },
    { id: 2, name: "Bob Smith", role: "Senior Developer", department: "Engineering", status: "In Focus", email: "bob@dayflow.app" },
    { id: 3, name: "Charlie Brown", role: "Designer", department: "Design", status: "Offline", email: "charlie@dayflow.app" },
    { id: 4, name: "Diana Ross", role: "HR Specialist", department: "Human Resources", status: "On Leave", email: "diana@dayflow.app" },
];

export function EmployeeTable() {
    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Role & Dept</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="group hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{emp.name}</p>
                                            <p className="text-xs text-muted-foreground">ID: #{emp.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-foreground">{emp.role}</p>
                                    <p className="text-xs text-muted-foreground">{emp.department}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${emp.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            emp.status === 'In Focus' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full 
                        ${emp.status === 'Online' ? 'bg-emerald-500' :
                                                emp.status === 'In Focus' ? 'bg-indigo-500' :
                                                    emp.status === 'On Leave' ? 'bg-amber-500' :
                                                        'bg-slate-400'
                                            }`}
                                        />
                                        {emp.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 text-muted-foreground">
                                        <button className="hover:text-primary transition-colors"><Mail className="h-4 w-4" /></button>
                                        <button className="hover:text-primary transition-colors"><Phone className="h-4 w-4" /></button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
