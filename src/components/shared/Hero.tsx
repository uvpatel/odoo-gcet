"use client";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
            <BackgroundRippleEffect />
            <div className="mt-60 w-full">
                <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
                    Every workday,
                    perfectly aligned.
                </h2>
                <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
                    The all-in-one HRMS platform designed to streamline attendance, payroll, and team management. Built for modern teams who value clarity and speed.
                </p>
            </div>
        </section>

    );
}
