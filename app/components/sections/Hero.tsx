"use client";

import { useRef, useState, useEffect } from "react";
import { SlicedReveal } from "../ui/SlicedReveal";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

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
        <span className="inline-block">
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                    animate={trigger ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                    transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`inline-block ${className}`}
                >
                    {words[currentIndex]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}


export default function Hero({ isActive = true }: { isActive?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-linked parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const glowY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Mouse Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set((clientX / innerWidth - 0.5) * 30);
        mouseY.set((clientY / innerHeight - 0.5) * 30);
    };

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    return (
        <section
            id="hero"
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-bg-primary perspective-1000"
            onMouseMove={handleMouseMove}
            ref={containerRef}
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ y: glowY1, x: springX }}
                    className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-accent-primary/15 rounded-full blur-[150px]"
                />
                <motion.div
                    style={{ y: glowY2, x: springY }}
                    className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent-secondary/15 rounded-full blur-[150px]"
                />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="eyebrow mb-8 relative"
                >
                    <span className="relative z-10">Deep-Tech Infrastructure</span>
                    <div className="absolute inset-0 bg-accent-primary/20 blur-xl -z-10" />
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-black tracking-tighter text-white mb-8 w-full max-w-5xl"
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.div
                        className="block mb-2 text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                    >
                        <SlicedReveal text="WE ARE BUILDING" delay={0.4} trigger={isActive} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.55, duration: 0.5 }}
                        className="block mb-2"
                    >
                        <span className="text-white text-[clamp(2.5rem,8vw,5.5rem)] mr-4 leading-[0.9]">THE</span>
                        <SlotMachineText
                            words={["META-LEARNING", "ADAPTIVE", "INTELLIGENT"]}
                            interval={2500}
                            trigger={isActive}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                        />
                    </motion.div>
                    <motion.div
                        className="block text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                    >
                        <SlicedReveal text="AGENT." delay={0.7} trigger={isActive} />
                    </motion.div>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto mb-12 font-light leading-relaxed"
                >
                    Learns how you learn, and teaches you to mastery. <br className="hidden sm:block" />
                    Enabling a billion geniuses through adaptive AI.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 240, 255, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary group relative px-8 py-4 text-sm sm:text-base cursor-pointer"
                    >
                        <span className="relative z-10">Get Early Access</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                        />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, borderColor: "rgba(0, 240, 255, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 text-sm sm:text-base text-white border border-white/10 rounded-full hover:bg-white/5 transition-all uppercase tracking-widest font-semibold font-montserrat cursor-pointer"
                    >
                        View Research
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest text-white/40">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2"
                >
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-accent-primary"
                    />
                </motion.div>
            </motion.div>
        </section >
    );
}
