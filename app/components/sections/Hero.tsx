"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section id="hero" className="relative w-full h-screen" style={{ backgroundColor: "#f1ede3" }}>
            {/* Video Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <video
                    src="/boy1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Dark Gradient Overlay for text readability */}
            <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    background: "linear-gradient(to right, rgba(10, 15, 46, 0.9) 0%, rgba(10, 15, 46, 0.6) 30%, rgba(10, 15, 46, 0.2) 60%, transparent 100%)"
                }}
            />

            {/* Hero text content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center z-10 pl-[2%] pr-3 sm:pr-6 md:pr-8">
                <div className="w-full max-w-4xl md:max-w-5xl">
                    <motion.h1
                        className="text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] md:leading-[1.05] font-black tracking-tight text-white mb-4 md:mb-8 w-full overflow-hidden text-left"
                    >
                        <motion.span
                            className="block mb-1 text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            BRING YOUR
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col md:flex-row items-start md:items-center justify-start mb-1 gap-1 md:gap-4"
                        >
                            <motion.span
                                layout
                                className="text-white text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                            >
                                WAY OF
                            </motion.span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-secondary to-accent-secondary">LEARNING</span>
                        </motion.span>
                        <motion.span
                            className="block text-[clamp(2.2rem,9vw,4.5rem)] md:text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]"
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            TO LIFE.
                        </motion.span>
                    </motion.h1>
                </div>
            </div>

            {/* Orange haze overlay anchored to bottom of Hero */}
            <div className="pointer-events-none absolute left-0 right-0 -bottom-[00px] h-[40vh] md:h-[38vh]">
                <div className="absolute inset-0 hero-teacher-gradient" />
            </div>
        </section>
    );
}
