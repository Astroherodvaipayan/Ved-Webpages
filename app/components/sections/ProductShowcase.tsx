"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
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

            // Text zooms in
            tl.to(textRef.current, {
                scale: 1,
                opacity: 1,
                ease: "power2.out",
                duration: 0.2
            }, 0);

            // Text zooms past camera
            tl.to(textRef.current, {
                scale: 8,
                opacity: 0,
                ease: "power2.in",
                duration: 0.15
            }, 0.2);

            // Window zooms in from tiny
            tl.to(windowRef.current, {
                scale: 0.6,
                opacity: 1,
                ease: "power2.out",
                duration: 0.15
            }, 0.3);

            // Window zooms to full screen
            tl.to(windowRef.current, {
                scale: 1,
                ease: "power2.inOut",
                duration: 0.2
            }, 0.45);

            // Stay at full scale for remaining scroll - no more changes

        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted]);

    return (
        <section
            id="product-showcase"
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]"
        >
            {/* Punchline Text */}
            <h2
                ref={textRef}
                className="absolute z-30 text-4xl md:text-7xl font-black text-center text-white tracking-tighter w-full px-4"
                style={{ opacity: 0, transform: 'scale(0.2)' }}
            >
                THE FUTURE OF LEARNING IS HERE
            </h2>

            {/* Single Mac Window - This is what gets animated */}
            <div
                ref={windowRef}
                className="absolute z-10 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                style={{
                    width: '90vw',
                    height: '80vh',
                    maxWidth: '1400px',
                    maxHeight: '900px',
                    transformOrigin: 'center center',
                    opacity: 0,
                    transform: 'scale(0.1)',
                }}
            >
                {/* Mac Title Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border-b border-white/5 flex items-center px-4 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner" />
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-white/40 text-sm font-medium">Ved AI Platform</span>
                    </div>
                    <div className="w-14" />
                </div>

                {/* Video */}
                <video
                    ref={videoRef}
                    src="/product-demo.mp4"
                    className="absolute top-10 left-0 w-full h-[calc(100%-40px)]"
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
