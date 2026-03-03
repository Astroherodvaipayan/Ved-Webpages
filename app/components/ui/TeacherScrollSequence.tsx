"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;
// Extra scroll distance (px) to hold the last frame after iteration completes
const HOLD_DISTANCE = 1200;

export default function TeacherScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const currentFrame = useRef(0);
    const subtitleRef = useRef<HTMLDivElement>(null);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    const paddedIndex = i.toString().padStart(3, '0');
                    img.src = `/images/teacher-sequence/ezgif-frame-${paddedIndex}.png`;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve();
                    };
                    loadedImages[i - 1] = img;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Render a specific frame onto the canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(index)));
        const img = images[idx];
        if (!img) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            offsetY = 0;
            offsetX = (canvasWidth - drawWidth) / 2;
        } else {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Set canvas resolution to match viewport
    const syncCanvasSize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    // Pin the section, scrub through frames, hold last frame for 300px
    useLayoutEffect(() => {
        if (isLoading || images.length === 0 || !containerRef.current || !outerRef.current) return;

        syncCanvasSize();
        renderFrame(0);

        // Shorter scroll distance on mobile for better UX
        const isMobile = window.innerWidth < 768;
        const pxPerFrame = isMobile ? 40 : 60;
        const holdDistance = isMobile ? Math.round(HOLD_DISTANCE * 0.6) : HOLD_DISTANCE;
        const frameScrollDistance = FRAME_COUNT * pxPerFrame;
        const totalScrollDistance = frameScrollDistance + holdDistance;

        // ✅ KEY CHANGE: Set height synchronously on the wrapper BEFORE
        // ScrollTrigger.create() — no async pin-spacer injection means
        // ProductShowcase always sees the correct DOM height immediately
        outerRef.current.style.height = `${totalScrollDistance + window.innerHeight}px`;

        const st = ScrollTrigger.create({
            trigger: outerRef.current,   // ← trigger on the OUTER tall div
            start: "top top",
            end: `+=${totalScrollDistance}`,
            // ✅ NO pin, NO pinSpacing — CSS sticky handles this below
            scrub: true,
            onUpdate: (self) => {
                const frameFraction = frameScrollDistance / totalScrollDistance;
                const frameProgress = Math.min(self.progress / frameFraction, 1);
                const idx = Math.round(frameProgress * (FRAME_COUNT - 1));
                if (idx !== currentFrame.current) {
                    currentFrame.current = idx;
                    renderFrame(idx);
                }

                // Show subtitle when hold phase begins (all frames done)
                if (frameProgress >= 1 && !showSubtitle) {
                    setShowSubtitle(true);
                }
            },
            onLeave: () => {
                // Fade out subtitle when section exits
                if (subtitleRef.current) {
                    gsap.to(subtitleRef.current, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                    });
                }
            },
            onLeaveBack: () => {
                setShowSubtitle(false);
            },
        });

        // ✅ Refresh AFTER height is committed to DOM so ProductShowcase
        // recalculates against the correct page height
        ScrollTrigger.refresh();

        const handleResize = () => {
            syncCanvasSize();
            renderFrame(currentFrame.current);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            st.kill();
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoading, images]);

    return (
        // Outer div gets explicit height set via JS above — this is what
        // gives the page its scrollable distance with no GSAP pin-spacer
        <div ref={outerRef}>
            {/* CSS sticky replaces GSAP pin — stays at top while outer div scrolls */}
            <div
                ref={containerRef}
                className="sticky top-0 w-full bg-transparent"
                style={{ height: "100vh", zIndex: 20 }}
            >
                <div className="w-full h-screen overflow-hidden flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                        }}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                            Loading Sequence...
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-screen bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                {showSubtitle && (
                    <div
                        ref={subtitleRef}
                        className="absolute z-30 left-1/2 bottom-[10%] -translate-x-1 pointer-events-none w-full px-4"
                        style={{ animation: 'subtitleFadeIn 600ms ease-out forwards' }}
                    >
                        <p
                            className="text-white font-black tracking-widest uppercase text-center w-full drop-shadow-2xl"
                            style={{
                                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                                fontSize: window.innerWidth <= 768 ? 'clamp(1.25rem, 4vw, 2rem)' : 'clamp(2rem, 4vw, 4rem)',
                            }}
                        >
                            Building the greatest teacher ever.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
