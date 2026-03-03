"use client";

import { useRef, useState, useCallback } from "react";

interface GradientButtonProps {
    label?: string;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export default function GradientButton({ label = "Experience Sarvam", onClick, className, style: propStyle }: GradientButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGradientPos({ x, y });
    }, []);

    // Gradient colors shift based on cursor x position:
    // Left  → cool blue/purple
    // Right → warm orange/peach
    const blueStop = `hsl(${220 - gradientPos.x * 0.3}, 55%, ${45 + gradientPos.y * 0.1}%)`;
    const orangeStop = `hsl(${25 + gradientPos.x * 0.2}, 75%, ${60 + gradientPos.y * 0.1}%)`;

    const gradient = isHovered
        ? `radial-gradient(ellipse at ${gradientPos.x}% ${gradientPos.y}%, ${orangeStop} 0%, ${blueStop} 100%)`
        : `linear-gradient(135deg, #2a4284 0%, #172346 100%)`;

    return (
        <button
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{
                background: gradient,
                transition: isHovered
                    ? "background 0.05s ease"   // near-instant while tracking
                    : "background 0.5s ease",    // smooth fade out on leave
                border: "none",
                outline: "none",
                cursor: "pointer",
                padding: "14px 32px",
                borderRadius: "999px",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "0.01em",
                fontFamily: "inherit",
                boxShadow: isHovered
                    ? "0 8px 32px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)"
                    : "0 4px 16px rgba(0,0,0,0.25), inset 0 0 0 1.5px rgba(255,255,255,0.2), inset 0 2px 10px rgba(255,255,255,0.15)",
                ...propStyle,
            }}
            className={className}
        >
            {label}
        </button>
    );
}
