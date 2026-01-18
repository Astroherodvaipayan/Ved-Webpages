"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideInText } from "../ui/TextAnimations";

gsap.registerPlugin(ScrollTrigger);

const agents = [
    {
        name: "Planner Agents",
        description: "Decide what to teach. Analyze exam weightage and available time (X hours) to create the optimal learning path.",
        icon: "📋",
        color: "#00f0ff",
        gradient: "from-cyan-500/20 to-cyan-500/5"
    },
    {
        name: "Meta-Learning Agents",
        description: "Decide how to teach. Adapt content, speed, and complexity based on the learner's style and evolving knowledge graph.",
        icon: "🧠",
        color: "#8b5cf6",
        gradient: "from-violet-500/20 to-violet-500/5"
    },
    {
        name: "Evaluation Agents",
        description: "Ensure mastery. Evaluate answers using school-specific marking schemes, not just general correctness.",
        icon: "✅",
        color: "#ff00aa",
        gradient: "from-pink-500/20 to-pink-500/5"
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
                <p className="eyebrow mb-8">Infrastructure</p>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    Current AI tutors are limited by student motivation. We turn AI into{" "}
                    <span className="text-gradient">human-like tutors</span> — who tell you what to do,
                    rather than the other way around.
                </h2>
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
                            scale: 1.05,
                            y: -20,
                            rotateX: 5,
                            boxShadow: `0 30px 60px -15px ${agent.color}40`,
                            zIndex: 10
                        }}
                        initial={{ transformStyle: "preserve-3d" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`agent-card p-8 rounded-3xl relative z-10 group opacity-0 border border-white/10 bg-gradient-to-br ${agent.gradient} backdrop-blur-xl cursor-pointer overflow-hidden transform-gpu`}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        {/* Hover Glow */}
                        <motion.div
                            className="absolute -inset-0.5 rounded-[1.6rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none"
                            style={{ backgroundColor: agent.color }}
                        />

                        {/* Content Container (to sit above glow) */}
                        <div className="relative z-10 bg-bg-card/40 rounded-2xl p-6 h-full flex flex-col items-center text-center">
                            {/* Icon with float animation */}
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                                className="text-6xl mb-6 drop-shadow-lg"
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
