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
    const contentRef = useRef<HTMLDivElement>(null);
    const cloudLeftRef = useRef<HTMLDivElement>(null);
    const cloudRightRef = useRef<HTMLDivElement>(null);
    const cloudBgLeftRef = useRef<HTMLDivElement>(null);
    const cloudBgRightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            // Phase 1: Content fades out (0% → 40% of scroll)
            tl.to(contentRef.current, {
                opacity: 0,
                y: -40,
                duration: 0.4,
            }, 0);

            // Phase 2: Cloud panels split apart (30% → 100%)
            tl.to(cloudLeftRef.current, {
                x: "-100%",
                duration: 0.7,
                ease: "power2.inOut",
            }, 0.3);

            tl.to(cloudRightRef.current, {
                x: "100%",
                duration: 0.7,
                ease: "power2.inOut",
            }, 0.3);

            // Phase 3: Background cloud layers fade (50% → 100%)
            tl.to(cloudBgLeftRef.current, {
                opacity: 0,
                duration: 0.4,
            }, 0.5);

            tl.to(cloudBgRightRef.current, {
                opacity: 0,
                duration: 0.4,
            }, 0.5);

        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative h-[200vh] w-full">
            {/* Sticky container with overflow visible so clouds extend into next section */}
            <div className="sticky top-0 h-screen overflow-visible flex items-center justify-center">
                {/* 
                <div
                    ref={cloudBgLeftRef}
                    className="absolute left-0 w-full h-[60%] will-change-transform mix-blend-screen opacity-20"
                    style={{
                        bottom: '10%',
                        animation: "cloudDriftLeft 20s ease-in-out infinite alternate",
                    }}
                >
                    <img
                        src="/images/cloud_left.png"
                        alt=""
                        className="w-full h-full object-cover block"
                        style={{ display: 'block', verticalAlign: 'bottom', margin: 0, padding: 0, border: 'none' }}
                    />
                </div>
                <div
                    ref={cloudBgRightRef}
                    className="absolute right-0 w-full h-[60%] will-change-transform mix-blend-screen opacity-20"
                    style={{
                        bottom: '10%',
                        animation: "cloudDriftRight 20s ease-in-out infinite alternate",
                    }}
                >
                    <img
                        src="/images/cloud_right.png"
                        alt=""
                        className="w-full h-full object-cover block"
                        style={{ display: 'block', verticalAlign: 'bottom', margin: 0, padding: 0, border: 'none' }}
                    />
                </div>

                <div
                    ref={cloudLeftRef}
                    className="absolute left-0 w-[25%] md:w-[45%] h-[50%] will-change-transform mix-blend-screen opacity-25 md:opacity-35"
                    style={{
                        bottom: '5%',
                        transformOrigin: "left bottom",
                    }}
                >
                    <img
                        src="/images/cloud_left.png"
                        alt=""
                        className="w-full h-full object-contain block"
                        style={{ display: 'block', verticalAlign: 'bottom', margin: 0, padding: 0, border: 'none' }}
                    />
                </div>
                <div
                    ref={cloudRightRef}
                    className="absolute right-0 w-[25%] md:w-[45%] h-[50%] will-change-transform mix-blend-screen opacity-25 md:opacity-35"
                    style={{
                        bottom: '5%',
                        transformOrigin: "right bottom",
                    }}
                >
                    <img
                        src="/images/cloud_right.png"
                        alt=""
                        className="w-full h-full object-contain block"
                        style={{ display: 'block', verticalAlign: 'bottom', margin: 0, padding: 0, border: 'none' }}
                    />
                </div> 

                <div
                    className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))" }}
                />

                <div
                    className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 100% 40% at 50% 100%, #d1a964 0%, transparent 70%)",
                        opacity: 0.5,
                    }}
                />

                */}
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
                <div
                    ref={contentRef}
                    className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3 sm:px-6 md:px-8"
                >
                    <div className="w-full max-w-4xl md:max-w-5xl mx-auto">

                        {/* Main Headline - centered */}
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

                        {/* Subheadline - centered */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-[#2D3A6B] max-w-lg md:max-w-xl mx-auto mb-6 md:mb-12 font-light leading-relaxed text-center px-4"
                        >
                            Learns how you learn, and teaches you to mastery. <br className="hidden md:block" />
                            Enabling a billion geniuses through adaptive AI.
                        </motion.p>

                    </div>
                </div>

            </div>
        </section>
    );
}
