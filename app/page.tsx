import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[100px]" />
            </div>

            <div className="z-10 flex flex-col items-center text-center space-y-8 px-4">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary mb-6 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground">Hackathon Edition 2026</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                        Dayflow
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-[600px] mx-auto">
                        The HRMS that flows with your day.
                        <br />
                        Attendance, Workflow, and Analytics in one fluid motion.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <Link
                        href="/dashboard"
                        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                    >
                        <span className="mr-2">Enter the Flow</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="#"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Learn More
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-4 text-xs text-muted-foreground/50">
                Built for Odoo Hackathon 2026
            </footer>
        </main>
    );
}
