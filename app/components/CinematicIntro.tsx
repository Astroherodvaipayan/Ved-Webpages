"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CinematicIntroProps {
    onComplete: () => void;
}

// Image paths as per PRD
const IMAGE_PATHS = {
    background: "/book/bg.webp",
    foreground: "/book/foreground.webp",
    glow: "/book/glow.webp",
};

// Check if critical images exist (bg and foreground)
async function checkCriticalImagesExist(): Promise<boolean> {
    console.log("🔍 [CinematicIntro] Checking critical images...");

    // Check background
    const bgExists = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = IMAGE_PATHS.background;
    });

    if (!bgExists) {
        console.log("❌ [CinematicIntro] bg.webp not found");
        return false;
    }

    // Check foreground
    const fgExists = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = IMAGE_PATHS.foreground;
    });

    if (!fgExists) {
        console.log("❌ [CinematicIntro] foreground.webp not found");
        return false;
    }

    console.log("✅ [CinematicIntro] Critical images exist");
    return true;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLImageElement>(null);
    const foregroundRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLImageElement>(null);
    const whiteoutRef = useRef<HTMLDivElement>(null);
    const [imagesReady, setImagesReady] = useState(false);
    const masterTlRef = useRef<gsap.core.Timeline | null>(null);

    // Check if images exist on mount
    useEffect(() => {
        checkCriticalImagesExist().then((exist) => {
            if (!exist) {
                console.log("🔍 [CinematicIntro] Skipping intro - critical images missing");
                onComplete();
                return;
            }
            setImagesReady(true);
        });
    }, [onComplete]);

    // Run the GSAP animation sequence
    useEffect(() => {
        if (!imagesReady || !containerRef.current) return;

        const container = containerRef.current;
        const background = backgroundRef.current;
        const foreground = foregroundRef.current;
        const glow = glowRef.current;
        const whiteout = whiteoutRef.current;

        if (!background || !foreground || !glow || !whiteout) return;

        // Guard 1: LocalStorage check
        if (localStorage.getItem("hasSeenIntro") === "true") {
            onComplete();
            return;
        }

        // Guard 2: Accessibility (prefers-reduced-motion)
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            gsap.to(container, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    localStorage.setItem("hasSeenIntro", "true");
                    onComplete();
                },
            });
            return;
        }

        // Build the GSAP master timeline
        const masterTl = gsap.timeline({
            onComplete: () => {
                localStorage.setItem("hasSeenIntro", "true");
            },
        });
        masterTlRef.current = masterTl;

        // Phase 1: Ambient Floating (0% - 80% asset load simulation)
        // Background stays still, only foreground moves
        gsap.to(foreground, {
            x: "-1%",
            y: "0.5%",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Pulsing glow effect
        gsap.to(glow, {
            opacity: 0.7,
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Phase 2: Action Push In (80% - 100%)
        const pushInDuration = 2.5;

        masterTl.to(foreground, {
            scale: 15,
            duration: pushInDuration,
            ease: "expo.in",
        }, 3);

        masterTl.to(background, {
            scale: 0.9,
            duration: pushInDuration,
            ease: "expo.in",
        }, "<");

        masterTl.to(glow, {
            opacity: 1,
            scale: 1.5,
            duration: pushInDuration * 0.8,
            ease: "expo.in",
        }, "<");

        // Phase 3: Whiteout Transition
        masterTl.to(whiteout, {
            opacity: 1,
            duration: 1.2,
            ease: "power2.in",
        }, "-=0.5");

        // Phase 4: Reveal the site
        masterTl.call(() => {
            onComplete();
        });

        // Fallback timeout - 8 seconds max
        const fallbackTimeout = setTimeout(() => {
            if (masterTlRef.current && masterTlRef.current.isActive()) {
                masterTlRef.current.kill();
                gsap.to(whiteout, {
                    opacity: 1,
                    duration: 0.5,
                    onComplete: () => {
                        localStorage.setItem("hasSeenIntro", "true");
                        onComplete();
                    },
                });
            }
        }, 8000);

        return () => {
            clearTimeout(fallbackTimeout);
            if (masterTlRef.current) {
                masterTlRef.current.kill();
            }
            gsap.killTweensOf([background, foreground, glow]);
        };
    }, [imagesReady, onComplete]);

    if (!imagesReady) return null;

    return (
        <div
            id="intro-container"
            ref={containerRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                backgroundColor: "#050b14",
                overflow: "hidden",
            }}
        >
            {/* Layer 1: Background - Space */}
            <img
                ref={backgroundRef}
                src={IMAGE_PATHS.background}
                alt="Space Background"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    willChange: "transform, opacity",
                    zIndex: 1,
                }}
            />

            {/* Layer 2: Foreground - Boy reading book */}
            <img
                ref={foregroundRef}
                src={IMAGE_PATHS.foreground}
                alt="Boy reading book"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    willChange: "transform, opacity",
                    zIndex: 2,
                    transformOrigin: "60% 75%",
                }}
            />

            {/* Layer 3: Glow overlay */}
            <img
                ref={glowRef}
                src={IMAGE_PATHS.glow}
                alt="Magic Glow"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    willChange: "transform, opacity",
                    zIndex: 3,
                    opacity: 0.5,
                }}
            />

            {/* Whiteout overlay */}
            <div
                ref={whiteoutRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#fffbea",
                    zIndex: 9999,
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
