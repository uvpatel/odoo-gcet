import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Plus, Mail, Phone, MoreHorizontal, Briefcase } from "lucide-react";
import { UserSearch } from "./search";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const { query } = await searchParams;
    await connectDB();

    const filter: any = {};
    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { jobTitle: { $regex: query, $options: "i" } },
        ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
                    <p className="text-muted-foreground">Manage your team members and their permissions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <UserSearch />
                    <Button className="bg-primary hover:bg-primary/90 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No employees found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        We couldn't find any employees matching your search. Try adjusting your filters.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {users.map((user) => (
                        <Card key={user._id.toString()} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/60">
                            <CardHeader className="relative p-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
                                <div className="absolute right-2 top-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-6 px-6">
                                <div className="flex flex-col items-center -mt-12 mb-4">
                                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                        <AvatarImage src={user.profileImage} alt={user.name} />
                                        <AvatarFallback className="text-xl bg-muted">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="mt-3 text-lg font-semibold text-center leading-tight">{user.name}</h3>
                                    <span className="text-sm text-muted-foreground text-center flex items-center gap-1 mt-1">
                                        <Briefcase className="h-3 w-3" /> {user.jobTitle || "Employee"}
                                    </span>
                                </div>

                                <div className="grid gap-3 text-sm mt-6">
                                    <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2 rounded-md transition-colors hover:bg-muted/50 hover:text-foreground">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        <span className="truncate" title={user.email}>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2 rounded-md transition-colors hover:bg-muted/50 hover:text-foreground">
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Status</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                                            <span className="text-sm font-medium">{user.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="font-normal">
                                        Department: Engineering
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
