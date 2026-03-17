// app/components/sections/JoinRevolution.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GradientButton from "../ui/GradientButton";
import { useLenis } from "@studio-freight/react-lenis";
import {
    snapToSection,
    recordSectionEntrance,
    isSnapAllowed,
    hasEntranceDelayElapsed,
    isSectionLocked,
    isProgrammaticScrollInProgress,
} from "@/app/utils/scrollSnap";

interface WaitlistData {
    name: string;
    email: string;
    role: string;
    imageUrl: string | null;
}

export default function JoinRevolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);
    const SECTION_ID = 'join-revolution';

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

    // Scroll snap to next section (FooterCTA) using shared scrollSnap helpers
    useEffect(() => {
        if (!isMounted || !lenis) return;
        const section = sectionRef.current;
        if (!section) return;

        let isVisible = false;
        let wheelAccumulator = 0;
        const WHEEL_THRESHOLD = 150;
        let resetTimer: ReturnType<typeof setTimeout> | null = null;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                // Consider section "active" when at least 50% is visible
                isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
                if (isVisible) {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                    wheelAccumulator = 0;
                }
            },
            { threshold: [0, 0.3, 0.5, 0.9] }
        );
        observer.observe(section);

        const trySnap = () => {
            if (
                !isVisible ||
                isSnapping.current ||
                hasTriggered.current ||
                !isSnapAllowed() ||
                !hasEntranceDelayElapsed(SECTION_ID) ||
                isSectionLocked(SECTION_ID) ||
                isProgrammaticScrollInProgress()
            ) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const bottomNearViewport = rect.bottom <= window.innerHeight + CONFIG.triggerBufferPx;
            if (!bottomNearViewport) return;

            snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
        };

        const onWheel = (e: WheelEvent) => {
            if (!isVisible || e.deltaY <= 0) {
                wheelAccumulator = 0;
                return;
            }

            wheelAccumulator += e.deltaY;

            if (resetTimer) clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                wheelAccumulator = 0;
            }, 300);

            if (wheelAccumulator >= WHEEL_THRESHOLD) {
                wheelAccumulator = 0;
                trySnap();
            }
        };

        // Touch handling (swipe up to scroll down)
        let touchStartY = 0;
        const onTouchStart = (e: TouchEvent) => {
            if (!isVisible) return;
            touchStartY = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (!isVisible) return;
            const deltaY = touchStartY - e.changedTouches[0].clientY;
            if (deltaY > 50) {
                trySnap();
            }
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchend", onTouchEnd);
            if (resetTimer) clearTimeout(resetTimer);
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
