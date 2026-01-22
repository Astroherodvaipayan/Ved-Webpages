"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlideInText } from "../ui/TextAnimations";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ end, duration = 2, shouldStart }: { end: number; duration?: number; shouldStart: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;

        const obj = { val: 0 };
        gsap.to(obj, {
            val: end,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
                setCount(Math.floor(obj.val));
            }
        });
    }, [end, duration, shouldStart]);

    return <span>{count.toLocaleString()}</span>;
}

export default function Traction() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLHeadingElement>(null);
    const [startCounter, setStartCounter] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Trigger counter on scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 70%",
                onEnter: () => setStartCounter(true),
            });

            // Number reveal animation with bounce
            gsap.fromTo(numberRef.current,
                { opacity: 0, scale: 0.3, y: 50 },
                {
                    opacity: 1, scale: 1, y: 0,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full py-40 px-6 text-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary rounded-full blur-[200px]"
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-accent-primary/30"
                        style={{
                            left: `${15 + i * 10}%`,
                            top: `${20 + (i % 4) * 15}%`
                        }}
                        animate={{
                            y: [0, -60, 0],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <SlideInText direction="up" delay={0}>
                    <p className="eyebrow mb-12">
                        Traction & Proof
                    </p>
                </SlideInText>

                <SlideInText direction="up" delay={0.2}>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
                        <span className="text-gradient">Trusted by Schools</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Partnering with institutions to transform education through AI-powered personalized learning.
                    </p>
                </SlideInText>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent w-48 mx-auto mt-20 origin-center"
                />
            </div>
        </section>
    );
}
