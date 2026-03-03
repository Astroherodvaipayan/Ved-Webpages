"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function GlobalBackground({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> }) {
    // If no ref is provided, we can fallback to default window scroll
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
            {/* Vertical Gradient Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(to bottom, #EEF3FF 0%, #FAFBFF 45%, #F0F4FF 75%, #E8EEFF 100%)',
                }}
            />

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    style={{ y: glowY1, x: springX }}
                    className="absolute top-[42%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-accent-primary/15 rounded-full blur-[150px]"
                />
                <motion.div
                    style={{ y: glowY2, x: springY }}
                    className="absolute bottom-[-45%] right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-accent-secondary/15 rounded-full blur-[150px]"
                />
            </div>

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
