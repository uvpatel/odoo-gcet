import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Hexagon, BarChart3, Users, ShieldCheck, Zap } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/shared/Footer";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Hexagon className="h-5 w-5 fill-current" />
                        </div>
                        Dayflow
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">Log in</Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button size="sm">Get Started</Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Button size="sm" asChild>
                                <Link href="/dashboard">
                                    Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </SignedIn>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-autoh-77.5 w-77.5 rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container flex flex-col items-center text-center gap-8">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            <span>v2.0 is now live</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl max-w-4xl bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Every workday, <br /> perfectly aligned.
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed sm:text-xl">
                            The all-in-one HRMS platform designed to streamline attendance, payroll, and team management. Built for modern teams who value clarity and speed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                                        Start for free <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" asChild>
                                    <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </SignedIn>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                View Demo
                            </Button>
                        </div>

                        {/* Abstract Dashboard Visual */}
                        <div className="mt-16 relative w-full max-w-5xl aspect-video bg-muted/20 rounded-xl border shadow-2xl overflow-hidden glass-card hidden md:block group">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            {/* Mock UI Elements */}
                            <div className="absolute top-4 left-4 right-4 h-12 bg-background rounded-lg border flex items-center px-4 gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="absolute top-20 left-4 w-60 bottom-4 bg-background rounded-lg border p-4 space-y-4">
                                <div className="h-8 w-3/4 bg-muted rounded"></div>
                                <div className="h-4 w-1/2 bg-muted rounded"></div>
                                <div className="h-4 w-full bg-muted rounded"></div>
                                <div className="h-4 w-5/6 bg-muted rounded"></div>
                            </div>
                            <div className="absolute top-20 left-72 right-4 h-64 bg-background rounded-lg border p-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-8 w-48 bg-muted rounded"></div>
                                    <div className="h-8 w-24 bg-primary/20 rounded"></div>
                                </div>
                                <div className="flex-1 bg-muted/10 rounded border border-dashed flex items-center justify-center text-muted-foreground">
                                    Interactive Dashboard Preview
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Value Props Section */}
                <section id="features" className="py-24 bg-muted/30">
                    <div className="container">
                        <div className="mb-16 text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to run your team.</h2>
                            <p className="mt-4 text-lg text-muted-foreground">Stop juggling spreadsheets and disparate tools. Dayflow brings everything into one unified operating system.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Users, title: "Team Management", desc: "Onboard, manage, and offboard employees with automated workflows and self-serve profiles." },
                                { icon: BarChart3, title: "Smart Payroll", desc: "Automate salary calculations, tax deductions, and payslip generation with zero errors." },
                                { icon: ShieldCheck, title: "Bank-Grade Security", desc: "Your data is encrypted at rest and in transit. Role-based access control keeps sensitive info safe." },
                                { icon: Zap, title: "Instant Actions", desc: "Approve leaves, mark attendance, and generate reports in milliseconds." },
                                { icon: CheckCircle2, title: "Compliance Ready", desc: "Stay compliant with local labor laws automatically. We handle the complexity for you." },
                                { icon: Hexagon, title: "Modern Design", desc: "A user interface that your team will actually enjoy using. Fast, responsive, and accessible." },
                            ].map((feature, i) => (
                                <div key={i} className="bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
