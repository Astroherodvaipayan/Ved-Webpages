"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GradientButton from "../ui/GradientButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";

gsap.registerPlugin(ScrollTrigger);

interface WaitlistData {
    name: string;
    email: string;
    role: string;
    imageUrl: string | null;
}

export default function JoinRevolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const isSnapping = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scroll snap to next section (FooterCTA) at 90% progress
    useEffect(() => {
        if (!isMounted || !lenis) return;
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (self.progress >= 0.90 && self.progress < 0.98 && self.direction === 1) {
                        if (!isSnapping.current && lenis) {
                            isSnapping.current = true;
                            const nextSection = document.getElementById('footer-cta');
                            if (nextSection) {
                                const rect = nextSection.getBoundingClientRect();
                                const targetY = rect.top + window.scrollY;
                                lenis.scrollTo(targetY, {
                                    duration: 0.8,
                                    force: true,
                                    easing: (t: number) => 1 - Math.pow(1 - t, 4),
                                    onComplete: () => {
                                        isSnapping.current = false;
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted, lenis]);

    return (
        <section
            id="join-revolution"
            ref={sectionRef}
            className="relative w-full min-h-screen py-40 px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-transparent z-10"
        >
            {/* Text block */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl mx-auto px-6 mb-20"
            >
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight mb-12 text-[#0A0F2E]">
                    To enable <br />
                    <span className="text-gradient">A BILLION GENIUSES</span>.
                </h2>

                <p className="text-xl text-[#2D3A6B] leading-relaxed max-w-2xl mx-auto mb-16">
                    We believe intelligence is evenly distributed, but opportunity is not.
                    Ved AI democratizes elite-level personalized education for everyone on Earth.
                </p>
            </motion.div>

            {/* Central Button */}
            <div className="relative z-20 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <Link href="/waitlist" className="inline-block">
                        <GradientButton label="Join Beta" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}