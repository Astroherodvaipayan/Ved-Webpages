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
        if (!isMounted) return;
        if (!sectionRef.current || !windowRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Set initial states via GSAP
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
                        // Phase 4 - Snap Trigger: AT 75% scroll progress, auto-complete Phase 5
                        if (self.progress >= 0.75 && self.progress < 0.95 && self.direction === 1) {
                            if (!isSnapping.current && lenis) {
                                isSnapping.current = true;
                                // Smooth programmatic scroll to the end of the section
                                lenis.scrollTo(self.end, {
                                    duration: 0.8,
                                    force: true,
                                    easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic ease out
                                    onComplete: () => {
                                        isSnapping.current = false;
                                    }
                                });
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
                scale: 0.6,
                opacity: 1,
                ease: "power2.out",
                duration: 0.20
            }, 0.55);

            // Phase 5 — Mac window fills screen (snap → 100%)
            // Driven by the Lenis auto-scroll snap
            tl.to(windowRef.current, {
                scale: 1,
                ease: "power2.inOut",
                duration: 0.25
            }, 0.75);

        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted]);

    return (
        <section
            id="product-showcase"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#FAFBFF]"
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
                className="absolute z-10 bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-[#B0B8D1]/20"
                style={{
                    width: '92vw',
                    height: '75vh',
                    maxWidth: '1400px',
                    maxHeight: '900px',
                    transformOrigin: 'center center',
                    opacity: 0,
                    transform: 'scale(0.1)',
                }}
            >
                {/* Mac Title Bar */}
                <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] border-b border-[#B0B8D1]/10 flex items-center px-3 sm:px-4 z-10">
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
                <video
                    ref={videoRef}
                    src="/product-demo.mp4"
                    className="absolute top-8 sm:top-10 left-0 w-full h-[calc(100%-32px)] sm:h-[calc(100%-40px)]"
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'center top',
                    }}
                    loop
                    muted
                    playsInline
                    preload="auto"
                />
            </div>
        </section>
    );
}
