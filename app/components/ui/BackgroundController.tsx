"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Section configuration with unique vibes
const sectionConfigs = [
    {
        id: "hero",
        backgroundColor: "#050505",
        gradientColors: ["rgba(59, 130, 246, 0.08)", "rgba(139, 92, 246, 0.05)"],
        particleColor: "#3B82F6",
    },
    {
        id: "product-showcase",
        backgroundColor: "#030308",
        gradientColors: ["rgba(59, 130, 246, 0.1)", "rgba(99, 102, 241, 0.08)"],
        particleColor: "#6366F1",
    },
    {
        id: "problem-statement",
        backgroundColor: "#0a0a0a",
        gradientColors: ["rgba(239, 68, 68, 0.06)", "rgba(220, 38, 38, 0.04)"],
        particleColor: "#EF4444",
    },
    {
        id: "architecture",
        backgroundColor: "#050510",
        gradientColors: ["rgba(59, 130, 246, 0.1)", "rgba(30, 64, 175, 0.08)"],
        particleColor: "#3B82F6",
    },
    {
        id: "moat",
        backgroundColor: "#0a0a0f",
        gradientColors: ["rgba(139, 92, 246, 0.1)", "rgba(109, 40, 217, 0.06)"],
        particleColor: "#8B5CF6",
    },
    {
        id: "roadmap",
        backgroundColor: "#050508",
        gradientColors: ["rgba(212, 175, 55, 0.08)", "rgba(245, 158, 11, 0.05)"],
        particleColor: "#D4AF37",
    },
    {
        id: "mission",
        backgroundColor: "#030305",
        gradientColors: ["rgba(59, 130, 246, 0.1)", "rgba(255, 255, 255, 0.05)"],
        particleColor: "#FFFFFF",
    },
    {
        id: "footer-cta",
        backgroundColor: "#050505",
        gradientColors: ["rgba(59, 130, 246, 0.05)", "rgba(139, 92, 246, 0.03)"],
        particleColor: "#3B82F6",
    },
];

export default function BackgroundController() {
    const bgRef = useRef<HTMLDivElement>(null);
    const gradient1Ref = useRef<HTMLDivElement>(null);
    const gradient2Ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            sectionConfigs.forEach((config, index) => {
                const section = document.getElementById(config.id);
                if (!section) return;

                ScrollTrigger.create({
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 40%",
                    onEnter: () => animateBackground(config, index),
                    onEnterBack: () => animateBackground(config, index),
                });
            });
        });

        return () => ctx.revert();
    }, []);

    const animateBackground = (config: typeof sectionConfigs[0], index: number) => {
        // Animate main background color
        gsap.to(bgRef.current, {
            backgroundColor: config.backgroundColor,
            duration: 1.2,
            ease: "power2.inOut",
        });

        // Animate gradient orbs
        gsap.to(gradient1Ref.current, {
            background: `radial-gradient(ellipse 80% 50% at 20% 30%, ${config.gradientColors[0]}, transparent 70%)`,
            duration: 1.5,
            ease: "power2.inOut",
        });

        gsap.to(gradient2Ref.current, {
            background: `radial-gradient(ellipse 60% 60% at 80% 70%, ${config.gradientColors[1]}, transparent 70%)`,
            duration: 1.5,
            ease: "power2.inOut",
        });

        // Add subtle scale pulse on transition
        gsap.fromTo([gradient1Ref.current, gradient2Ref.current],
            { scale: 0.8, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }
        );
    };

    return (
        <div
            ref={bgRef}
            className="fixed inset-0 -z-10 transition-colors duration-1000"
            style={{ backgroundColor: sectionConfigs[0].backgroundColor }}
        >
            {/* Gradient Orb 1 - Top Left */}
            <div
                ref={gradient1Ref}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 20% 30%, ${sectionConfigs[0].gradientColors[0]}, transparent 70%)`,
                }}
            />

            {/* Gradient Orb 2 - Bottom Right */}
            <div
                ref={gradient2Ref}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 60% 60% at 80% 70%, ${sectionConfigs[0].gradientColors[1]}, transparent 70%)`,
                }}
            />

            {/* Subtle Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                }}
            />
        </div>
    );
}
