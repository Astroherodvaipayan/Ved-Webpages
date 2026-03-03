"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [phase, setPhase] = useState<"loading" | "flash" | "done">("loading");

    useEffect(() => {
        // Mimic the sequence:
        // 1. Show the marquee and bar for some time
        // 2. Flash white
        // 3. Complete and reveal app

        const timers = [
            setTimeout(() => setPhase("flash"), 2500), // Bar animation takes some time
            setTimeout(() => {
                setPhase("done");
                onComplete();
            }, 3200),
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);


    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    id="preloader"
                    className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8 uppercase tracking-[0.4rem] font-extrabold overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        background: "radial-gradient(circle at top, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.92))",
                        backgroundColor: "#030305"
                    }}
                >

                    {/* Progress Bar */}
                    <div className="preloader__bar w-[min(360px,70vw)] h-[3px] bg-white/15 relative overflow-hidden rounded-full font-sans">
                        <motion.span
                            className="absolute inset-0 w-[45%] h-full bg-gradient-to-r from-[#fff6d6] to-[#ffd192]"
                            animate={{ x: ["-100%", "140%"] }}
                            transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    <p className="text-white/60 text-xs font-medium tracking-[0.2rem]">Calibrating astral bloom...</p>

                    {/* White Flash Overlay */}
                    <AnimatePresence>
                        {phase === "flash" && (
                            <motion.div
                                className="absolute inset-0 bg-white z-[10001]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            />
                        )}
                    </AnimatePresence>

                    <style jsx>{`
            .preloader__marquee {
              animation: marquee 10s linear infinite;
            }
            @keyframes marquee {
              to { transform: translateX(-50%); }
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
