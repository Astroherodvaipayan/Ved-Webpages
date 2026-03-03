"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { SlicedReveal } from "../ui/SlicedReveal";
import { motion, AnimatePresence } from "framer-motion";

// Slot machine text component - vertical rolling effect
function SlotMachineText({
    words,
    interval = 2500,
    className = "",
    trigger = true
}: {
    words: string[];
    interval?: number;
    className?: string;
    trigger?: boolean;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Fix hydration mismatch by only rendering dynamic content after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!trigger || !mounted) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, interval);
        return () => clearInterval(timer);
    }, [words.length, interval, trigger, mounted]);

    // Show first word during SSR to avoid hydration mismatch
    if (!mounted) {
        return <span className={className}>{words[0]}</span>;
    }

    return (
        <span
            className="inline-block overflow-hidden relative"
            style={{
                verticalAlign: 'baseline',
                height: '1.1em',
                lineHeight: 'inherit'
            }}
        >
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={currentIndex}
                    initial={{ y: "110%" }}
                    animate={trigger ? { y: "0%" } : { y: "110%" }}
                    exit={{ y: "-110%" }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        mass: 1
                    }}
                    className={`block ${className}`}
                    style={{ lineHeight: 'inherit' }}
                >
                    {words[currentIndex]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}


export default function Hero({ isActive = true }: { isActive?: boolean }) {
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section
            id="hero"
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden perspective-1000 z-10 bg-transparent"
            ref={containerRef}
        >
            {/* Background Logo */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-3 flex items-center justify-center p-4">
                <div className="relative w-full max-w-[1200px] aspect-[16/9] md:aspect-square md:max-h-[90vh]">
                    <Image
                        src="/logo-light.png"
                        alt="Ved AI Background Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mt-25">



                {/* Main Headline */}
                <motion.h1
                    className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-black tracking-tighter text-[#0A0F2E] mb-8 w-full max-w-5xl overflow-hidden"
                >
                    <motion.span
                        className="block mb-2 text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        BRING YOUR
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: "100%" }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
                        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-baseline justify-center mb-2 gap-4"
                    >
                        <motion.span
                            layout
                            className="text-[#0A0F2E] text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                        >
                            WAY OF
                        </motion.span>
                        <SlotMachineText
                            words={["LEARNING", "THINKING", "GROWING"]}
                            interval={2500}
                            trigger={isActive}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                        />
                    </motion.span>
                    <motion.span
                        className="block text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        TO LIFE.
                    </motion.span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-[#2D3A6B] max-w-xl mx-auto mb-12 font-light leading-relaxed"
                >
                    Learns how you learn, and teaches you to mastery. <br className="hidden sm:block" />
                    Enabling a billion geniuses through adaptive AI.
                </motion.p>


            </div>
        </section >
    );
}
