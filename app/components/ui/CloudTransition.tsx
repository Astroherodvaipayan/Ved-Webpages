"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Cloud transition configurations for each section boundary
const transitionConfigs = [
    { triggerId: "hero", nextId: "problem-statement", color: "rgba(30, 58, 138, 0.15)" },
    { triggerId: "problem-statement", nextId: "architecture", color: "rgba(220, 38, 38, 0.10)" },
    { triggerId: "architecture", nextId: "moat", color: "rgba(30, 58, 138, 0.12)" },
    { triggerId: "moat", nextId: "roadmap", color: "rgba(212, 175, 55, 0.15)" },
    { triggerId: "roadmap", nextId: "mission", color: "rgba(212, 175, 55, 0.12)" },
    { triggerId: "mission", nextId: "footer-cta", color: "rgba(30, 58, 138, 0.10)" },
];

export default function CloudTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cloudsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            transitionConfigs.forEach((config, index) => {
                const trigger = document.getElementById(config.triggerId);
                if (!trigger) return;

                const cloudLayer = cloudsRef.current[index];
                if (!cloudLayer) return;

                // Create scroll-triggered cloud animation
                ScrollTrigger.create({
                    trigger: trigger,
                    start: "bottom 80%",
                    end: "bottom 20%",
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;

                        // Clouds sweep in from sides, peak at 50%, then sweep out
                        const cloudOpacity = Math.sin(progress * Math.PI) * 0.8;
                        const leftX = -100 + (progress * 100);
                        const rightX = 100 - (progress * 100);
                        const scale = 0.8 + (progress * 0.4);

                        gsap.set(cloudLayer, {
                            opacity: cloudOpacity,
                            '--leftX': `${leftX}%`,
                            '--rightX': `${rightX}%`,
                            '--scale': scale,
                        });
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
            {transitionConfigs.map((config, index) => (
                <div
                    key={config.triggerId}
                    ref={(el) => { cloudsRef.current[index] = el; }}
                    className="absolute inset-0 opacity-0"
                    style={{
                        ['--leftX' as string]: '-100%',
                        ['--rightX' as string]: '100%',
                        ['--scale' as string]: 0.8,
                    }}
                >
                    {/* Left Cloud Mass */}
                    <div
                        className="absolute top-0 bottom-0 w-[60%]"
                        style={{
                            left: 'var(--leftX)',
                            transform: 'scale(var(--scale))',
                            background: `radial-gradient(ellipse 100% 80% at 0% 50%, ${config.color}, transparent 70%)`,
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Right Cloud Mass */}
                    <div
                        className="absolute top-0 bottom-0 w-[60%] right-0"
                        style={{
                            right: 'var(--rightX)',
                            transform: 'scale(var(--scale))',
                            background: `radial-gradient(ellipse 100% 80% at 100% 50%, ${config.color}, transparent 70%)`,
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Top Cloud Wisps */}
                    <div
                        className="absolute left-0 right-0 h-[40%] top-0"
                        style={{
                            transform: `translateY(calc(-50% + var(--leftX) * 0.3))`,
                            background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${config.color}, transparent 60%)`,
                            filter: 'blur(80px)',
                        }}
                    />

                    {/* Bottom Cloud Wisps */}
                    <div
                        className="absolute left-0 right-0 h-[40%] bottom-0"
                        style={{
                            transform: `translateY(calc(50% - var(--rightX) * 0.3))`,
                            background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${config.color}, transparent 60%)`,
                            filter: 'blur(80px)',
                        }}
                    />

                    {/* Center Fog */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${config.color.replace('0.', '0.1')}, transparent 50%)`,
                            filter: 'blur(100px)',
                            transform: 'scale(var(--scale))',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
