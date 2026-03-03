"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        eyebrow: "PERSONALIZED LEARNING",
        headline: "[Feature headline goes here]",
        subtext:
            "[Feature description goes here — 2 to 3 sentences about what this feature does and why it matters to the learner.]",
        imageLabel: "Image Placeholder",
    },
    {
        eyebrow: "ADAPTIVE INTELLIGENCE",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        imageLabel: "Image Placeholder",
    },
    {
        eyebrow: "MASTERY EVALUATION",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        imageLabel: "Image Placeholder",
    },
];

export function OrnateShape({ color = "#E8855A", className = "", children }: { color?: string, className?: string, children?: ReactNode }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 200 240"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
            >
                <path
                    fill={color}
                    d="
            M 100,8
            C 115,6 145,14 160,26
            C 172,16 184,22 182,34
            C 194,50 198,80 196,100
            C 206,112 206,128 196,140
            C 198,160 194,190 182,206
            C 184,218 172,224 160,214
            C 145,226 115,234 100,232
            C 85,234 55,226 40,214
            C 28,224 16,218 18,206
            C 6,190 2,160 4,140
            C -6,128 -6,112 4,100
            C 2,80 6,50 18,34
            C 16,22 28,16 40,26
            C 55,14 85,6 100,8
            Z
          "
                />
            </svg>
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export default function FeatureShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Initial setup: hide all but the first item
            itemsRef.current.forEach((item, i) => {
                if (!item) return;
                if (i !== 0) {
                    gsap.set(item, { opacity: 0, y: 100 });
                }
            });

            // Create ScrollTrigger timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "center center",
                    end: "+=250%", // Scroll distance for 3 items
                    pin: true,
                    scrub: 1,
                }
            });

            // Animate transition between features
            features.forEach((_, i) => {
                if (i === features.length - 1) return; // Don't animate out the last item

                const currentItem = itemsRef.current[i];
                const nextItem = itemsRef.current[i + 1];

                // Add animations to timeline
                tl.to(currentItem, {
                    opacity: 0,
                    y: -100,
                    duration: 1,
                    ease: "power2.inOut"
                }, `+=${0.5}`) // add a little pause before animating out
                    .to(nextItem, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out"
                    }, "<+0.2"); // Start fading in slightly after current starts fading out
            });

            // Add a small pause at the end of the timeline to hold the last frame
            tl.to({}, { duration: 0.5 });

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="feature-showcase"
            ref={sectionRef}
            className="relative w-full min-h-screen py-12 sm:py-24 px-4 sm:px-6 flex items-center justify-center bg-transparent z-10"
        >
            <div
                className="relative w-full max-w-6xl h-[75vh] sm:h-[80vh] bg-white rounded-[32px] overflow-hidden shadow-2xl"
                style={{
                    border: "1px solid rgba(30, 58, 138, 0.12)",
                    boxShadow: "0 30px 60px -15px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(30, 58, 138, 0.05)",
                }}
            >
                {features.map((feature, i) => (
                    <div
                        key={i}
                        ref={(el) => { itemsRef.current[i] = el; }}
                        className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16 gap-8 md:gap-16"
                    >
                        {/* Text Content */}
                        <div className="w-full md:w-[45%] flex flex-col justify-center h-full">
                            {/* Eyebrow */}
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

                            {/* Headline */}
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

                            {/* Subtext */}
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

                        {/* Image Placeholder Shape */}
                        <div className="w-full md:w-[50%] flex items-center justify-center relative h-full bg-[#E8EEFF]/30 rounded-[24px]">
                            <OrnateShape color="#E8855A" className="w-[180px] h-[240px] sm:w-[240px] sm:h-[320px]">
                                <span
                                    className="text-white text-sm sm:text-base font-medium px-4 opacity-90 text-center"
                                >
                                    {feature.imageLabel}
                                </span>
                            </OrnateShape>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
