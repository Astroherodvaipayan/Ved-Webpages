// app/components/sections/ProductShowcase.tsx

"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const VIDEO_OPTIONS = [
    { id: 1, label: "Live Classes", icon: "play" },
    { id: 2, label: "Practice Sessions", icon: "document" },
    { id: 3, label: "Doubt Solving", icon: "chat" },
    { id: 4, label: "Mock Tests", icon: "check" },
];

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Entrance animation using IntersectionObserver (no scroll pinning)
    useEffect(() => {
        if (!isMounted || !sectionRef.current || !windowRef.current || !optionsRef.current) return;

        const ctx = gsap.context(() => {
            // Initial state - window starts small and invisible
            gsap.set(windowRef.current, {
                scale: 0.1,
                opacity: 0
            });

            // Options start hidden and below
            gsap.set(optionsRef.current, {
                opacity: 0,
                y: 30
            });

            // Check if already in view
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasEntered) {
                            setHasEntered(true);
                            playEntranceAnimation();
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 0.3 }
            );

            if (sectionRef.current) {
                observer.observe(sectionRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, [isMounted, hasEntered]);

    // Separate effect for playing animation once hasEntered is true
    useEffect(() => {
        if (!isMounted || !hasEntered || !windowRef.current || !optionsRef.current) return;

        playEntranceAnimation();
    }, [hasEntered]);

    const playEntranceAnimation = () => {
        if (!windowRef.current || !optionsRef.current) return;

        // Window appears and scales up
        gsap.to(windowRef.current, {
            scale: 0.8,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        });

        // Options fade in after window
        gsap.to(optionsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.4
        });
    };

    // Auto-play video when section is in view
    useEffect(() => {
        if (!videoRef.current || !sectionRef.current) return;

        const playVideo = () => {
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
            }
        };

        const pauseVideo = () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        playVideo();
                    } else {
                        pauseVideo();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleOptionClick = (id: number) => {
        if (id === selectedVideo || isAnimating) return;

        // Determine slide direction based on selection
        const direction = id > selectedVideo ? 'right' : 'left';
        setIsAnimating(true);

        // Animate out
        if (windowRef.current) {
            gsap.to(windowRef.current, {
                x: direction === 'right' ? '-100%' : '100%',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    setSelectedVideo(id);
                    // Reset position for entrance animation
                    gsap.set(windowRef.current, {
                        x: direction === 'right' ? '100%' : '-100%'
                    });
                    // Animate in
                    gsap.to(windowRef.current, {
                        x: 0,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            setIsAnimating(false);
                        }
                    });
                }
            });
        }

        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    };

    return (
        <section
            id="product-showcase"
            ref={sectionRef}
            className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 z-10"
        >
            {/* Mac Window */}
            <div
                ref={windowRef}
                className="relative z-10 bg-[#0A0F2E] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-[#B0B8D1]/20 flex flex-col"
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

            {/* Video Options */}
            <div
                ref={optionsRef}
                className="relative z-20 flex flex-wrap justify-center gap-4 sm:gap-6 px-4 mt-8 sm:mt-12"
                style={{
                    willChange: 'transform, opacity'
                }}
            >
                {VIDEO_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                            selectedVideo === option.id
                                ? "bg-white text-[#0A0F2E] shadow-lg scale-110"
                                : "bg-white/10 text-white hover:bg-white/20 border border-white/30"
                        }`}
                    >
                        {/* Icon */}
                        <div className="mb-1">
                            {option.icon === 'play' && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            )}
                            {option.icon === 'document' && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                            )}
                            {option.icon === 'chat' && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            )}
                            {option.icon === 'check' && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            )}
                        </div>
                        <span className="text-[10px] sm:text-xs leading-tight text-center">{option.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
