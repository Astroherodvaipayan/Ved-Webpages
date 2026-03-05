"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSnapping = useRef(false);
    const lenis = useLenis();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !lenis) return;
        if (!sectionRef.current || !windowRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            gsap.set(windowRef.current, {
                scale: 0.1,
                opacity: 0
            });
            gsap.set(textRef.current, {
                scale: 0.2,
                opacity: 0
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=250%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        if (self.progress >= 0.90 && self.progress < 0.98 && self.direction === 1) {
                            if (!isSnapping.current && lenis) {
                                isSnapping.current = true;
                                // Get the next section using getBoundingClientRect for accurate position
                                const nextSection = document.getElementById('problem-statement');
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
                    },
                    onEnter: () => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                        }
                    },
                    onEnterBack: () => {
                        if (videoRef.current) {
                            videoRef.current.play();
                        }
                    },
                    onLeave: () => {
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    },
                    onLeaveBack: () => {
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    }
                }
            });

            // Phase 1 — Text dolly zoom in (0% → 35%)
            tl.to(textRef.current, {
                scale: 1,
                opacity: 1,
                ease: "none",
                duration: 0.35
            }, 0);

            // Phase 2 — Text zooms past camera (35% → 55%)
            tl.to(textRef.current, {
                scale: 8,
                opacity: 0,
                ease: "power2.in",
                duration: 0.20
            }, 0.35);

            // Phase 3 — Mac window appears from tiny (55% → 75%)
            tl.to(windowRef.current, {
                scale: 0.7,
                opacity: 1,
                ease: "power2.out",
                duration: 0.20
            }, 0.55);

            // Phase 5 — Mac window fills screen
            tl.to(windowRef.current, {
                scale: 0.8,
                ease: "power2.inOut",
                duration: 0.25
            }, 0.75);

            // ✅ FIX: setTimeout instead of double-RAF.
            // FeatureShowcase also waits for lenis before registering its trigger,
            // so both useEffects fire in the same microtask queue when lenis resolves.
            // React processes child effects in tree order (ProductShowcase first, then
            // FeatureShowcase), so by 300ms both are registered and the DOM has settled.
            // This refresh recalculates all trigger positions with the correct page height.
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 300);

        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted, lenis]);

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
                style={{ opacity: 0, transform: 'scale(0.2)' }}
            >
                THE FUTURE OF LEARNING<br />IS HERE
            </h2>

            {/* Mac Window — animated via GSAP */}
            <div
                ref={windowRef}
                className="absolute z-10 bg-[#0A0F2E] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-[#B0B8D1]/20 flex flex-col"
                style={{
                    width: '92vw',
                    maxWidth: '1200px',
                    transformOrigin: 'center center',
                    opacity: 0,
                    transform: 'scale(0.1)',
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