import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Dayflow HRMS",
    description: "Modern Human Resource Management System",
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


