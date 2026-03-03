"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlicedReveal } from "../ui/SlicedReveal";
import { SlotMachineText } from "../ui/SlotMachineText";

export default function JoinRevolution() {
    const [isClicked, setIsClicked] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setShowComingSoon(true), 2000);
    };

    // Right lines - 13 lines spreading very wide (knowledge expansion)
    const rightLines = [
        { y: 0, color: "#1D4ED8" },
        { y: 8, color: "#3B82F6" },
        { y: 16, color: "#60A5FA" },
        { y: 24, color: "#22D3EE" },
        { y: 32, color: "#67E8F9" },
        { y: 42, color: "#A5F3FC" },
        { y: 50, color: "#FFFFFF" },
        { y: 58, color: "#FEF3C7" },
        { y: 68, color: "#FCD34D" },
        { y: 76, color: "#D4AF37" },
        { y: 84, color: "#F472B6" },
        { y: 92, color: "#EC4899" },
        { y: 100, color: "#DB2777" },
    ];

    return (
        <section id="join-revolution" className="relative w-full py-40 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onViewportEnter={() => setIsInView(true)}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl mx-auto px-6 mb-20"
            >

                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight mb-12 text-[#0A0F2E]">
                    To enable <br />
                    <span className="text-gradient">A BILLION GENIUSES</span>.
                </h2>

                <p className="text-xl text-[#2D3A6B] leading-relaxed max-w-2xl mx-auto mb-16">
                    We believe intelligence is evenly distributed, but opportunity is not.
                    Ved AI democratizes elite-level personalized education for everyone on Earth.
                </p>
            </motion.div>

            {/* Full-Width Flowing Lines Visual */}
            <div className="relative h-56 w-screen left-1/2 -translate-x-1/2">
                {/* SVG Curved Lines */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1600 224"
                    preserveAspectRatio="none"
                >
                    {/* Neon Glow Filters */}
                    <defs>
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur1" />
                            <feGaussianBlur stdDeviation="8" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="neonGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="5" result="blur1" />
                            <feGaussianBlur stdDeviation="14" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Left side - CHAOTIC SCRIBBLE LINES */}
                    <motion.path
                        d="M 0 40 C 100 120, 50 180, 150 100 C 250 20, 200 160, 350 80 C 450 30, 400 150, 550 110 C 650 80, 600 130, 750 112"
                        fill="none"
                        stroke="#666666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.7 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0, ease: "linear" }}
                    />
                    <motion.path
                        d="M 0 180 C 80 100, 120 200, 200 120 C 300 50, 280 180, 400 100 C 500 40, 480 160, 600 90 C 700 50, 680 120, 750 112"
                        fill="none"
                        stroke="#777777"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.6 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.2, delay: 0.1, ease: "linear" }}
                    />
                    <motion.path
                        d="M 0 100 C 70 40, 140 180, 220 80 C 320 10, 300 200, 420 120 C 520 50, 500 180, 620 100 C 720 40, 700 130, 750 112"
                        fill="none"
                        stroke="#555555"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.75 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.4, delay: 0.15, ease: "linear" }}
                    />
                    <motion.path
                        d="M 0 150 C 90 80, 60 200, 180 140 C 280 90, 250 190, 380 130 C 480 80, 450 170, 580 120 C 680 80, 650 150, 750 112"
                        fill="none"
                        stroke="#888888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.55 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.1, delay: 0.2, ease: "linear" }}
                    />

                    {/* CENTER - Straight white line connecting left and right */}
                    <motion.line
                        x1="750"
                        y1="112"
                        x2="850"
                        y2="112"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        filter="url(#neonGlowStrong)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    />

                    {/* Right side - 13 lines spreading very wide */}
                    {rightLines.map((line, i) => (
                        <motion.path
                            key={`right-${i}`}
                            d={`M 850 112 Q 1250 112, 1600 ${line.y * 2.24}`}
                            fill="none"
                            stroke={line.color}
                            strokeWidth="2.5"
                            filter={isClicked ? "url(#neonGlowStrong)" : "url(#neonGlow)"}
                            initial={{ opacity: 0.15 }}
                            animate={isClicked ? { opacity: 0.95 } : {}}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 1.2,
                                delay: i * 0.05,
                                ease: "easeOut"
                            }}
                        />
                    ))}

                    {/* Flowing particles on click */}
                    {isClicked && rightLines.map((line, i) => (
                        <motion.circle
                            key={`flow-${i}`}
                            r="4"
                            fill={line.color}
                            filter="url(#neonGlowStrong)"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                cx: [800, 1000, 1300, 1600],
                                cy: [112, 112, line.y * 1.5, line.y * 2.24]
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.06,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </svg>

                {/* Central Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!showComingSoon ? (
                            <motion.button
                                key="button"
                                onClick={handleClick}
                                disabled={isClicked}
                                whileHover={!isClicked ? { scale: 1.05 } : {}}
                                whileTap={!isClicked ? { scale: 0.98 } : {}}
                                animate={isClicked ? {
                                    boxShadow: [
                                        "0 0 0px rgba(59, 130, 246, 0)",
                                        "0 0 80px rgba(59, 130, 246, 0.9)",
                                        "0 0 120px rgba(255, 255, 255, 0.7)",
                                        "0 0 50px rgba(59, 130, 246, 0.5)"
                                    ]
                                } : {}}
                                transition={{ duration: 1.8 }}
                                className="relative z-20 px-10 py-4 bg-white text-black font-bold rounded-full cursor-pointer disabled:cursor-default"
                            >
                                <span className={isClicked ? "opacity-0" : ""}>Join the Revolution</span>

                                {/* Flying Plane */}
                                {isClicked && (
                                    <motion.div
                                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                                        animate={{
                                            x: [0, 80, 250, 400],
                                            y: [0, -40, -120, -200],
                                            opacity: [1, 1, 0.8, 0],
                                            rotate: [0, -20, -35, -45],
                                            scale: [1, 1.1, 0.9, 0.5]
                                        }}
                                        transition={{ duration: 1.8, ease: "easeOut" }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 2L11 13" />
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.button>
                        ) : (
                            <motion.div
                                key="coming-soon"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "backOut" }}
                                className="relative z-20 px-12 py-5 rounded-full overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    boxShadow: `
                                        0 8px 32px rgba(59, 130, 246, 0.3),
                                        0 0 60px rgba(255, 255, 255, 0.2),
                                        inset 0 1px 0 rgba(255,255,255,0.3),
                                        inset 0 -1px 0 rgba(0,0,0,0.1)
                                    `
                                }}
                            >
                                <div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
                                    }}
                                />
                                <span className="relative text-white font-bold text-xl tracking-wide drop-shadow-lg">
                                    Access unlocking soon 🚀
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Liquid Glow Burst */}
                {isClicked && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 3, 4], opacity: [0.9, 0.5, 0] }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle, rgba(59,130,246,0.7) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)"
                        }}
                    />
                )}
            </div>
        </section>
    );
}
