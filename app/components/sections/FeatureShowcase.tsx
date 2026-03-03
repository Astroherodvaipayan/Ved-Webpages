"use client";

import { motion } from "framer-motion";

const features = [
    {
        eyebrow: "PERSONALIZED LEARNING",
        headline: "[Feature headline goes here]",
        subtext:
            "[Feature description goes here — 2 to 3 sentences about what this feature does and why it matters to the learner.]",
        imageLabel: "Image Placeholder",
        reversed: false,
    },
    {
        eyebrow: "ADAPTIVE INTELLIGENCE",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        imageLabel: "Image Placeholder",
        reversed: true,
    },
    {
        eyebrow: "MASTERY EVALUATION",
        headline: "[Feature headline goes here]",
        subtext: "[Feature description goes here — 2 to 3 sentences.]",
        imageLabel: "Image Placeholder",
        reversed: false,
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: i * 0.15,
            ease: [0, 0, 0.58, 1] as const,
        },
    }),
};

export default function FeatureShowcase() {
    return (
        <section
            id="feature-showcase"
            className="relative w-full py-24 sm:py-32 px-4 sm:px-6"
        >
            {/* SVG Clip Path Definition for Image Box */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <clipPath id="ornamental-shape" clipPathUnits="objectBoundingBox">
                        <path d="M 0.5 0 Q 0.55 0.066 0.65 0.066 L 0.75 0.066 Q 0.8 0.066 0.8 0.1 L 0.8 0.233 Q 0.8 0.266 0.85 0.266 L 0.95 0.266 Q 1 0.266 1 0.3 L 1 0.7 Q 1 0.733 0.95 0.733 L 0.85 0.733 Q 0.8 0.733 0.8 0.766 L 0.8 0.9 Q 0.8 0.933 0.75 0.933 L 0.65 0.933 Q 0.55 0.933 0.5 1 Q 0.45 0.933 0.35 0.933 L 0.25 0.933 Q 0.2 0.933 0.2 0.9 L 0.2 0.766 Q 0.2 0.733 0.15 0.733 L 0.05 0.733 Q 0 0.733 0 0.7 L 0 0.3 Q 0 0.266 0.05 0.266 L 0.15 0.266 Q 0.2 0.266 0.2 0.233 L 0.2 0.1 Q 0.2 0.066 0.25 0.066 L 0.35 0.066 Q 0.45 0.066 0.5 0Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="max-w-6xl mx-auto flex flex-col gap-0">
                {features.map((feature, i) => (
                    <div key={i} className="min-h-[90vh] sm:min-h-screen flex items-center justify-center py-12">
                        <motion.div
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className={`flex flex-col w-full ${feature.reversed ? "md:flex-row-reverse" : "md:flex-row"
                                } gap-8 md:gap-16 items-center`}
                            style={{
                                background: "#FFFFFF",
                                border: "1px solid rgba(30, 58, 138, 0.12)",
                                borderRadius: "32px",
                                padding: "clamp(32px, 5vw, 48px)",
                                boxShadow: "0 30px 60px -15px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(30, 58, 138, 0.05)",
                            }}
                        >
                            {/* Text Content — 45% on desktop */}
                            <div
                                className="w-full md:w-[45%] flex flex-col justify-center"
                                style={{ padding: "0 0 0 0" }}
                            >
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
                                        fontFamily:
                                            "var(--font-montserrat), Montserrat, sans-serif",
                                        fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
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
                                        fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                                        color: "#2D3A6B",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {feature.subtext}
                                </p>
                            </div>

                            {/* Image Placeholder — 55% on desktop */}
                            <div
                                className="w-full md:w-[55%] flex items-center justify-center relative bg-[#E8EEFF]"
                                style={{
                                    minHeight: "260px",
                                    clipPath: "url(#ornamental-shape)",
                                    WebkitClipPath: "url(#ornamental-shape)",
                                }}
                            >
                                <span
                                    style={{
                                        color: "#6B7AA1",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        letterSpacing: "0.05em",
                                        zIndex: 10,
                                    }}
                                >
                                    {feature.imageLabel}
                                </span>
                                {/* Decorative accents for shape */}
                                <div className="absolute inset-0 border border-white/40 mix-blend-overlay pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section >
    );
}
