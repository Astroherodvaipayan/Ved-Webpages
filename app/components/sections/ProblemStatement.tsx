"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemStatement() {
    const containerRef = useRef<HTMLDivElement>(null);
    const statRef = useRef<HTMLSpanElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLSpanElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useLayoutEffect(() => {
        const isMobile = window.innerWidth <= 768;

        const ctx = gsap.context(() => {
            // Stage 1 — Headline & Path slides up on viewport entry
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: headlineRef.current, // Start when the headline itself gets on screen
                    start: "top 80%",
                    once: true,
                }
            });

            // 1. Headline Fade/Slide
            tl.fromTo(headlineRef.current,
                { y: isMobile ? 40 : 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );

            // 2. The Stat Pop & Counting Effect (starts right after headline begins)
            tl.fromTo(statRef.current,
                { scale: 0.5, opacity: 0, rotateY: -30 },
                { scale: 1, opacity: 1, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" },
                "-=0.4"
            );

            // Counter object mapping
            const counter = { val: 0 };
            tl.to(counter, {
                val: 98,
                duration: 2,
                ease: "power2.out", // smooth deceleration counting up
                onUpdate: () => {
                    if (statRef.current) {
                        statRef.current.innerHTML = Math.round(counter.val) + "%";
                    }
                }
            }, "-=1"); // overlapping over the elastic pop

            // 3. SVG Background Curve (At the same time as the headline begins)
            if (pathRef.current) {
                const pathLength = pathRef.current.getTotalLength() || 1500;
                gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 1 });

                tl.to(pathRef.current, {
                    strokeDashoffset: 0,
                    duration: 2.5,
                    ease: "power2.inOut",
                }, 0); // Absolute 0 start time on this timeline so it perfectly syncs with the headline entry
            }

            // Stage 2 — Subtitle smooth scrubs in "after certain scroll"
            gsap.fromTo(subtitleRef.current,
                { y: isMobile ? 50 : 80, opacity: 0, visibility: "hidden" as any },
                {
                    y: 0, opacity: 0.8, visibility: "visible" as any,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: subtitleRef.current,
                        start: "top 95%", // Starts right when subtitle comes into the very bottom of the screen
                        end: "top 50%",    // Finishes scrub when subtitle hits the middle
                        scrub: 1,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="problem-statement"
            ref={containerRef}
            className="relative w-full py-40 px-6 overflow-hidden flex flex-col items-center justify-center text-center bg-transparent z-10"
            style={{ minHeight: 'calc(100vh + 200px)' }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-accent-primary/5 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent-primary/5 rounded-full"
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
                    <path
                        ref={pathRef}
                        d="M0,350 Q250,350 500,50 T1000,350"
                        stroke="url(#curve-gradient)"
                        strokeWidth="3"
                        style={{ opacity: 0 }} // Initially hidden, GSAP reveals and strokes it
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
                <h2
                    ref={headlineRef}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#0A0F2E]"
                    style={{ opacity: 0 }}
                >
                    Personal tutoring improves learning outcomes by{" "}
                    <span ref={statRef} className="text-gradient inline-block opacity-0">0%</span>.
                </h2>
                <span
                    ref={subtitleRef}
                    className="text-[#6B7AA1] block mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
                    style={{ opacity: 0, visibility: "hidden" }}
                >
                    But having 8 billion teachers is impossible.
                </span>
            </div>
        </section>
    );
}

