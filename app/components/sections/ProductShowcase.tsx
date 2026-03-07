// app/components/sections/ProductShowcase.tsx

"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { shouldSnap, snapToSection, recordSectionEntrance } from "@/app/utils/scrollSnap";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);
    const SECTION_ID = 'product-showcase';

    // Configuration
    const CONFIG = {
        nextSectionId: 'problem-statement',
        phase5Start: 0.70,
        phase5Duration: 0.25,
        triggerBufferPx: 10,
        scrollDuration: 1.2,
    };

    const PHASE_5_END = CONFIG.phase5Start + CONFIG.phase5Duration; // 0.95

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !lenis) return;
        if (!sectionRef.current || !windowRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(windowRef.current, {
                scale: 0.1,
                opacity: 0
            });
            gsap.set(textRef.current, {
                scale: 0.2,
                opacity: 0
            });

            // Create timeline
            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: "none" }
            });

            // Phase 1 — Text dolly zoom in (0% → 25%)
            tl.to(textRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",
                duration: 0.25
            }, 0);

            // Phase 2 — Text zooms past camera (25% → 50%)
            tl.to(textRef.current, {
                scale: 8,
                opacity: 0,
                ease: "power2.in",
                duration: 0.25
            }, 0.25);

            // Phase 3 — Mac window appears (50% → 70%)
            tl.to(windowRef.current, {
                scale: 0.7,
                opacity: 1,
                ease: "power2.out",
                duration: 0.20
            }, 0.50);

            // Phase 5 — Mac window fills screen (70% → 95%)
            tl.to(windowRef.current, {
                scale: 0.8,
                ease: "power2.inOut",
                duration: CONFIG.phase5Duration
            }, CONFIG.phase5Start);

            // Create ScrollTrigger
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=250%",
                pin: true,
                pinSpacing: true,
                scrub: 0.5,
                animation: tl,

                onUpdate: (self) => {
                    if (shouldSnap(self, PHASE_5_END, CONFIG.triggerBufferPx, isSnapping, hasTriggered, SECTION_ID)) {
                        snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                    }

                    // Reset trigger flag when scrolling back up past phase 5
                    if (self.progress < PHASE_5_END && self.direction === -1) {
                        hasTriggered.current = false;
                        isSnapping.current = false;
                    }
                },

                onEnter: () => {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                    playVideo();
                },

                onEnterBack: () => {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                    playVideo();
                },

                onLeave: () => {
                    pauseVideo();
                },

                onLeaveBack: () => {
                    pauseVideo();
                    hasTriggered.current = false;
                }
            });

            // Refresh ScrollTrigger after DOM settles
            const refreshTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 300);

            return () => {
                clearTimeout(refreshTimer);
            };

        }, sectionRef);

        return () => {
            ctx.revert();
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
        };
    }, [isMounted, lenis]);

    // Helper: Play video
    const playVideo = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {
                // Ignore autoplay errors
            });
        }
    };

    // Helper: Pause video
    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <section
            id="product-showcase"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden flex items-center justify-center z-10 bg-transparent"
        >
            {/* Punchline Text */}
            <h2
                ref={textRef}
                className="absolute z-30 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-center text-[#0A0F2E] tracking-tighter w-full px-4"
                style={{
                    opacity: 0,
                    transform: 'scale(0.2)',
                    willChange: 'transform, opacity'
                }}
            >
                THE FUTURE OF LEARNING<br />IS HERE
            </h2>

            {/* Mac Window */}
            <div
                ref={windowRef}
                className="absolute z-10 bg-[#0A0F2E] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-[#B0B8D1]/20 flex flex-col"
                style={{
                    width: '92vw',
                    maxWidth: '1200px',
                    transformOrigin: 'center center',
                    opacity: 0,
                    transform: 'scale(0.1)',
                    willChange: 'transform, opacity'
                }}
            >
                {/* Mac Title Bar */}
                <div className="h-8 sm:h-10 w-full bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] border-b border-[#B0B8D1]/10 flex items-center px-3 sm:px-4 shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] shadow-inner" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e] shadow-inner" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840] shadow-inner" />
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-[#6B7AA1] text-xs sm:text-sm font-medium">Ved AI Platform</span>
                    </div>
                    <div className="w-10 sm:w-14" />
                </div>

                {/* Video */}
                <div className="w-full relative aspect-video bg-black">
                    <video
                        ref={videoRef}
                        src="/product-demo.mp4"
                        className="absolute inset-0 w-full h-full"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        loop
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
            </div>
        </section>
    );
}

