"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Atmosphere() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!mounted || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Animate the floating clouds with scroll parallax
            const clouds = containerRef.current?.querySelectorAll('.cloud-element');
            clouds?.forEach((cloud, i) => {
                // Vertical parallax - each cloud moves at different speed
                gsap.to(cloud, {
                    y: () => window.innerHeight * (0.2 + (i % 3) * 0.15) * (i % 2 === 0 ? -1 : 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: document.body,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1 + (i * 0.3),
                    },
                });

                // Horizontal drift
                gsap.to(cloud, {
                    x: `${(i % 2 === 0 ? '+' : '-')}=${50 + i * 20}`,
                    duration: 15 + i * 5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 2 }}
        >
            {/* Large ambient clouds - these are the MAIN visible clouds */}

            {/* Top-left large cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                style={{
                    left: '-10%',
                    top: '5%',
                    width: '700px',
                    height: '400px',
                    background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, rgba(200, 220, 255, 0.08) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                }}
            />

            {/* Top-right cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.3 }}
                style={{
                    right: '-5%',
                    top: '15%',
                    width: '600px',
                    height: '350px',
                    background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Middle-left cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                style={{
                    left: '-15%',
                    top: '40%',
                    width: '800px',
                    height: '500px',
                    background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.06) 40%, transparent 70%)',
                    filter: 'blur(70px)',
                }}
            />

            {/* Middle-right cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
                style={{
                    right: '-10%',
                    top: '50%',
                    width: '650px',
                    height: '400px',
                    background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(200, 210, 255, 0.06) 40%, transparent 70%)',
                    filter: 'blur(55px)',
                }}
            />

            {/* Bottom-left cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.9 }}
                style={{
                    left: '5%',
                    bottom: '10%',
                    width: '900px',
                    height: '450px',
                    background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Bottom-right cloud */}
            <motion.div
                className="cloud-element absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.1 }}
                style={{
                    right: '0%',
                    bottom: '5%',
                    width: '750px',
                    height: '400px',
                    background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%)',
                    filter: 'blur(65px)',
                }}
            />

            {/* Wispy cloud streaks */}
            <motion.div
                animate={{
                    x: [-30, 30, -30],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="cloud-element absolute"
                style={{
                    left: '20%',
                    top: '20%',
                    width: '400px',
                    height: '80px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                    filter: 'blur(30px)',
                    transform: 'rotate(-5deg)',
                }}
            />

            <motion.div
                animate={{
                    x: [20, -20, 20],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="cloud-element absolute"
                style={{
                    right: '15%',
                    top: '60%',
                    width: '350px',
                    height: '60px',
                    background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.1), transparent)',
                    filter: 'blur(25px)',
                    transform: 'rotate(3deg)',
                }}
            />

            {/* Floating particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    animate={{
                        y: [0, -80 - i * 8],
                        opacity: [0.3, 0.7, 0],
                    }}
                    transition={{
                        duration: 10 + i * 0.8,
                        repeat: Infinity,
                        delay: i * 1.2,
                        ease: "easeOut",
                    }}
                    className="absolute rounded-full"
                    style={{
                        left: `${8 + i * 7}%`,
                        bottom: '15%',
                        width: `${4 + (i % 3)}px`,
                        height: `${4 + (i % 3)}px`,
                        background: i % 3 === 0
                            ? 'rgba(59, 130, 246, 0.9)'
                            : i % 3 === 1
                                ? 'rgba(139, 92, 246, 0.9)'
                                : 'rgba(255, 255, 255, 0.95)',
                        boxShadow: `0 0 ${10 + i % 5}px currentColor`,
                    }}
                />
            ))}
        </div>
    );
}
