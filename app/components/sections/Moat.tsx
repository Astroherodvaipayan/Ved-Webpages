// app/components/sections/Moat.tsx

"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { SlideInText } from "../ui/TextAnimations";
import { shouldSnap, snapToSection, recordSectionEntrance } from "@/app/utils/scrollSnap";

gsap.registerPlugin(ScrollTrigger);

const orbitingUsers = [1, 2, 3, 4, 5, 6].map((i) => ({
    id: i,
    left: `calc(50% - 24px + ${Math.cos((i * 60) * Math.PI / 180) * 180}px)`,
    top: `calc(50% - 24px + ${Math.sin((i * 60) * Math.PI / 180) * 180}px)`,
    duration: 30 + i * 5
}));

const CONFIG = {
    nextSectionId: 'future-experience',
    animationCompleteProgress: 0.85,
    triggerBufferPx: 10,
    scrollDuration: 1.2,
};

export default function Moat() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const lenis = useLenis();
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const SECTION_ID = 'moat';

    useEffect(() => {
        if (!lenis) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(visualRef.current,
                { opacity: 0, x: 100, rotateY: -20, scale: 0.8 },
                {
                    opacity: 1, x: 0, rotateY: 0, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [lenis]);

    // Scroll snap to next section (JoinRevolution)
    useEffect(() => {
        if (!lenis) return;
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (shouldSnap(self, CONFIG.animationCompleteProgress, CONFIG.triggerBufferPx, isSnapping, hasTriggered, SECTION_ID)) {
                        snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                    }

                    // Reset trigger flag when scrolling back up
                    if (self.progress < CONFIG.animationCompleteProgress && self.direction === -1) {
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
                },
                onLeaveBack: () => {
                    hasTriggered.current = false;
                }
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
        };
    }, [lenis]);

    const points = [
        "Every interaction builds a detailed learner profile.",
        "Profiles are compared with similar learners across the network.",
        "The system predicts how to best teach the next concept to this user.",
    ];

    return (
        <section id="moat" ref={sectionRef} className="relative w-full py-16 md:py-40 px-4 md:px-6 overflow-hidden bg-transparent z-10">
            {/* Background Orbital Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="relative w-[300px] h-[300px] md:w-[800px] md:h-[800px] border border-accent-primary/5 rounded-full opacity-30"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-primary shadow-[0_0_20px_var(--color-accent-primary)]"
                    />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[200px] h-[200px] md:w-[600px] md:h-[600px] border border-accent-primary/5 rounded-full opacity-30"
                >
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-secondary shadow-[0_0_20px_var(--color-accent-secondary)]"
                    />
                </motion.div>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[150px] h-[150px] md:w-[400px] md:h-[400px] border border-accent-primary/5 rounded-full opacity-20"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Text Content */}
                <div>
                    <SlideInText direction="left" delay={0.1}>
                        <h2 className="text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-12">
                            Intelligence that <br />
                            <span className="text-gradient">compounds</span> with every interaction.
                        </h2>
                    </SlideInText>

                    <div className="space-y-8">
                        {points.map((point, i) => (
                            <SlideInText key={i} direction="left" delay={0.2 + i * 0.1}>
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    className="flex items-start gap-6 group cursor-pointer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, borderColor: "var(--color-accent-primary)" }}
                                        className="w-8 h-8 rounded-full border border-accent-primary/10 flex items-center justify-center text-xs font-mono transition-colors duration-300 shrink-0"
                                    >
                                        {i + 1}
                                    </motion.div>
                                    <p className="text-xl text-[#2D3A6B] group-hover:text-[#0A0F2E] transition-colors duration-300">
                                        {point}
                                    </p>
                                </motion.div>
                            </SlideInText>
                        ))}
                    </div>
                </div>

                {/* Visual: Feedback Loop */}
                <div ref={visualRef} className="relative flex items-center justify-center aspect-square md:aspect-auto h-[300px] md:h-[500px] opacity-0" style={{ perspective: "1000px" }}>
                    {/* Central Node */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                "0 0 40px rgba(139, 92, 246, 0.2)",
                                "0 0 80px rgba(139, 92, 246, 0.4)",
                                "0 0 40px rgba(139, 92, 246, 0.2)"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-32 h-32 rounded-full bg-white border border-accent-primary/10 flex items-center justify-center relative z-10"
                    >
                        <svg className="w-16 h-16 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v10" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22v-7" />
                        </svg>
                    </motion.div>

                    {/* Pulse rings */}
                    {[1, 2, 3].map((r) => (
                        <motion.div
                            key={r}
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: r * 0.7 }}
                            className="absolute w-32 h-32 rounded-full border-2 border-accent-tertiary pointer-events-none"
                        />
                    ))}

                    {/* Orbiting Users */}
                    {orbitingUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            className="absolute w-12 h-12 rounded-full bg-white border border-accent-primary/10 flex items-center justify-center text-lg shadow-lg"
                            animate={{ rotate: 360 }}
                            style={{ left: user.left, top: user.top }}
                            whileHover={{ scale: 1.3, zIndex: 20 }}
                            transition={{ duration: user.duration, repeat: Infinity, ease: "linear" }}
                        >
                            👤
                        </motion.div>
                    ))}

                    {/* Data flow lines */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <svg className="w-full h-full">
                            <motion.circle
                                cx="50%" cy="50%" r="180"
                                stroke="url(#orbit-gradient)"
                                strokeWidth="2"
                                strokeDasharray="10 10"
                                fill="none"
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: -100 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                            <defs>
                                <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.3" />
                                    <stop offset="50%" stopColor="var(--color-accent-secondary)" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
