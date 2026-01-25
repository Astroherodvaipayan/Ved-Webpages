"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const features = [
    {
        title: "Personalized Pedagogy",
        description: "AI system that adapts to each learner's unique needs, learning style, and pace for truly personalized education.",
        color: "#8b5cf6", // Violet
        icon: "brain",
    },
    {
        title: "Teacher-AI Symbiosis",
        description: "Creating a personalized tutoring experience that reaches beyond geographic and socioeconomic boundaries.",
        color: "#00f0ff", // Cyan
        icon: "voice",
    },
    {
        title: "Dynamic Curriculum",
        description: "Course materials continuously adapted by AI, generating custom quizzes, mind maps, and explanations.",
        color: "#d4af37", // Gold
        icon: "gear",
    },
    {
        title: "Inclusive Learning",
        description: "Support for multiple languages, including regional Indian dialects, making learning accessible to diverse populations.",
        color: "#ec4899", // Pink
        icon: "language",
    },
];

// Abstract animated visual component - Dynamic Waves
function AbstractVisual({ color, type }: { color: string; type: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[inherit]">
            <svg className="absolute w-[200%] h-[200%] opacity-40" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Dynamic Wave 1 */}
                <motion.path
                    d="M0,100 C50,80 80,120 100,100 C120,80 150,120 200,100"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    animate={{
                        d: [
                            "M0,100 C50,80 80,120 100,100 C120,80 150,120 200,100",
                            "M0,100 C50,120 80,80 100,100 C120,120 150,80 200,100",
                            "M0,100 C50,80 80,120 100,100 C120,80 150,120 200,100"
                        ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Dynamic Wave 2 - Offset */}
                <motion.path
                    d="M0,100 C40,110 90,90 100,100 C110,110 160,90 200,100"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    animate={{
                        d: [
                            "M0,100 C40,110 90,90 100,100 C110,110 160,90 200,100",
                            "M0,100 C40,90 90,110 100,100 C110,90 160,110 200,100",
                            "M0,100 C40,110 90,90 100,100 C110,110 160,90 200,100"
                        ]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />

                {/* Rotating Ring */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    stroke={`url(#grad-${type})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="20 100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                />
            </svg>
        </div>
    );
}

export default function Roadmap() {
    return (
        <section id="roadmap" className="relative w-full py-40 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[150px]" />
            </div>

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-32"
            >
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 font-medium">Future Capabilities</p>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
                    System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white/80">Roadmap</span>
                </h2>
            </motion.div>

            {/* Expansive Circle Grid */}
            <motion.div className="flex flex-wrap justify-center gap-12 md:gap-16 items-start h-[500px]" layoutRoot>
                {features.map((feature, index) => (
                    <ExpandableCircleCard key={index} feature={feature} index={index} />
                ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div className="text-center mt-32">
                <button className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 transition-all duration-300 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-xs uppercase tracking-[0.3em] text-white group-hover:text-cyan-200 transition-colors">Initialize Systems</span>
                </button>
            </motion.div>
        </section>
    );
}

function ExpandableCircleCard({ feature, index }: { feature: typeof features[0], index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ layout: { duration: 0.4, type: "spring", bounce: 0.2 } }}
            viewport={{ once: true }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative z-10"
            style={{ zIndex: isHovered ? 50 : 10 }}
        >
            <motion.div
                animate={{
                    width: isHovered ? 320 : 140, // Base size reduced to 140px
                    height: isHovered ? 420 : 140,
                    borderRadius: isHovered ? 30 : 100,
                    backgroundColor: isHovered ? "#0a0a0a" : "rgba(255,255,255,0.05)"
                }}
                className="
                    relative flex items-center justify-center 
                    backdrop-blur-md border border-white/10 overflow-hidden
                "
                style={{
                    borderColor: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    // High Intensity Glow
                    boxShadow: isHovered
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${feature.color}30`
                        : `0 0 50px ${feature.color}60, 0 0 20px ${feature.color}80, inset 0 0 20px ${feature.color}20`, // Intense layered glow
                }}
            >
                {/* Restored Waves / Abstract Visual */}
                <AbstractVisual color={feature.color} type={feature.icon} />

                {/* Icon Layer (Center) - Fades OUT on hover */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                        opacity: isHovered ? 0 : 1,
                        scale: isHovered ? 0.5 : 1
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center relative"
                        style={{
                            background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`,
                            border: `1px solid ${feature.color}40`,
                            // Inner icon glow
                            boxShadow: `0 0 30px ${feature.color}40`
                        }}
                    >
                        <IconSvg feature={feature} className="w-8 h-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
                    </div>
                </motion.div>

                {/* Content Layer (Title & Description) - Fades IN on hover */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
                >
                    {/* Mini Icon at top of card */}
                    <div
                        className="mb-8 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                        style={{ background: `linear-gradient(135deg, ${feature.color}20, transparent)` }}
                    >
                        <IconSvg feature={feature} className="w-5 h-5" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{feature.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">{feature.description}</p>

                    <button className="px-6 py-2 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-300">
                        Explore
                    </button>
                </motion.div>

            </motion.div>
        </motion.div>
    );
}

// Icon Helper
function IconSvg({ feature, className }: { feature: any, className?: string }) {
    if (feature.icon === 'voice') {
        return <svg className={className || "w-8 h-8"} fill="none" stroke={feature.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
    }
    if (feature.icon === 'brain') {
        return <svg className={className || "w-8 h-8"} fill="none" stroke={feature.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 2h5l.5 6h-6l.5-6Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>
    }
    if (feature.icon === 'gear') {
        return <svg className={className || "w-8 h-8"} fill="none" stroke={feature.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }
    if (feature.icon === 'language') {
        return <svg className={className || "w-8 h-8"} fill="none" stroke={feature.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
    }
    return null;
}
