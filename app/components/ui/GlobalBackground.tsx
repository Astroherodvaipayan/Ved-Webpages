"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function GlobalBackground({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> }) {
    const { scrollYProgress } = useScroll(
        containerRef ? {
            target: containerRef,
            offset: ["start start", "end start"]
        } : undefined
    );

    const glowY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Mouse Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set((clientX / innerWidth - 0.5) * 30);
            mouseY.set((clientY / innerHeight - 0.5) * 30);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FAFBFF]">
            {/* Diagonal multi-stop gradient — richer analogous stops for visible depth */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(135deg,
                        #E3ECFF 0%,
                        #EBF0FF 20%,
                        #F5F7FF 42%,
                        #FBF8F0 65%,
                        #F0EFFF 85%,
                        #E5EDFF 100%)`,
                }}
            />

            {/* Ambient glows — stronger opacity with scrim-eased falloff */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    style={{ y: glowY1, x: springX }}
                    className="absolute top-[20%] left-[5%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full"
                >
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `radial-gradient(circle at center,
                                rgba(26, 53, 120, 0.28) 0%,
                                rgba(30, 58, 138, 0.20) 18%,
                                rgba(42, 74, 158, 0.13) 36%,
                                rgba(42, 74, 158, 0.06) 55%,
                                transparent 75%)`,
                            filter: 'blur(80px)',
                        }}
                    />
                </motion.div>
                <motion.div
                    style={{ y: glowY2, x: springY }}
                    className="absolute bottom-[-20%] right-[5%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full"
                >
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `radial-gradient(circle at center,
                                rgba(200, 168, 48, 0.22) 0%,
                                rgba(212, 175, 55, 0.15) 18%,
                                rgba(212, 175, 55, 0.08) 38%,
                                rgba(212, 175, 55, 0.03) 58%,
                                transparent 78%)`,
                            filter: 'blur(80px)',
                        }}
                    />
                </motion.div>
            </div>

            {/* Noise texture overlay — tactile grain */}
            <div
                className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px',
                }}
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02] z-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(30,58,138,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.08) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />
        </div>
    );
}
