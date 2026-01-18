"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorText, setCursorText] = useState("");

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Track hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for data attributes
            if (target.dataset.cursor === "pointer" ||
                target.closest("[data-cursor='pointer']") ||
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")) {
                setIsHovering(true);
                setCursorText(target.dataset.cursorText || "");
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.dataset.cursor === "pointer" ||
                target.closest("[data-cursor='pointer']") ||
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")) {
                setIsHovering(false);
                setCursorText("");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, [cursorX, cursorY]);

    // Hide on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice("ontouchstart" in window);
    }, []);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-white flex items-center justify-center"
                    animate={{
                        width: isHovering ? 80 : isClicking ? 8 : 16,
                        height: isHovering ? 80 : isClicking ? 8 : 16,
                    }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                    {cursorText && isHovering && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-black text-xs font-medium uppercase tracking-wider"
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </motion.div>
            </motion.div>

            {/* Trailing Dot */}
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 rounded-full bg-[var(--accent-cyan)] pointer-events-none z-[9998]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Hide default cursor globally */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}
