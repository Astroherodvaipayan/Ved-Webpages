"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "../ui/GradientButton";

export default function JoinRevolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isClicked, setIsClicked] = useState(false);

    return (
        <section
            id="join-revolution"
            ref={sectionRef}
            className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-transparent z-10"
        >
            {/* Text block */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
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

            {/* Central Button */}
            <div className="relative z-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!isClicked ? (
                        <motion.div
                            key="button"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative"
                        >
                            <GradientButton label="Join Beta" onClick={() => setIsClicked(true)} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="coming-soon"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "backOut" }}
                            className="relative z-20 px-12 py-5 rounded-full overflow-hidden"
                            style={{
                                background: "rgba(10, 15, 46, 0.85)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                boxShadow: "0 8px 32px rgba(10, 15, 46, 0.25)",
                            }}
                        >
                            <span className="relative text-white font-bold text-xl tracking-wide">
                                Access unlocking soon 🚀
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}