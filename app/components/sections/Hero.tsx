"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { shouldSnap, snapToSection, recordSectionEntrance } from "@/app/utils/scrollSnap";

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
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);
    const SECTION_ID = 'hero';
    
    // Configuration
    const CONFIG = {
        nextSectionId: 'mission', // The ID of the Mission section which contains the TeacherScrollSequence
        triggerBufferPx: 10,
        scrollDuration: 1.2,
        triggerRatio: 0.1, // trigger at 10% scroll of this section
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !lenis || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom+=50% top",
                onUpdate: (self) => {
                    if (shouldSnap(self, CONFIG.triggerRatio, CONFIG.triggerBufferPx, isSnapping, hasTriggered, SECTION_ID)) {
                        snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                    }

                    if (self.progress < CONFIG.triggerRatio && self.direction === -1) {
                        hasTriggered.current = false;
                        isSnapping.current = false;
                    }
                },
                onEnter: () => {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                },
                onEnterBack: () => {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                }
            });

            const refreshTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 300);

            return () => {
                clearTimeout(refreshTimer);
            };

        }, sectionRef);

        return () => {
            ctx.revert();
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
        };
    }, [isMounted, lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, CONFIG.triggerBufferPx, CONFIG.triggerRatio]);

    return (
        <div id="hero" ref={sectionRef} className="relative w-full h-screen" style={{ zIndex: 30, backgroundColor: "#FAFBFF" }}>
            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <Image
                    src="/images/boy.png"
                    alt="Ved AI Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Dark Gradient Overlay for text readability */}
            <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    background: "linear-gradient(to right, rgba(10, 15, 46, 0.9) 0%, rgba(10, 15, 46, 0.6) 30%, rgba(10, 15, 46, 0.2) 60%, transparent 100%)"
                }}
            />

            {/* Hero text content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center z-10 pl-[2%] pr-3 sm:pr-6 md:pr-8">
                <div className="w-full max-w-4xl md:max-w-5xl">
                    <motion.h1
                        className="text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] md:leading-[1.05] font-black tracking-tight text-white mb-4 md:mb-8 w-full overflow-hidden text-left"
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
                            className="flex flex-col md:flex-row items-start md:items-center justify-start mb-1 gap-1 md:gap-4"
                        >
                            <motion.span
                                layout
                                className="text-white text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                            >
                                WAY OF
                            </motion.span>
                            <SlotMachineText
                                words={["LEARNING", "THINKING", "GROWING"]}
                                interval={2500}
                                trigger={true}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-secondary text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
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

            {/* Orange haze overlay anchored to bottom of Hero */}
            <div className="pointer-events-none absolute left-0 right-0 -bottom-[00px] h-[20vh] md:h-[38vh]">
                <div className="absolute inset-0 hero-teacher-gradient" />
            </div>
        </div>
    );
}
