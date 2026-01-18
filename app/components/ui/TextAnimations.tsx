"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 200);
        }, 3000 + Math.random() * 2000); // Random glitch interval
        return () => clearInterval(interval);
    }, []);

    return (
        <span className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <AnimatePresence>
                {isGlitching && (
                    <>
                        <motion.span
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: -2, y: 1, filter: "hue-rotate(90deg)" }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 left-0 text-accent-cyan opacity-70 z-0 mix-blend-screen"
                        >
                            {text}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 2, y: -1, filter: "hue-rotate(-90deg)" }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 left-0 text-accent-magenta opacity-70 z-0 mix-blend-screen"
                        >
                            {text}
                        </motion.span>
                    </>
                )}
            </AnimatePresence>
        </span>
    );
}

// ... existing TypewriterText, RollingText, SlideInText components ...
// (I will duplicate them here to keep the file self-contained or I can append to it.
// Since I overwrite, I must include all previous components to avoid breaking imports.)

interface TypewriterTextProps {
    text: string;
    delay?: number;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

export function TypewriterText({
    text,
    delay = 0,
    speed = 50,
    className = "",
    onComplete
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    setIsComplete(true);
                    onComplete?.();
                }
            }, speed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay, speed, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {!isComplete && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-[3px] h-[1em] bg-accent-primary ml-1 align-middle"
                />
            )}
        </span>
    );
}

interface RollingTextProps {
    words: string[];
    interval?: number;
    className?: string;
}

export function RollingText({
    words,
    interval = 3000,
    className = ""
}: RollingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval]);

    return (
        <span className={`inline-block relative overflow-hidden ${className}`}>
            <motion.span
                key={currentIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-block"
            >
                {words[currentIndex]}
            </motion.span>
        </span>
    );
}

interface SlideInTextProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    className?: string;
}

export function SlideInText({
    children,
    direction = "up",
    delay = 0,
    className = ""
}: SlideInTextProps) {
    const directionMap = {
        left: { x: -100, y: 0 },
        right: { x: 100, y: 0 },
        up: { x: 0, y: 50 },
        down: { x: 0, y: -50 }
    };

    const initial = { ...directionMap[direction], opacity: 0 };

    return (
        <motion.div
            initial={initial}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface CharacterRevealProps {
    text: string;
    className?: string;
    stagger?: number;
}

export function CharacterReveal({
    text,
    className = "",
    stagger = 0.03
}: CharacterRevealProps) {
    return (
        <span className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * stagger, duration: 0.3 }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}
