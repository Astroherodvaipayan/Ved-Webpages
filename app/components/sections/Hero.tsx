"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const irisRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current || !irisRef.current) return;

        // Initialize iris CSS variable
        irisRef.current.style.setProperty("--hole-size", "0vw");

        const ctx = gsap.context(() => {
            // GSAP pin with pinSpacing:false
            // - Hero (h-screen) gets position:fixed by GSAP
            // - No spacer added → Mission scrolls up naturally behind pinned Hero
            // - At scroll 100vh, Mission covers the viewport behind Hero
            // - Iris opens from 50%–100% of scroll (100vh–200vh), Mission is already in place
            const tl = gsap.timeline();

            // Phase 1: Content fades out (0% → 25%)
            tl.to(contentRef.current, {
                opacity: 0,
                y: -40,
                duration: 0.25,
            }, 0);

            // Phase 2: Hold (25% → 50%) – brief pause, Mission scrolling into place behind

            // Phase 3: Iris wipe (50% → 100%)
            const irisProxy = { size: 0 };
            tl.to(irisProxy, {
                size: 150,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    if (irisRef.current) {
                        irisRef.current.style.setProperty("--hole-size", `${irisProxy.size}vw`);
                    }
                },
            }, 0.5);

            ScrollTrigger.create({
                trigger: heroRef.current,
                start: "top top",
                end: "+=200vh",
                pin: true,
                pinSpacing: false,
                scrub: 1,
                animation: tl,
                onLeaveBack: () => {
                    // Reset iris when scrolling back to top
                    if (irisRef.current) {
                        irisRef.current.style.setProperty("--hole-size", "0vw");
                    }
                },
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="relative w-full h-screen" style={{ zIndex: 30 }}>
            {/* Iris mask layer — covers full viewport, mask reveals content behind */}
            <div
                ref={irisRef}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    backgroundColor: '#FAFBFF',
                    maskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 0vw), black var(--hole-size, 0vw), black 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--hole-size, 0vw), black var(--hole-size, 0vw), black 100%)',
                }}
            >
                {/* Background logo watermark */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                    <div className="relative w-full max-w-[1200px] aspect-[16/9] md:aspect-square md:max-h-[90vh]">
                        <Image
                            src="/logo-light.png"
                            alt="Ved AI Background Logo"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Hero text content */}
                <div
                    ref={contentRef}
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3 sm:px-6 md:px-8"
                >
                    <div className="w-full max-w-4xl md:max-w-5xl mx-auto">
                        <motion.h1
                            className="text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] md:leading-[1.05] font-black tracking-tight text-[#0A0F2E] mb-4 md:mb-8 w-full overflow-hidden text-center"
                        >
                            <motion.span
                                className="block mb-1 text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                BRING YOUR
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col md:flex-row items-center justify-center mb-1 gap-1 md:gap-4"
                            >
                                <motion.span
                                    layout
                                    className="text-[#0A0F2E] text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                                >
                                    WAY OF
                                </motion.span>
                                <SlotMachineText
                                    words={["LEARNING", "THINKING", "GROWING"]}
                                    interval={2500}
                                    trigger={true}
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                                />
                            </motion.span>
                            <motion.span
                                className="block text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                TO LIFE.
                            </motion.span>
                        </motion.h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
