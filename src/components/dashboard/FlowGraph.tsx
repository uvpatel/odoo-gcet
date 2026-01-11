"use client";

import { motion } from "framer-motion";

const flowData = [
    { time: "9:00 AM", event: "Check In", type: "start" },
    { time: "10:30 AM", event: "Design Sync", type: "meeting" },
    { time: "1:00 PM", event: "Lunch Break", type: "break" },
    { time: "2:00 PM", event: "Coding Session", type: "work" },
    { time: "5:00 PM", event: "Wrap Up", type: "end" },
];

export function FlowGraph() {
    return (
        <div className="relative h-[200px] w-full flex items-center justify-between px-10">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10" />

            {/* Animated Flow Line */}
            <motion.div
                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {flowData.map((item, index) => (
                <motion.div
                    key={index}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                >
                    <div className={`
              h-4 w-4 rounded-full border-2 
              ${item.type === 'start' ? 'border-emerald-500 bg-emerald-500' :
                            item.type === 'end' ? 'border-amber-500 bg-background' :
                                'border-primary bg-background'
                        }
           `} />
                    <div className="text-xs font-medium">{item.time}</div>
                    <div className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        {item.event}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
