// app/components/sections/FeatureShowcase.tsx

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import { shouldSnap, snapToSection } from "@/app/utils/scrollSnap";

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

export function OrnateShape({ className = "", children }: { className?: string, children?: ReactNode }) {
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

export default function FeatureShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRefsRef = useRef<(HTMLDivElement | null)[]>([]);
    const shapeRefsRef = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const lenis = useLenis();
    const isSnapping = useRef(false);
    const hasTriggered = useRef(false);
    const [isMounted, setIsMounted] = useState(false);

    // Configuration
    const CONFIG = {
        nextSectionId: 'moat',
        animationCompleteProgress: 0.90,
        triggerBufferPx: 10,
        scrollDuration: 1.2,
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !lenis) return;
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Hide all text + shapes except the first
            textRefsRef.current.forEach((el, i) => {
                if (i !== 0 && el) gsap.set(el, { opacity: 0, y: 40 });
            });
            shapeRefsRef.current.forEach((el, i) => {
                if (i !== 0 && el) gsap.set(el, { opacity: 0, scale: 0.8, y: 30 });
            });

            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: "none" }
            });

            features.forEach((_, i) => {
                if (i === features.length - 1) return;

                const currentText = textRefsRef.current[i];
                const nextText = textRefsRef.current[i + 1];
                const currentShape = shapeRefsRef.current[i];
                const nextShape = shapeRefsRef.current[i + 1];

                // Fade out current text
                tl.to(currentText, {
                    opacity: 0,
                    y: -40,
                    duration: 0.8,
                    ease: "power2.inOut"
                }, "+=0.5")
                    // Shape transitions slightly after text starts
                    .to(currentShape, {
                        opacity: 0,
                        scale: 0.75,
                        y: -50,
                        duration: 0.8,
                        ease: "power2.inOut"
                    }, "<+0.1")
                    // Bring in next shape
                    .to(nextShape, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }, "<+0.2")
                    // Bring in next text
                    .to(nextText, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }, "<");
            });

            tl.to({}, { duration: 0.5 });

            // Create ScrollTrigger
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "+=250%",
                pin: true,
                scrub: 1,
                animation: tl,
                onUpdate: (self) => {
                    if (shouldSnap(self, CONFIG.animationCompleteProgress, CONFIG.triggerBufferPx, isSnapping, hasTriggered)) {
                        snapToSection(lenis, CONFIG.nextSectionId, CONFIG.scrollDuration, isSnapping, hasTriggered);
                    }

                    // Reset trigger flag when scrolling back up
                    if (self.progress < CONFIG.animationCompleteProgress && self.direction === -1) {
                        hasTriggered.current = false;
                        isSnapping.current = false;
                    }
                },
                onLeaveBack: () => {
                    hasTriggered.current = false;
                }
            });

        }, section);

        return () => {
            ctx.revert();
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
        };
    }, [isMounted, lenis]);

    return (
        <section
            id="feature-showcase"
            ref={sectionRef}
            className="relative w-full min-h-screen py-12 sm:py-24 px-4 sm:px-6 flex items-center justify-center bg-transparent z-10"
        >
            {/* ✅ Card is completely static — never moves or animates */}
            <div
                className="relative w-full max-w-6xl h-[75vh] sm:h-[80vh] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16 gap-8 md:gap-16"
                style={{
                    border: "1px solid rgba(30, 58, 138, 0.12)",
                    boxShadow: "0 30px 60px -15px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(30, 58, 138, 0.05)",
                }}
            >
                {/* Left — Text stack: each feature's text positioned absolute, only one visible */}
                <div className="relative w-full md:w-[45%] h-full flex flex-col justify-center">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            ref={(el) => { textRefsRef.current[i] = el; }}
                            className="absolute inset-0 flex flex-col justify-center"
                        >
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
                                    fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
                                    color: "#2D3A6B",
                                    lineHeight: 1.7,
                                }}
                            >
                                {feature.subtext}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right — Shape stack: ONLY the shapes animate, background panel is static */}
                <div className="relative w-full md:w-[50%] h-full flex items-center justify-center bg-[#E8EEFF]/30 rounded-[24px]">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            ref={(el) => { shapeRefsRef.current[i] = el; }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <OrnateShape
                                className="w-[300px] h-[380px] sm:w-[420px] sm:h-[520px]"
                            >
                                <span className="text-white text-sm sm:text-base font-medium px-4 opacity-90 text-center">
                                    {feature.imageLabel}
                                </span>
                            </OrnateShape>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}