"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";
import {
    snapToSection,
    recordSectionEntrance,
    isSnapAllowed,
    hasEntranceDelayElapsed,
    isSectionLocked,
    isProgrammaticScrollInProgress,
} from "@/app/utils/scrollSnap";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);
    const SECTION_ID = "hero";

    // Configuration - snap when user scrolls past 90% of this section
    const CONFIG = {
        nextSectionId: "problem-statement",
        snapTriggerProgress: 0.9, // Snap when 90% of hero is scrolled
        scrollDuration: 1.2,
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !lenis || !sectionRef.current) return;

        const section = sectionRef.current;

        // FIXED: Calculate threshold as a ratio (0-1) not pixels
        // We want to know: "has user scrolled 90% through this section?"

        let isVisible = false;
        let lastScrollY = window.scrollY;
        let scrollDirection: 'up' | 'down' = 'down';

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                // FIXED: Simplified visibility check
                isVisible = entry.isIntersecting;

                if (isVisible) {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                    lastScrollY = window.scrollY;
                }
            },
            {
                threshold: [0, 0.1, 0.5, 0.9, 1], // More granular thresholds
                rootMargin: "0px"
            }
        );

        observer.observe(section);

        const trySnap = () => {
            // Guard clauses
            if (
                !isVisible ||
                isSnapping.current ||
                hasTriggered.current ||
                !isSnapAllowed() ||
                !hasEntranceDelayElapsed(SECTION_ID) ||
                isSectionLocked(SECTION_ID) ||
                isProgrammaticScrollInProgress()
            ) {
                return false;
            }

            // FIXED: Proper progress calculation
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the section has been scrolled
            // rect.top is 0 when section top hits viewport top
            // rect.top is negative as we scroll down
            // section height is rect.height

            // Progress: 0 = top of section at viewport top
            // Progress: 1 = bottom of section at viewport top (fully scrolled)
            const scrolledAmount = Math.abs(Math.min(0, rect.top));
            const progress = scrolledAmount / rect.height;

            // Only snap if:
            // 1. Scrolling DOWN
            // 2. Past 90% progress
            // 3. Section is still in view (rect.bottom > 0)
            if (
                scrollDirection === 'down' &&
                progress >= CONFIG.snapTriggerProgress &&
                rect.bottom > 0 // Section still visible
            ) {
                console.log(`[Hero] Snapping at progress: ${progress.toFixed(2)}`);
                snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                return true;
            }

            return false;
        };

        const onScroll = () => {
            if (!isVisible) return;

            // Determine scroll direction
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;

            // Use requestAnimationFrame for smooth checking
            requestAnimationFrame(trySnap);
        };

        // FIXED: Removed separate wheel listener - scroll event is sufficient with Lenis
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, [isMounted, lenis]);

    return (
        <section ref={sectionRef} id="hero" className="relative w-full h-screen" style={{ backgroundColor: "#f1ede3" }}>
            {/* ... rest of your JSX unchanged ... */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <video
                    src="/boy1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    className="object-cover object-[70%_center] md:object-[40%_center] w-full h-full"
                />
            </div>

            <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    background: "linear-gradient(to right, rgba(10, 15, 46, 0.9) 0%, rgba(10, 15, 46, 0.6) 30%, rgba(10, 15, 46, 0.2) 60%, transparent 100%)"
                }}
            />

            <div className="absolute inset-0 flex flex-col items-start justify-start z-10 pl-[2%] pr-3 sm:pr-6 md:pr-8 top-[55%]">
                <div className="w-full max-w-4xl md:max-w-5xl">
                    <motion.h1
                        className="text-[clamp(2.7rem,11vw,5.5rem)] md:text-[clamp(3rem,10vw,6.5rem)] leading-[0.92] md:leading-[1.05] font-black tracking-tight text-white mb-4 md:mb-8 w-full overflow-hidden text-left"
                    >
                        <motion.span
                            className="block mb-1 text-[clamp(2.7rem,11vw,5.5rem)] md:text-[clamp(3rem,10vw,6.5rem)] leading-[0.9]"
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
                            className="flex flex-col md:flex-row items-start md:items-center justify-start mb-1 gap-1 md:gap-4"
                        >
                            <motion.span
                                layout
                                className="text-white text-[clamp(2.7rem,11vw,5.5rem)] md:text-[clamp(3rem,10vw,6.5rem)] leading-[0.9]"
                            >
                                WAY OF
                            </motion.span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-secondary">LEARNING</span>
                        </motion.span>
                        <motion.span
                            className="block text-[clamp(2.7rem,11vw,5.5rem)] md:text-[clamp(3rem,10vw,6.5rem)] leading-[0.9]"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            TO LIFE.
                        </motion.span>
                    </motion.h1>
                </div>
            </div>

            <div className="pointer-events-none absolute left-0 right-0 -bottom-[00px] h-[40vh] md:h-[38vh]">
                <div className="absolute inset-0 hero-teacher-gradient" />
            </div>
        </section>
    );
}