// app/components/sections/FeatureShowcase.tsx

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import {
    recordSectionEntrance,
    isSnapAllowed,
    hasEntranceDelayElapsed,
    isSectionLocked,
    isProgrammaticScrollInProgress,
    lockSection,
} from "@/app/utils/scrollSnap";

gsap.registerPlugin(ScrollTrigger);

type Feature = {
    id: string;
    eyebrow: string;
    headline: string;
    subtext: string;
    points: string[];
    mediaFirst: boolean;
    image?: string;
    alt?: string;
    imagePosition?: string;
    familyItems?: Array<{
        title: string;
        copy: string;
    }>;
};

const features: Feature[] = [
    {
        id: "teacher",
        eyebrow: "TEACHER",
        headline: "Ved strengthens the teacher.",
        subtext:
            "The future does not reduce the teacher. It carries the teacher's presence, continuity, and power to transform a child's life.",
        points: [],
        image: "/images/rhythm-teacher-quote-card.png",
        alt: "Quote about teachers becoming transformative",
        mediaFirst: true,
        imagePosition: "left center",
    },
    {
        id: "institution",
        eyebrow: "INSTITUTION",
        headline: "Become a future-ready institution.",
        subtext:
            "Clarity becomes visible. Trust becomes continuous. Progress becomes shared across years, classrooms, and generations.",
        points: [],
        image: "/images/rhythm-institution-diagram-card.png",
        alt: "Ved institution diagram connecting learn, teach, lead and trust",
        mediaFirst: false,
        imagePosition: "right center",
    },
    {
        id: "family",
        eyebrow: "FAMILY",
        headline: "Every parent wants to believe the journey is working.",
        subtext:
            "Ved makes progress feel human. A family sees confidence forming, capability growing, and the child's future coming into view.",
        points: [],
        mediaFirst: false,
        familyItems: [
            {
                title: "Seen",
                copy: "The child is understood as a whole person.",
            },
            {
                title: "Supported",
                copy: "The next step feels clear and kind.",
            },
            {
                title: "Growing",
                copy: "Progress becomes something a family trusts.",
            },
        ],
    },
];

const FEATURE_CARD_IDS = features.map((feature) => `feature-card-${feature.id}`);
const NEXT_SECTION_ID = "moat";

/* ─────────────────────────────────────────────
   Individual Feature Card
   ───────────────────────────────────────────── */
interface FeatureCardProps {
    feature: (typeof features)[number];
    cardRef: (el: HTMLDivElement | null) => void;
}

function FeatureCard({ feature, cardRef }: FeatureCardProps) {
    const textPanel = (
        <div className="flex min-h-[360px] flex-col justify-center p-7 sm:p-10 md:w-[54%] md:p-12 lg:p-14">
            <p
                className="mb-5 text-[11px] font-extrabold uppercase text-[#B57A26] sm:text-xs"
                style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    letterSpacing: "0.28em",
                }}
            >
                {feature.eyebrow}
            </p>
            <h3
                className="max-w-[9ch] text-[clamp(2.8rem,5.4vw,5.6rem)] font-normal leading-[0.88] tracking-normal text-[#0A0F2E]"
                style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
            >
                {feature.headline}
            </h3>
            <p
                className="mt-8 max-w-2xl text-base leading-8 text-[#6B7280] sm:text-lg lg:text-xl"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
                {feature.subtext}
            </p>
            {feature.points.length > 0 && (
                <div className="mt-9 flex flex-wrap gap-3">
                    {feature.points.map((point) => (
                        <span
                            key={point}
                            className="rounded-full border border-[#0A0F2E]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0A0F2E]/68 shadow-[0_10px_28px_rgba(10,15,46,0.035)] sm:text-base"
                            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                        >
                            {point}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );

    const mediaPanel = feature.familyItems ? (
        <div className="flex items-center justify-center p-5 sm:p-7 md:w-[46%] md:p-8">
            <div className="w-full max-w-[560px] rounded-[28px] border border-[#0A0F2E]/10 bg-white p-5 shadow-[0_24px_70px_rgba(10,15,46,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] sm:p-7">
                <div className="space-y-5">
                    {feature.familyItems.map((item) => (
                        <article
                            key={item.title}
                            className="flex items-center gap-5 rounded-[22px] border border-[#0A0F2E]/10 bg-[#FFFEFB] px-5 py-5 shadow-[0_12px_34px_rgba(10,15,46,0.035)] sm:gap-6 sm:px-7 sm:py-6"
                        >
                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#D4AF37]/30 bg-[#FFF8EA] sm:h-16 sm:w-16">
                                <span className="h-4 w-4 rounded-full bg-[#C58A2C]" />
                            </span>
                            <span>
                                <strong
                                    className="block text-2xl font-normal leading-none text-[#0A0F2E] sm:text-3xl"
                                    style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                                >
                                    {item.title}
                                </strong>
                                <span
                                    className="mt-2 block text-sm leading-6 text-[#6B7280] sm:text-base"
                                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                                >
                                    {item.copy}
                                </span>
                            </span>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    ) : feature.image ? (
        <div className="flex items-center justify-center p-5 sm:p-7 md:w-[46%] md:p-8">
            <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-[24px] border border-[#0A0F2E]/10 bg-white shadow-[0_20px_60px_rgba(10,15,46,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
                <Image
                    src={feature.image}
                    alt={feature.alt ?? ""}
                    fill
                    className="object-cover"
                    style={{ objectPosition: feature.imagePosition }}
                    sizes="(min-width: 1280px) 500px, (min-width: 768px) 44vw, calc(100vw - 64px)"
                    priority={false}
                />
            </div>
        </div>
    ) : null;

    return (
        <div
            ref={cardRef}
            className="feature-card mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-xl sm:rounded-[32px]"
            style={{
                border: "1px solid rgba(30, 58, 138, 0.10)",
                boxShadow:
                    "0 24px 48px -12px rgba(30, 58, 138, 0.12), 0 0 0 1px rgba(30, 58, 138, 0.04)",
                opacity: 0,
                transform: "translateY(60px)",
            }}
        >
            <div className={`flex flex-col ${feature.mediaFirst ? "md:flex-row" : "md:flex-row"} w-full`}>
                {feature.mediaFirst ? (
                    <>
                        {mediaPanel}
                        {textPanel}
                    </>
                ) : (
                    <>
                        {textPanel}
                        {mediaPanel}
                    </>
                )}
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

    const SECTION_ID = "feature-showcase";

    /* ── Card entrance animations ── */
    useEffect(() => {
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
    }, []);

    /* ── Inter-card snapping + end-of-section snap ── */
    useEffect(() => {
        if (!lenis) return;
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
                    return FEATURE_CARD_IDS[closestIdx + 1];
                }
                // Otherwise snap to moat
                return NEXT_SECTION_ID;
            } else {
                // Snap to previous card
                if (closestIdx > 0) {
                    return FEATURE_CARD_IDS[closestIdx - 1];
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
    }, [lenis]);

    return (
        <section
            id="feature-showcase"
            ref={sectionRef}
            className="relative w-full py-20 sm:py-32 md:py-40 px-4 sm:px-6 bg-transparent z-10"
        >


            {/* Cards */}
            <div className="relative z-10 flex flex-col gap-24 sm:gap-32 md:gap-44 max-w-7xl mx-auto">
                {features.map((feature, i) => (
                    <div key={feature.id} id={FEATURE_CARD_IDS[i]}>
                        <FeatureCard
                            feature={feature}
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
