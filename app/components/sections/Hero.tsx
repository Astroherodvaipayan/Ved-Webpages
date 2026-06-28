"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
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

const SECTION_ID = "hero";
const HERO_VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";
const DEMO_VIDEO_SRC = "/product-demo.mp4";
const HERO_SNAP_CONFIG = {
    nextSectionId: "problem-statement",
    snapTriggerProgress: 0.98,
    scrollDuration: 1.2,
};
const DEMO_OPTIONS = [
    { id: 1, label: "Student" },
    { id: 2, label: "Teacher" },
    { id: 3, label: "Institution" },
    { id: 4, label: "Parent" },
];

const STAKEHOLDER_MOCKUPS: Record<number, { src: string; alt: string; width: number; height: number }> = {
    2: {
        src: "/mockups/exact-logo-teacher-platform.png",
        alt: "Ved AI teacher platform mockup",
        width: 1200,
        height: 727,
    },
    3: {
        src: "/mockups/exact-logo-institution-platform.png",
        alt: "Ved AI institution platform mockup",
        width: 1200,
        height: 675,
    },
    4: {
        src: "/mockups/exact-logo-parent-platform.png",
        alt: "Ved AI parent platform mockup",
        width: 1200,
        height: 675,
    },
};

function StakeholderPlatformImage({ selectedDemo }: { selectedDemo: number }) {
    const mockup = STAKEHOLDER_MOCKUPS[selectedDemo];
    if (!mockup) {
        return null;
    }

    return (
        <div className="stakeholder-image-demo">
            <Image
                key={mockup.src}
                src={mockup.src}
                alt={mockup.alt}
                width={mockup.width}
                height={mockup.height}
                sizes="(max-width: 768px) 92vw, 1200px"
                className="stakeholder-platform-image"
            />
        </div>
    );
}

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const mediaFrameRef = useRef<HTMLDivElement>(null);
    const heroMediaRef = useRef<HTMLVideoElement>(null);
    const demoLayerRef = useRef<HTMLDivElement>(null);
    const demoMenuRef = useRef<HTMLDivElement>(null);
    const demoVideoRef = useRef<HTMLVideoElement>(null);
    const shadeRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const scrollLabelRef = useRef<HTMLParagraphElement>(null);
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const lenis = useLenis();
    const [selectedDemo, setSelectedDemo] = useState(1);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const mediaFrame = mediaFrameRef.current;
        const heroMedia = heroMediaRef.current;
        const demoLayer = demoLayerRef.current;
        const demoMenu = demoMenuRef.current;
        const shade = shadeRef.current;
        const copy = copyRef.current;
        const scrollLabel = scrollLabelRef.current;
        if (!section || !mediaFrame || !heroMedia || !demoLayer || !demoMenu || !shade || !copy || !scrollLabel) return;

        let frameId = 0;

        const clamp = (value: number) => Math.max(0, Math.min(1, value));
        const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
        const easeInOutCubic = (value: number) =>
            value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

        const readProgress = () => {
            const rect = section.getBoundingClientRect();
            const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
            return clamp(-rect.top / scrollDistance);
        };

        const render = () => {
            const progress = readProgress();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const cardProgress = easeInOutCubic(clamp((progress - 0.03) / 0.72));
            const floatProgress = easeInOutCubic(clamp((progress - 0.42) / 0.38));
            const copyProgress = easeInOutCubic(clamp((progress - 0.05) / 0.24));
            const demoProgress = easeInOutCubic(clamp((progress - 0.72) / 0.16));

            const finalWidth = Math.min(viewportWidth * 0.92, 1200);
            const finalHeight = finalWidth * 9 / 16;
            const width = lerp(viewportWidth, finalWidth, cardProgress);
            const height = lerp(viewportHeight, finalHeight, cardProgress);
            const radius = lerp(0, viewportWidth < 640 ? 12 : 18, cardProgress);
            const borderAlpha = lerp(0, 0.12, cardProgress);
            const scale = lerp(1, 0.78, floatProgress);
            const y = lerp(0, -32, floatProgress);
            const shadowAlpha = lerp(0, 0.18, cardProgress);

            mediaFrame.style.width = `${width}px`;
            mediaFrame.style.height = `${height}px`;
            mediaFrame.style.borderRadius = `${radius}px`;
            mediaFrame.style.borderColor = `rgba(10, 15, 46, ${lerp(borderAlpha, 0.16, demoProgress)})`;
            mediaFrame.style.backgroundColor = "#171717";
            mediaFrame.style.backdropFilter = "none";
            (mediaFrame.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter = "none";
            mediaFrame.style.transform = `translate(-50%, -50%) translate3d(0, ${y}px, 0) scale(${scale})`;
            mediaFrame.style.boxShadow = `0 ${Math.round(18 + cardProgress * 28)}px ${Math.round(50 + cardProgress * 82)}px rgba(10, 15, 46, ${lerp(shadowAlpha, 0.15, demoProgress)})`;

            heroMedia.style.opacity = `${lerp(1, 0, demoProgress)}`;
            shade.style.opacity = `${lerp(1, 0, cardProgress)}`;
            demoLayer.style.opacity = `${demoProgress}`;
            demoLayer.style.transform = `translateY(${lerp(10, 0, demoProgress)}px)`;
            demoMenu.style.opacity = `${demoProgress}`;
            demoMenu.style.pointerEvents = demoProgress > 0.92 ? "auto" : "none";
            demoMenu.style.transform = `translate(-50%, ${y + (height * scale) / 2 + lerp(42, 18, demoProgress)}px)`;
            copy.style.opacity = `${lerp(1, 0, copyProgress)}`;
            copy.style.transform = `translate3d(0, ${lerp(0, -48, copyProgress)}px, 0)`;
            scrollLabel.style.opacity = `${lerp(0.55, 0.12, Math.max(cardProgress, demoProgress))}`;
        };

        const scheduleRender = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(() => {
                frameId = 0;
                render();
            });
        };

        window.addEventListener("scroll", scheduleRender, { passive: true });
        window.addEventListener("resize", scheduleRender);
        render();

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", scheduleRender);
            window.removeEventListener("resize", scheduleRender);
        };
    }, []);

    const handleDemoOption = (id: number) => {
        setSelectedDemo(id);
        if (id === 1 && demoVideoRef.current) {
            demoVideoRef.current.currentTime = 0;
            demoVideoRef.current.play().catch(() => {});
        }
    };

    useEffect(() => {
        if (!lenis || !sectionRef.current) return;

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

            // Calculate how much of the section has been scrolled
            // rect.top is 0 when section top hits viewport top
            // rect.top is negative as we scroll down
            // section height is rect.height

            // Progress: 0 = top of section at viewport top
            // Progress: 1 = bottom of section at viewport top (fully scrolled)
            const scrolledAmount = Math.abs(Math.min(0, rect.top));
            const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
            const progress = scrolledAmount / scrollDistance;

            // Only snap if:
            // 1. Scrolling DOWN
            // 2. Past 90% progress
            // 3. Section is still in view (rect.bottom > 0)
            if (
                scrollDirection === 'down' &&
                progress >= HERO_SNAP_CONFIG.snapTriggerProgress &&
                rect.bottom > 0 // Section still visible
            ) {
                console.log(`[Hero] Snapping at progress: ${progress.toFixed(2)}`);
                snapToSection(lenis, HERO_SNAP_CONFIG.nextSectionId, HERO_SNAP_CONFIG.scrollDuration, isSnapping, hasTriggered);
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
    }, [lenis]);

    return (
        <section ref={sectionRef} id="hero" className="relative z-10 h-[290dvh] w-full bg-[#FAFBFF]">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFF 48%, #F5F8FF 100%)",
                }}
            />

            <div
                className="absolute inset-0 pointer-events-none opacity-[0.35]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(30,58,138,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.08) 1px, transparent 1px)",
                    backgroundSize: "96px 96px",
                }}
            />

            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
                <div
                    ref={mediaFrameRef}
                    className="absolute left-1/2 top-1/2 z-0 overflow-hidden border bg-[#171717]"
                    style={{
                        width: "100vw",
                        height: "100dvh",
                        borderColor: "rgba(255, 255, 255, 0)",
                        borderRadius: 0,
                        transformOrigin: "center center",
                        transform: "translate(-50%, -50%)",
                        willChange: "width, height, transform, border-radius, box-shadow",
                    }}
                >
                    <video
                        ref={heroMediaRef}
                        src={HERO_VIDEO_SRC}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls={false}
                        className="h-full w-full object-cover object-[70%_center] md:object-[40%_center]"
                        style={{ willChange: "opacity" }}
                    />

                    <div
                        ref={shadeRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, rgba(10, 15, 46, 0.9) 0%, rgba(10, 15, 46, 0.6) 30%, rgba(10, 15, 46, 0.2) 60%, transparent 100%)",
                            willChange: "opacity",
                        }}
                    />

                    <div
                        ref={demoLayerRef}
                        className="absolute inset-0 flex flex-col"
                        style={{
                            opacity: 0,
                            pointerEvents: "none",
                            willChange: "opacity, transform",
                        }}
                    >
                        <div className="flex min-h-0 flex-1 flex-col bg-[#171717]">
                            <div className="flex h-9 shrink-0 items-center border-b border-white/14 bg-[#151515] px-3 sm:h-11 sm:px-4">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
                                </div>
                                <div className="flex-1 text-center text-[11px] font-semibold text-white/78 sm:text-sm">
                                    Ved AI Platform
                                </div>
                                <div className="w-10 sm:w-14" />
                            </div>

                            <div className="relative min-h-0 flex-1 bg-[#171717]">
                                {selectedDemo === 1 ? (
                                    <video
                                        ref={demoVideoRef}
                                        src={DEMO_VIDEO_SRC}
                                        className="absolute inset-0 h-full w-full"
                                        style={{
                                            objectFit: "contain",
                                            objectPosition: "center",
                                        }}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                    />
                                ) : (
                                    <StakeholderPlatformImage selectedDemo={selectedDemo} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={demoMenuRef}
                    className="absolute left-1/2 top-1/2 z-20 flex w-[min(92vw,720px)] flex-wrap items-center justify-center gap-3 px-2 sm:gap-6"
                    style={{
                        opacity: 0,
                        pointerEvents: "none",
                        willChange: "opacity, transform",
                    }}
                >
                    {DEMO_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleDemoOption(option.id)}
                            className={`relative pb-2 text-[11px] font-semibold transition-colors duration-300 sm:text-sm md:text-base ${
                                selectedDemo === option.id
                                    ? "text-[#0A0F2E]"
                                    : "text-[#8B91A3] hover:text-[#0A0F2E]/80"
                            }`}
                        >
                            {option.label}
                            <span
                                className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#D4AF37] transition-all duration-300 ${
                                    selectedDemo === option.id ? "w-full opacity-100" : "w-0 opacity-0"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                <div
                    ref={copyRef}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-start px-4 pt-[45dvh]"
                    style={{ willChange: "transform, opacity" }}
                >
                    <div className="w-full text-center">
                        <motion.p
                            className="mb-4 text-[10px] font-semibold uppercase text-white/80 sm:text-xs md:text-sm"
                            style={{
                                fontFamily: "var(--font-inter), Inter, sans-serif",
                                letterSpacing: "0.3em",
                            }}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            The Future of Learning, Connected
                        </motion.p>
                        <motion.h1
                            className="w-full overflow-hidden whitespace-nowrap text-center text-[34px] font-normal leading-none tracking-normal text-white sm:text-[44px] md:text-[54px] lg:text-[66px] xl:text-[76px]"
                            style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                        >
                            <motion.span
                                className="inline-flex items-baseline justify-center gap-[0.28em]"
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span>BRING YOUR WAY OF</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-secondary">LEARNING</span>
                                <span>TO LIFE</span>
                            </motion.span>
                        </motion.h1>
                    </div>
                </div>

                <p
                    ref={scrollLabelRef}
                    className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#0A0F2E]/30"
                    aria-hidden="true"
                >
                    Scroll
                </p>
            </div>

            <style jsx>{`
                .stakeholder-image-demo {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    background: #f7f6f3;
                    animation: demoImageIn 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                .stakeholder-image-demo :global(.stakeholder-platform-image) {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }

                @keyframes demoImageIn {
                    from {
                        opacity: 0;
                        transform: scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>

        </section>
    );
}
