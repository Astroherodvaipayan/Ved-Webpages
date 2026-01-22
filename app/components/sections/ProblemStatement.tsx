"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideInText } from "../ui/TextAnimations";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemStatement() {
    const containerRef = useRef<HTMLDivElement>(null);
    const statRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the 98% stat with scale
            gsap.fromTo(statRef.current,
                { scale: 0.5, opacity: 0, rotateY: -30 },
                {
                    scale: 1, opacity: 1, rotateY: 0,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full py-40 px-6 overflow-hidden flex flex-col items-center justify-center text-center bg-bg-secondary"
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
                />
            </div>

            {/* Animated Background Curve */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <svg
                    viewBox="0 0 1000 400"
                    className="w-full max-w-6xl overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M0,350 Q250,350 500,50 T1000,350"
                        stroke="url(#curve-gradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                    <defs>
                        <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
                            <stop offset="50%" stopColor="var(--color-accent-primary)" stopOpacity="1" />
                            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">

                <SlideInText direction="up" delay={0.2}>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white/90">
                        Personal tutoring improves learning outcomes by{" "}
                        <span ref={statRef} className="text-gradient inline-block opacity-0">98%</span>.
                        <br />
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 0.4, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="text-white/40 block mt-4"
                        >
                            But having 8 billion teachers is impossible.
                        </motion.span>
                    </h2>
                </SlideInText>
            </div>
        </section>
    );
}
