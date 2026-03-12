// app/components/sections/FeatureShowcase.tsx

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import {
    snapToSection,
    recordSectionEntrance,
    isSnapAllowed,
    hasEntranceDelayElapsed,
    isSectionLocked,
    isProgrammaticScrollInProgress,
    lockSection,
} from "@/app/utils/scrollSnap";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        eyebrow: "PERSONALIZED LEARNING",
        headline: "[Feature headline goes here]",
        subtext:
            "[Feature description goes here — 2 to 3 sentences about what this feature does and why it matters to the learner.]",
        color: "#E8855A",
        imageLabel: "Image Placeholder",
    },
    {
        eyebrow: "ADAPTIVE INTELLIGENCE",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        color: "#5A8AE8",
        imageLabel: "Image Placeholder",
    },
    {
        eyebrow: "MASTERY EVALUATION",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        color: "#5AE8A0",
        imageLabel: "Image Placeholder",
    },
];

export function OrnateShape({ className = "", children }: { className?: string; children?: ReactNode }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <Image
                src="/images/imaq_golden_v2.svg"
                alt="Decorative shape"
                fill
                className="object-contain"
                priority
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Progressive golden SVG path that snakes
   vertically between the three cards
   ───────────────────────────────────────────── */
function ProgressiveLine({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
    const pathRef = useRef<SVGPathElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!pathRef.current || !sectionRef.current) return;

        const path = pathRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.8,
            onUpdate: (self) => {
                gsap.set(path, {
                    strokeDashoffset: pathLength * (1 - self.progress),
                });
            },
        });

        return () => {
            trigger.kill();
        };
    }, [sectionRef]);

    /* The SVG path snakes: center-top → right side of card 1 area →
       crosses to left side of card 2 area → crosses to right side of card 3 area.
       viewBox is 100 wide × 1000 tall. The actual height stretches to 100% of the section. */
    return (
        <svg
            ref={svgRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[4px] md:w-[3px] pointer-events-none z-0"
            style={{ height: "100%" }}
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="golden-line-grad" x1="50" y1="0" x2="50" y2="1000" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFE580" stopOpacity="0.2" />
                    <stop offset="15%" stopColor="#E8A800" />
                    <stop offset="50%" stopColor="#C87800" />
                    <stop offset="85%" stopColor="#E8A800" />
                    <stop offset="100%" stopColor="#FFE580" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            <path
                ref={pathRef}
                d={`
                    M 50 0
                    L 50 120
                    Q 50 160, 85 180
                    L 85 300
                    Q 85 340, 50 360
                    L 50 400
                    Q 50 440, 15 460
                    L 15 580
                    Q 15 620, 50 640
                    L 50 680
                    Q 50 720, 85 740
                    L 85 860
                    Q 85 900, 50 920
                    L 50 1000
                `}
                stroke="url(#golden-line-grad)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Individual Feature Card
   ───────────────────────────────────────────── */
interface FeatureCardProps {
    feature: (typeof features)[number];
    index: number;
    reversed: boolean;
    cardRef: (el: HTMLDivElement | null) => void;
}

function FeatureCard({ feature, reversed, cardRef }: FeatureCardProps) {
    const textContent = (
        <div className="flex flex-col justify-center w-full md:w-[55%] p-6 sm:p-8 md:p-12">
            <span
                className="block mb-3"
                style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: "#1E3A8A",
                    textTransform: "uppercase",
                    fontWeight: 500,
                }}
            >
                {feature.eyebrow}
            </span>
            <h3
                className="mb-4"
                style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: "clamp(1.4rem, 2.5vw, 2.5rem)",
                    fontWeight: 700,
                    color: "#0A0F2E",
                    lineHeight: 1.2,
                }}
            >
                {feature.headline}
            </h3>
            <p
                style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
                    color: "#2D3A6B",
                    lineHeight: 1.7,
                }}
            >
                {feature.subtext}
            </p>
        </div>
    );

    const shapeContent = (
        <div className="relative w-full md:w-[45%] flex items-center justify-center bg-[#E8EEFF]/30 rounded-[20px] min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
            <OrnateShape className="w-[200px] h-[250px] sm:w-[280px] sm:h-[350px] md:w-[300px] md:h-[380px]">
                <span className="text-white text-sm sm:text-base font-medium px-4 opacity-90 text-center">
                    {feature.imageLabel}
                </span>
            </OrnateShape>
        </div>
    );

    return (
        <div
            ref={cardRef}
            className="feature-card w-full max-w-6xl mx-auto bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch min-h-[400px] sm:min-h-[480px] md:min-h-[520px]"
            style={{
                border: "1px solid rgba(30, 58, 138, 0.10)",
                boxShadow:
                    "0 24px 48px -12px rgba(30, 58, 138, 0.12), 0 0 0 1px rgba(30, 58, 138, 0.04)",
                opacity: 0,
                transform: "translateY(60px)",
            }}
        >
            {/* On mobile, always text first → shape second. On desktop, alternate. */}
            <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} w-full`}>
                {textContent}
                {shapeContent}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────── */
export default function FeatureShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lenis = useLenis();
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const [isMounted, setIsMounted] = useState(false);

    const SECTION_ID = "feature-showcase";
    const CARD_IDS = features.map((_, i) => `feature-card-${i}`);

    const CONFIG = {
        nextSectionId: "moat",
        scrollDuration: 1.2,
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    /* ── Card entrance animations ── */
    useEffect(() => {
        if (!isMounted) return;

        const ctx = gsap.context(() => {
            cardRefs.current.forEach((card) => {
                if (!card) return;

                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isMounted]);

    /* ── Inter-card snapping + end-of-section snap ── */
    useEffect(() => {
        if (!isMounted || !lenis) return;
        const section = sectionRef.current;
        if (!section) return;

        let isVisible = false;
        let wheelAccumulator = 0;
        let wheelAccumulatorUp = 0;
        const WHEEL_THRESHOLD = 120;
        let resetTimer: ReturnType<typeof setTimeout> | null = null;

        // Track visibility
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
                if (isVisible) {
                    recordSectionEntrance(SECTION_ID);
                    hasTriggered.current = false;
                    isSnapping.current = false;
                    wheelAccumulator = 0;
                    wheelAccumulatorUp = 0;
                }
            },
            { threshold: [0, 0.15, 0.5, 0.9] }
        );
        observer.observe(section);

        /**
         * Find which card is currently most centered in the viewport,
         * and determine the next/previous snap target.
         */
        const getSnapTarget = (direction: "down" | "up"): string | null => {
            const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
            const vpCenter = window.innerHeight / 2;

            // Find the card closest to viewport center
            let closestIdx = 0;
            let closestDist = Infinity;
            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const dist = Math.abs(cardCenter - vpCenter);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = i;
                }
            });

            if (direction === "down") {
                // If there's a next card, snap to it
                if (closestIdx < cards.length - 1) {
                    return CARD_IDS[closestIdx + 1];
                }
                // Otherwise snap to moat
                return CONFIG.nextSectionId;
            } else {
                // Snap to previous card
                if (closestIdx > 0) {
                    return CARD_IDS[closestIdx - 1];
                }
                return null; // let natural scroll handle going above
            }
        };

        const trySnap = (direction: "down" | "up") => {
            if (
                !isVisible ||
                isSnapping.current ||
                !isSnapAllowed() ||
                !hasEntranceDelayElapsed(SECTION_ID) ||
                isSectionLocked(SECTION_ID) ||
                isProgrammaticScrollInProgress()
            ) {
                return;
            }

            const targetId = getSnapTarget(direction);
            if (!targetId) return;

            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            isSnapping.current = true;
            lockSection(SECTION_ID);

            // Center the card in the viewport
            const targetRect = targetEl.getBoundingClientRect();
            const offset = (window.innerHeight - targetRect.height) / 2;
            const targetY = targetRect.top + window.scrollY - Math.max(offset, 0);

            lenis.scrollTo(targetY, {
                duration: 0.8,
                force: true,
                lock: true,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
                onComplete: () => {
                    setTimeout(() => {
                        isSnapping.current = false;
                    }, 400);
                },
            });
        };

        const onWheel = (e: WheelEvent) => {
            if (!isVisible || isSnapping.current || isProgrammaticScrollInProgress()) return;

            if (resetTimer) clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                wheelAccumulator = 0;
                wheelAccumulatorUp = 0;
            }, 300);

            if (e.deltaY > 0) {
                wheelAccumulator += e.deltaY;
                wheelAccumulatorUp = 0;
                if (wheelAccumulator >= WHEEL_THRESHOLD) {
                    wheelAccumulator = 0;
                    trySnap("down");
                }
            } else if (e.deltaY < 0) {
                wheelAccumulatorUp += Math.abs(e.deltaY);
                wheelAccumulator = 0;
                if (wheelAccumulatorUp >= WHEEL_THRESHOLD) {
                    wheelAccumulatorUp = 0;
                    trySnap("up");
                }
            }
        };

        // Touch handling
        let touchStartY = 0;
        const onTouchStart = (e: TouchEvent) => {
            if (!isVisible) return;
            touchStartY = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (!isVisible || isSnapping.current) return;
            const deltaY = touchStartY - e.changedTouches[0].clientY;
            if (deltaY > 50) {
                trySnap("down");
            } else if (deltaY < -50) {
                trySnap("up");
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
            id="feature-showcase"
            ref={sectionRef}
            className="relative w-full py-20 sm:py-32 md:py-40 px-4 sm:px-6 bg-transparent z-10"
        >


            {/* Cards */}
            <div className="relative z-10 flex flex-col gap-24 sm:gap-32 md:gap-44 max-w-7xl mx-auto">
                {features.map((feature, i) => (
                    <div key={i} id={CARD_IDS[i]}>
                        <FeatureCard
                            feature={feature}
                            index={i}
                            reversed={i % 2 === 1}
                            cardRef={(el) => {
                                cardRefs.current[i] = el;
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
