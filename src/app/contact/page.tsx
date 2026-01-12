"use client";

import { ContactCard } from "@/components/shared/Contact-Page/ContactCard";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

// bg-slate-900
export default function ContactPage() {
  return (
    <>
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-gray-400 z-20 mask-[radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        Tailwind is Awesome
      </h1>
      <p className="text-center mt-2 text-neutral-300 relative z-20">
        Framer motion is the best animation library ngl
      </p>
    </div>
    <ContactCard />
    </>

  );
}
