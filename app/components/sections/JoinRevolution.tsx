// app/components/sections/JoinRevolution.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GradientButton from "../ui/GradientButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { shouldSnap, snapToSection } from "@/app/utils/scrollSnap";

gsap.registerPlugin(ScrollTrigger);

interface WaitlistData {
    name: string;
    email: string;
    role: string;
    imageUrl: string | null;
}

export default function JoinRevolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);

    // Configuration
    const CONFIG = {
        nextSectionId: 'footer-cta',
        animationCompleteProgress: 0.85,
        triggerBufferPx: 10,
        scrollDuration: 1.2,
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scroll snap to next section (FooterCTA)
    useEffect(() => {
        if (!isMounted || !lenis) return;
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (shouldSnap(self, CONFIG.animationCompleteProgress, CONFIG.triggerBufferPx, isSnapping, hasTriggered)) {
                        snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                    }

                    // Reset trigger flag when scrolling back up
                    if (self.progress < CONFIG.animationCompleteProgress && self.direction === -1) {
                        hasTriggered.current = false;
                        isSnapping.current = false;
                    }
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
    }, [isMounted, lenis]);

    return (
        <section
            id="join-revolution"
            ref={sectionRef}
            className="relative w-full min-h-screen py-16 md:py-40 px-4 md:px-6 flex flex-col items-center justify-center text-center overflow-hidden bg-transparent z-10"
        >
            {/* Text block */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl mx-auto px-6 mb-8"
            >
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight mb-12 text-[#0A0F2E]">
                    To enable <br className="hidden sm:block" />
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