import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar }  from "@/components/shared/Navbar/Navbar"
import { ClerkProvider } from "@clerk/nextjs";
import Footer  from "@/components/shared/Footer/Footer";

import { ViewTransitions } from 'next-view-transitions'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFlow - HR Management",
  description: "Application to manage HR tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>

    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased suppressHydrationWarning`}
          >
          <Navbar />
          {children}
           <Footer />
        </body>
      </html>
    </ClerkProvider>
          </ViewTransitions>
  );
}
