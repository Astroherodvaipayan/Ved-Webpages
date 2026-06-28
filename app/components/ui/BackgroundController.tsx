"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Section configuration — analogous near-shades, boosted for visibility
const sectionConfigs = [
    {
        id: "hero",
        backgroundColor: "#FAFBFF",
        gradientColors: [
            "rgba(26, 53, 120, 0.15)",
            "rgba(42, 74, 158, 0.10)",
            "rgba(200, 168, 48, 0.08)",
        ],
    },
    {
        id: "education-shift",
        backgroundColor: "#FFFEFB",
        gradientColors: [
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0)",
        ],
    },
    {
        id: "problem-statement",
        backgroundColor: "#FAFBFF",
        gradientColors: [
            "rgba(180, 40, 40, 0.12)",
            "rgba(210, 60, 48, 0.07)",
            "rgba(239, 100, 68, 0.05)",
        ],
    },
    {
        id: "architecture",
        backgroundColor: "#F0F4FF",
        gradientColors: [
            "rgba(26, 53, 120, 0.18)",
            "rgba(15, 31, 77, 0.12)",
            "rgba(42, 74, 158, 0.08)",
        ],
    },
    {
        id: "moat",
        backgroundColor: "#FAFBFF",
        gradientColors: [
            "rgba(200, 168, 48, 0.16)",
            "rgba(180, 145, 28, 0.10)",
            "rgba(212, 175, 55, 0.07)",
        ],
    },
    {
        id: "roadmap",
        backgroundColor: "#F5F8FF",
        gradientColors: [
            "rgba(200, 168, 48, 0.18)",
            "rgba(220, 190, 70, 0.10)",
            "rgba(180, 145, 28, 0.08)",
        ],
    },
    {
        id: "mission",
        backgroundColor: "#F0F4FF",
        gradientColors: [
            "rgba(26, 53, 120, 0.15)",
            "rgba(200, 168, 48, 0.10)",
            "rgba(42, 74, 158, 0.07)",
        ],
    },
    {
        id: "footer-cta",
        backgroundColor: "#FAFBFF",
        gradientColors: [
            "rgba(26, 53, 120, 0.10)",
            "rgba(200, 168, 48, 0.06)",
            "rgba(42, 74, 158, 0.04)",
        ],
    },
];

export default function BackgroundController() {
    const bgRef = useRef<HTMLDivElement>(null);
    const gradient1Ref = useRef<HTMLDivElement>(null);
    const gradient2Ref = useRef<HTMLDivElement>(null);
    const gradient3Ref = useRef<HTMLDivElement>(null);
    const borderGlowRef = useRef<HTMLDivElement>(null);

    function animateBackground(config: typeof sectionConfigs[0]) {
        // Animate main background color
        gsap.to(bgRef.current, {
            backgroundColor: config.backgroundColor,
            duration: 1.2,
            ease: "power2.inOut",
        });

        // Gradient orb 1 — top-left, scrim alpha falloff
        gsap.to(gradient1Ref.current, {
            background: `radial-gradient(ellipse 70% 45% at 18% 28%,
                ${config.gradientColors[0]} 0%,
                ${config.gradientColors[0].replace(/[\d.]+\)$/, '0.3)')} 40%,
                transparent 72%)`,
            duration: 1.5,
            ease: "power2.inOut",
        });

        // Gradient orb 2 — bottom-right
        gsap.to(gradient2Ref.current, {
            background: `radial-gradient(ellipse 55% 55% at 78% 68%,
                ${config.gradientColors[1]} 0%,
                ${config.gradientColors[1].replace(/[\d.]+\)$/, '0.25)')} 38%,
                transparent 70%)`,
            duration: 1.5,
            ease: "power2.inOut",
        });

        // Gradient orb 3 — center-mid, prevents flat middle zone
        gsap.to(gradient3Ref.current, {
            background: `radial-gradient(ellipse 50% 40% at 50% 50%,
                ${config.gradientColors[2]} 0%,
                ${config.gradientColors[2].replace(/[\d.]+\)$/, '0.2)')} 35%,
                transparent 65%)`,
            duration: 1.8,
            ease: "power2.inOut",
        });

        // Subtle scale pulse on transition
        gsap.fromTo([gradient1Ref.current, gradient2Ref.current, gradient3Ref.current],
            { scale: 0.85, opacity: 0.4 },
            { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }
        );

        // Border glow — golden with a hint of brand blue
        gsap.to(borderGlowRef.current, {
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
        });
    }

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            sectionConfigs.forEach((config) => {
                const section = document.getElementById(config.id);
                if (!section) return;

                ScrollTrigger.create({
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 40%",
                    onEnter: () => animateBackground(config),
                    onEnterBack: () => animateBackground(config),
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <div
                ref={bgRef}
                className="fixed inset-0 -z-10 transition-colors duration-1000"
                style={{ backgroundColor: sectionConfigs[0].backgroundColor }}
            >

                {/* Gradient Orb 1 — Top Left */}
                <div
                    ref={gradient1Ref}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 70% 45% at 18% 28%, ${sectionConfigs[0].gradientColors[0]}, transparent 72%)`,
                    }}
                />

                {/* Gradient Orb 2 — Bottom Right */}
                <div
                    ref={gradient2Ref}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 55% 55% at 78% 68%, ${sectionConfigs[0].gradientColors[1]}, transparent 70%)`,
                    }}
                />

                {/* Gradient Orb 3 — Center Mid (prevents flat middle) */}
                <div
                    ref={gradient3Ref}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${sectionConfigs[0].gradientColors[2]}, transparent 65%)`,
                    }}
                />

                {/* Subtle Grid Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.015]"
                    style={{
                        backgroundImage: `
                        linear-gradient(rgba(30,58,138,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(30,58,138,0.04) 1px, transparent 1px)
                    `,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Noise texture — tactile grain overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                    }}
                />

                {/* Scrim Vignette — 5-stop eased fade */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse at center,
                        transparent 0%,
                        transparent 35%,
                        rgba(250,251,255,0.08) 50%,
                        rgba(250,251,255,0.18) 72%,
                        rgba(250,251,255,0.30) 100%)`,
                    }}
                />
            </div>

            {/* Golden bleed border vignette - MUST be outside bgRef context */}

        </>
    );
}
