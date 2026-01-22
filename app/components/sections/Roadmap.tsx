"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Personalized Pedagogy Model",
        description: "AI system that adapts to each learner's unique needs, learning style, and pace for truly personalized education.",
        color: "#8b5cf6",
        icon: "brain",
    },
    {
        title: "Teacher-AI Symbiosis",
        description: "Creating a personalized tutoring experience that reaches beyond geographic and socioeconomic boundaries.",
        color: "#00f0ff",
        icon: "voice",
    },
    {
        title: "Dynamic Curriculum Tailoring",
        description: "Course materials continuously adapted by AI, generating custom quizzes, mind maps, and explanations based on individual progress.",
        color: "#d4af37",
        icon: "gear",
    },
    {
        title: "Multilingual & Inclusive Learning",
        description: "Support for multiple languages, including regional Indian dialects, making learning accessible to diverse populations.",
        color: "#ec4899",
        icon: "language",
    },
];

// Abstract animated visual component
function AbstractVisual({ color, type }: { color: string; type: string }) {
    return (
        <div className="relative h-56 md:h-72 flex items-center justify-center overflow-hidden">
            {/* Animated circles/shapes */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <defs>
                    <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Animated flowing lines */}
                <motion.path
                    d="M 50 150 Q 150 50, 200 150 T 350 150"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                />
                <motion.path
                    d="M 50 180 Q 150 100, 200 180 T 350 180"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, delay: 0.2, ease: "easeOut" }}
                />

                {/* Animated circles */}
                <motion.circle
                    cx="200"
                    cy="150"
                    r="60"
                    fill={`url(#grad-${type})`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                />
                <motion.circle
                    cx="200"
                    cy="150"
                    r="40"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                />

                {/* Floating dots */}
                {[...Array(5)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={100 + i * 60}
                        cy={120 + (i % 2) * 60}
                        r="4"
                        fill={color}
                        fillOpacity="0.6"
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                            duration: 2 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </svg>

            {/* Center icon */}
            <motion.div
                className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, ${color}20, ${color}05)`,
                    border: `1px solid ${color}30`
                }}
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
            >
                {type === 'voice' && (
                    <svg className="w-10 h-10" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )}
                {type === 'brain' && (
                    <svg className="w-10 h-10" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 2h5l.5 6h-6l.5-6Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8l3 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 8l-3 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                    </svg>
                )}
                {type === 'gear' && (
                    <svg className="w-10 h-10" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
                {type === 'language' && (
                    <svg className="w-10 h-10" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                )}
            </motion.div>
        </div>
    );
}

export default function Roadmap() {
    return (
        <section id="roadmap" className="relative w-full py-32 px-6 max-w-7xl mx-auto overflow-hidden">
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
                className="text-center mb-24"
            >
                <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">[ READY TO GET STARTED ]</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    What we&apos;re <span className="text-gradient">working on</span>
                </h2>
            </motion.div>

            {/* Quirky Grid with Slide-from-Side Animations */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                {/* Card 1 - Slides from LEFT */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-5 group relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden"
                >
                    <CardContent feature={features[0]} />
                </motion.div>

                {/* Card 2 - Slides from RIGHT, offset down */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-7 md:mt-24 group relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden"
                >
                    <CardContent feature={features[1]} isLarge />
                </motion.div>

                {/* Card 3 - Slides from LEFT */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-7 md:mt-8 group relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden"
                >
                    <CardContent feature={features[2]} isLarge />
                </motion.div>

                {/* Card 4 - Slides from RIGHT */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="md:col-span-5 md:mt-16 group relative rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden"
                >
                    <CardContent feature={features[3]} />
                </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center mt-28"
            >
                <button className="btn-secondary px-8 py-4 text-sm uppercase tracking-widest">
                    Let&apos;s Dive In
                </button>
            </motion.div>
        </section>
    );
}

// Card Content Component
function CardContent({ feature, isLarge = false }: { feature: typeof features[0], isLarge?: boolean }) {
    return (
        <>
            {/* Spacer for top padding */}
            <div className="pt-6" />

            {/* Abstract Animated Visual */}
            <AbstractVisual color={feature.color} type={feature.icon} />

            {/* Content */}
            <div className="px-6 pb-8">
                <h3 className={`${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold mb-3`}>{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-accent-primary/10 to-transparent" />
            </div>
        </>
    );
}
