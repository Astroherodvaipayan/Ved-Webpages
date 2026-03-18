"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Feature Data
const features = [
    {
        title: "Personalized Pedagogy",
        description: "AI system that adapts to each learner's unique needs, learning style, and pace for truly personalized education. It builds a psychological profile of the learner to understand what motivates them.",
        color: "#8b5cf6", // Violet
        icon: "brain",
    },
    {
        title: "Teacher-AI Symbiosis",
        description: "Creating a personalized tutoring experience that reaches beyond geographic and socioeconomic boundaries. Teachers are empowered with real-time insights into student comprehension.",
        color: "#00f0ff", // Cyan
        icon: "voice",
    },
    {
        title: "Dynamic Curriculum",
        description: "Course materials continuously adapted by AI, generating custom quizzes, mind maps, and explanations. The content evolves as the world changes, ensuring relevance.",
        color: "#d4af37", // Gold
        icon: "gear",
    },
    {
        title: "Inclusive Learning",
        description: "Support for multiple languages, including regional Indian dialects, making learning accessible to diverse populations. Breaking down language barriers in real-time.",
        color: "#ec4899", // Pink
        icon: "language",
    },
];

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within this specific section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth out the scroll value for smoother animations
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section
            id="roadmap"
            ref={containerRef}
            className="relative w-full h-[400vh] bg-black"
        >
            <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center">

                {/* Background Ambient Neon Effects */}
                <BackgroundNeonLines />

                {/* Main Heading */}
                <motion.div
                    className="absolute top-12 md:top-16 z-20 text-center pointer-events-none"
                    style={{
                        opacity: useTransform(smoothProgress, [0, 0.1], [1, 0.5])
                    }}
                >
                    <div className="inline-block mb-2 md:mb-4 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 font-medium">Future Capabilities</p>
                    </div>
                    <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
                        System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white/80">Roadmap</span>
                    </h2>
                </motion.div>

                {/* The Path and Cards Container 
                    Increased top margin significantly to create the "5cm" gap (~200px).
                    mt-80 is 20rem = 320px. 
                    Previous was mt-40 (160px). adding ~150px gap.
                */}
                <div className="relative w-full max-w-6xl h-[65vh] flex items-center justify-center mt-80 md:mt-96">

                    {/* The Connecting Neon Wire */}
                    <NeonPath progress={smoothProgress} />

                    {/* The Interactivity Layer (Cards) */}
                    <div className="relative w-full h-full">
                        {features.map((feature, index) => {
                            // Centers: 12.5%, 37.5%, 62.5%, 87.5%
                            const center = 0.125 + (index * 0.25);
                            const startRange = center - 0.1;
                            const endRange = center + 0.1;

                            return (
                                <RoadmapCard
                                    key={index}
                                    feature={feature}
                                    index={index}
                                    globalProgress={smoothProgress}
                                    startRange={startRange}
                                    endRange={endRange}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Progress Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] tracking-widest uppercase animate-pulse"
                    style={{ opacity: useTransform(smoothProgress, [0.95, 1], [1, 0]) }}
                >
                    Scroll to Initialize
                </motion.div>
            </div>
        </section>
    );
}

function NeonPath({ progress }: { progress: any }) {
    // Organic Curve Path
    const pathD = `
        M 50,0 
        C 50,5 45,8 42,12.5              
        C 35,22 65,28 58,37.5            
        C 52,48 48,52 42,62.5            
        C 35,75 62,80 58,87.5            
        C 55,92 50,95 50,100             
    `;

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#00f0ff" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />

                <motion.path
                    d={pathD}
                    fill="none"
                    stroke="url(#neonGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    style={{
                        pathLength: useTransform(progress, [0, 0.95], [0, 1])
                    }}
                />
            </svg>
        </div>
    )
}

function RoadmapCard({ feature, index, globalProgress, startRange, endRange }: any) {
    const isLeft = index % 2 === 0;

    const opacity = useTransform(globalProgress, [startRange - 0.1, startRange, endRange, endRange + 0.1], [0.3, 1, 1, 0.3]);
    const scale = useTransform(globalProgress, [startRange - 0.1, startRange, endRange, endRange + 0.1], [0.85, 1, 1, 0.85]);
    const blur = useTransform(globalProgress, [startRange - 0.1, startRange, endRange, endRange + 0.1], ["blur(2px)", "blur(0px)", "blur(0px)", "blur(2px)"]);

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const unsubscribe = globalProgress.on("change", (latest: number) => {
            setIsActive(latest >= startRange && latest <= endRange);
        });
        return () => unsubscribe();
    }, [globalProgress, startRange, endRange]);

    return (
        <motion.div
            className={`absolute w-[40%] md:w-[35%] flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}
            style={{
                top: `${12.5 + (index * 25)}%`,
                left: isLeft ? '7.5%' : 'auto',
                right: isLeft ? 'auto' : '7.5%',
                y: "-50%",
                opacity,
                scale,
                filter: blur,
                zIndex: isActive ? 10 : 0
            }}
        >
            {/* Connection Dot */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-[${feature.color}] shadow-[0_0_10px_${feature.color}] z-20
                ${isLeft ? '-right-1.5' : '-left-1.5'} 
            `}
                style={{ borderColor: feature.color, boxShadow: `0 0 10px ${feature.color}` }}
            />

            <motion.div
                layout
                className={`
                    relative p-6 rounded-2xl border backdrop-blur-md transition-colors duration-500 w-full
                    ${isActive
                        ? `bg-white/10 border-${feature.color}/50`
                        : 'bg-white/5 border-white/10'
                    }
                `}
                style={{
                    borderColor: isActive ? feature.color : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? `0 0 30px -5px ${feature.color}20` : 'none'
                }}
            >
                <div className={`flex items-center gap-4 mb-2 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 border border-white/10 text-white">
                        <IconSvg feature={feature} className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{feature.title}</h3>
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? 12 : 0
                    }}
                    className="overflow-hidden"
                >
                    <p className="text-sm text-white/70 leading-relaxed">
                        {feature.description}
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

function BackgroundNeonLines() {
    const [lines, setLines] = useState<any[]>([]);

    useEffect(() => {
        const newLines = [...Array(5)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 3 + Math.random() * 5,
            delay: Math.random() * 2
        }));
        setLines(newLines);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {lines.map((line) => (
                <motion.div
                    key={line.id}
                    className="absolute w-[1px] h-[150px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
                    style={{
                        left: line.left,
                        top: line.top,
                    }}
                    animate={{
                        y: [-150, 1000],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: line.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: line.delay
                    }}
                />
            ))}
        </div>
    );
}

function IconSvg({ feature, className }: { feature: any, className?: string }) {
    if (feature.icon === 'voice') return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
    if (feature.icon === 'brain') return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 2h5l.5 6h-6l.5-6Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>;
    if (feature.icon === 'gear') return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    if (feature.icon === 'language') return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>;
    return null;
}
