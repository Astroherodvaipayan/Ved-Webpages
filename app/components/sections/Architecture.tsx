"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideInText, GlitchText } from "../ui/TextAnimations";

gsap.registerPlugin(ScrollTrigger);

const agents = [
    {
        name: "Planner Agents",
        description: "Decide what to teach. Analyze exam weightage and available time (X hours) to create the optimal learning path.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="12" y2="14" />
                <path d="M8 18h2l1-1 2 2 4-4" />
            </svg>
        ),
        color: "#3B82F6",
        gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
        name: "Meta-Learning Agents",
        description: "Decide how to teach. Adapt content, speed, and complexity based on the learner's style and evolving knowledge graph.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                <path d="M9.5 2h5l.5 6h-6l.5-6Z" />
                <path d="M12 8v8" />
                <path d="M12 16a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                <path d="M5 8l3 4" />
                <path d="M19 8l-3 4" />
                <path d="M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                <path d="M19 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
        ),
        color: "#FFFFFF",
        gradient: "from-white/20 to-white/5"
    },
    {
        name: "Evaluation Agents",
        description: "Ensure mastery. Evaluate answers using school-specific marking schemes, not just general correctness.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        color: "#1E40AF",
        gradient: "from-indigo-500/20 to-indigo-500/5"
    },
];

export default function Architecture() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Dynamic 3D Reveal: Cards flip up from 90deg X rotation
            const cards = cardsRef.current?.querySelectorAll(".agent-card");
            if (cards) {
                gsap.fromTo(cards,
                    {
                        opacity: 0,
                        rotateX: -45, // Starts tilted back suitable for "flip up"
                        y: 100,
                        z: -200
                    },
                    {
                        opacity: 1,
                        rotateX: 0,
                        y: 0,
                        z: 0,
                        duration: 1.2,
                        stagger: 0.2, // Wave-like effect
                        ease: "elastic.out(1, 0.75)", // Bouncy elastic arrival
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            // Animate connection line
            const line = sectionRef.current?.querySelector(".connection-line");
            if (line) {
                gsap.fromTo(line,
                    { scaleX: 0, opacity: 0 },
                    {
                        scaleX: 1, opacity: 1,
                        duration: 1.5,
                        ease: "power3.inOut",
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-40 px-6 max-w-7xl mx-auto overflow-hidden text-center md:text-left" style={{ perspective: "1000px" }}>
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-20 right-20 w-40 h-40 bg-accent-primary/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute bottom-20 left-20 w-60 h-60 bg-accent-secondary/5 rounded-full blur-3xl"
                />
            </div>

            {/* Heading with slide-in */}
            <SlideInText direction="left" delay={0} className="max-w-4xl mb-24 mx-auto md:mx-0">
                <div className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                    <GlitchText text="Current AI tutors are limited by student motivation." className="block" />
                </div>
                <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
                    We turn AI into <span className="text-white font-medium">human-like tutors</span> — who tell you what to do, relative to your goals, rather than the other way around.
                </p>
            </SlideInText>

            {/* Agents Grid */}
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative perspective-1000">
                {/* Connection Lines (Desktop) */}
                <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] z-0 pointer-events-none">
                    <div className="connection-line w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left scale-x-0" />
                </div>

                {agents.map((agent, i) => (
                    <motion.article
                        key={i}
                        whileHover={{
                            scale: 1.02,
                            y: -10,
                        }}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 50 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                        className={`agent-card p-8 rounded-3xl relative group border border-white/10 bg-gradient-to-br ${agent.gradient} backdrop-blur-xl cursor-pointer overflow-hidden`}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        {/* Liquid Wave Glow at Bottom - Enhanced */}
                        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{
                                    x: ["-30%", "30%", "-30%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3
                                }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[250%] h-32"
                                style={{
                                    background: `radial-gradient(ellipse 80% 60% at center bottom, ${agent.color}60 0%, ${agent.color}30 30%, transparent 60%)`,
                                    filter: "blur(25px)"
                                }}
                            />
                            {/* Secondary wave for depth */}
                            <motion.div
                                animate={{
                                    x: ["20%", "-20%", "20%"],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3 + 0.5
                                }}
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[180%] h-24"
                                style={{
                                    background: `radial-gradient(ellipse 70% 50% at center bottom, ${agent.color}40 0%, transparent 50%)`,
                                    filter: "blur(15px)"
                                }}
                            />
                        </div>

                        {/* Subtle Top Border Glow on Hover */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-80 transition-opacity duration-500"
                            style={{ background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)` }}
                        />

                        {/* Content Container (to sit above glow) */}
                        <div className="relative z-10 bg-bg-card/40 rounded-2xl p-6 h-full flex flex-col items-center text-center">
                            {/* Icon with float animation */}
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                                className="mb-6 drop-shadow-lg"
                                style={{ color: agent.color }}
                            >
                                {agent.icon}
                            </motion.div>

                            <h3
                                className="text-2xl font-bold mb-4 tracking-tight transition-colors duration-300"
                                style={{ color: agent.color }}
                            >
                                {agent.name}
                            </h3>
                            <p className="text-white/60 group-hover:text-white/90 leading-relaxed text-sm transition-colors duration-300">
                                {agent.description}
                            </p>

                            {/* Interactive Arrow Button */}
                            <div className="mt-8">
                                <span
                                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold py-2 px-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all"
                                    style={{ color: agent.color }}
                                >
                                    Learn more
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >→</motion.span>
                                </span>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
