import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: {
    default: "Dayflow HRMS | Smart Human Resource Management System",
    template: "%s | Dayflow HRMS",
  },
  description:
    "Dayflow HRMS is a modern Human Resource Management System for managing employees, attendance, leave, and payroll with secure authentication and role-based access.",
  keywords: [
    "HRMS",
    "Human Resource Management System",
    "Attendance Management",
    "Leave Management System",
    "Payroll Software",
    "Employee Management",
    "HR Software",
  ],
  authors: [{ name: "Dayflow Team" }],
  creator: "Dayflow",
  applicationName: "Dayflow HRMS",
  category: "Business & Productivity",
  icons: {
    icon: "/favicon.ico",
    
  }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={cn(inter.className, "antialiased bg-background text-foreground")}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}


