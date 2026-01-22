"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SlicedRevealProps {
    text: string;
    className?: string;
    delay?: number;
    trigger?: boolean;
}

export function SlicedReveal({ text, className = "", delay = 0, trigger = true }: SlicedRevealProps) {
    return (
        <span className={`relative inline-block ${className}`}>
            {/* Screen reader accessible text */}
            <span className="sr-only">{text}</span>

            {/* Animated visual text */}
            <AnimatePresence>
                {trigger && (
                    <motion.span
                        aria-hidden="true"
                        className="block relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        {/* Top Half - slides from left */}
                        <motion.span
                            initial={{ x: "-110%" }}
                            animate={{ x: "0%" }}
                            transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                                delay: delay
                            }}
                            className="block overflow-hidden h-[0.52em] leading-none"
                        >
                            <span className="block">{text}</span>
                        </motion.span>

                        {/* Bottom Half - slides from right */}
                        <motion.span
                            initial={{ x: "110%" }}
                            animate={{ x: "0%" }}
                            transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                                delay: delay
                            }}
                            className="block overflow-hidden h-[0.52em] leading-none mt-[-0.02em]"
                        >
                            <span className="block mt-[-0.52em]">{text}</span>
                        </motion.span>

                        {/* Glitch Overlay - blue */}
                        <motion.span
                            initial={{ opacity: 0, x: 3 }}
                            animate={{
                                opacity: [0, 0.7, 0, 0.5, 0],
                                x: [3, -2, 3, -1, 0]
                            }}
                            transition={{ duration: 0.5, delay: delay + 0.2 }}
                            className="absolute inset-0 text-blue-500 mix-blend-screen pointer-events-none"
                            aria-hidden="true"
                            style={{ WebkitTextStroke: '0.5px #3B82F6' }}
                        >
                            {text}
                        </motion.span>

                        {/* Glitch Overlay - gold */}
                        <motion.span
                            initial={{ opacity: 0, x: -3 }}
                            animate={{
                                opacity: [0, 0.5, 0, 0.7, 0],
                                x: [-3, 2, -3, 1, 0]
                            }}
                            transition={{ duration: 0.5, delay: delay + 0.25 }}
                            className="absolute inset-0 text-[#FFFFFF] mix-blend-screen pointer-events-none"
                            aria-hidden="true"
                            style={{ WebkitTextStroke: '0.5px #FFFFFF' }}
                        >
                            {text}
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Fallback static text when not triggered (invisible but reserves space) */}
            {!trigger && (
                <span className="invisible" aria-hidden="true">{text}</span>
            )}
        </span>
    );
}
