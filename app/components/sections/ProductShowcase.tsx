"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=120%",
                    pin: true,
                    scrub: 0.3,
                    anticipatePin: 1,
                    onEnter: () => {
                        // Start video from beginning when entering section
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                        }
                    },
                    onEnterBack: () => {
                        // Restart video when scrolling back up into section
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                        }
                    },
                    onLeave: () => {
                        // Pause when leaving
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    },
                    onLeaveBack: () => {
                        // Pause when scrolling up past section
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                    }
                }
            });

            // Text zooms in
            tl.fromTo(textRef.current,
                { scale: 0.2, opacity: 0 },
                { scale: 1, opacity: 1, ease: "power2.out", duration: 0.25 },
                0
            );

            // Netflix zoom - text scales huge past camera
            tl.to(textRef.current, {
                scale: 8,
                opacity: 0,
                ease: "power2.in",
                duration: 0.25
            }, 0.25);

            // Mac screen fades in small
            tl.fromTo(containerRef.current,
                { scale: 0.1, opacity: 0, borderRadius: "24px" },
                { scale: 0.5, opacity: 1, borderRadius: "16px", ease: "power2.out", duration: 0.15 },
                0.45
            );

            // Mac screen zooms to full
            tl.to(containerRef.current, {
                scale: 1,
                borderRadius: "0px",
                ease: "power2.inOut",
                duration: 0.4
            }, 0.6);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-bg-primary overflow-hidden flex items-center justify-center"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary pointer-events-none" />

            {/* Punchline Text */}
            <h2
                ref={textRef}
                className="absolute z-20 text-4xl md:text-7xl font-black text-center text-white text-gradient tracking-tighter w-full px-4"
            >
                THE FUTURE OF LEARNING IS HERE
            </h2>

            {/* Mac Screen Container */}
            <div
                ref={containerRef}
                className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center"
                style={{ transformOrigin: "center center" }}
            >
                {/* Mac-style Window Frame */}
                <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-white/10">

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

                    {/* Video - High Quality, No Blur */}
                    <video
                        ref={videoRef}
                        src="/product-demo.mp4"
                        className="absolute top-10 left-0 w-full h-[calc(100%-40px)]"
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'center top',
                            imageRendering: 'auto',
                        }}
                        loop
                        muted
                        playsInline
                        preload="auto"
                    />

                    {/* Scan line effect */}
                    <motion.div
                        animate={{ y: ["0%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent pointer-events-none z-20"
                    />
                </div>
            </div>
        </section>
    );
}
