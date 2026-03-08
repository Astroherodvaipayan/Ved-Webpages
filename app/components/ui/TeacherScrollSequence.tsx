"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;
const HOLD_DISTANCE = 200;
const IRIS_WIPE_DISTANCE = 1000;

export default function TeacherScrollSequence() {
    const outerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const showSubtitleRef = useRef(false);
    const showOverlayRef = useRef(false);
    const currentFrame = useRef(0);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const irisContainerRef = useRef<HTMLDivElement>(null); // Main container for iris reveal
    const frame41OverlayRef = useRef<HTMLDivElement>(null); // Frame 41 overlay for fade
    const overlayShownRef = useRef(false); // Track overlay state synchronously
    const atMaxFrameRef = useRef(false); // Track if we've reached max frame

    // --- TO BE REMOVED: Old bulk preload ---
    // useEffect(() => {
    //     const loadImages = async () => {
    //         const loadedImages: HTMLImageElement[] = [];
    //         const promises = [];
    //
    //         for (let i = 1; i <= FRAME_COUNT; i++) {
    //             const promise = new Promise<void>((resolve) => {
    //                 const img = new Image();
    //                 const paddedIndex = i.toString().padStart(3, '0');
    //                 img.src = `/images/teacher-sequence/ezgif-frame-${paddedIndex}.png`;
    //                 img.onload = () => resolve();
    //                 img.onerror = () => {
    //                     console.error(`Failed to load frame ${i}`);
    //                     resolve();
    //                 };
    //                 loadedImages[i - 1] = img;
    //             });
    //             promises.push(promise);
    //         }
    //
    //         await Promise.all(promises);
    //         setImages(loadedImages);
    //         setIsLoading(false);
    //     };
    //
    //     loadImages();
    // }, []);
    // --- END TO BE REMOVED ---

    // Progressive loading: load first batch eagerly, then remaining frames in background
    const EAGER_FRAME_COUNT = 10; // First 10 frames load immediately

    const loadSingleImage = (frameIndex: number): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = (frameIndex + 1).toString().padStart(3, '0');
            img.src = `/images/teacher-sequence/ezgif-frame-${paddedIndex}.png`;
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`Failed to load frame ${frameIndex + 1}`);
                resolve(img); // Still resolve so we don't block
            };
        });
    };

    useEffect(() => {
        let cancelled = false;

        const loadProgressively = async () => {
            const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);

            // Phase 1: Load first batch eagerly (parallel)
            const eagerCount = Math.min(EAGER_FRAME_COUNT, FRAME_COUNT);
            const eagerPromises = [];
            for (let i = 0; i < eagerCount; i++) {
                eagerPromises.push(
                    loadSingleImage(i).then((img) => {
                        loadedImages[i] = img;
                    })
                );
            }
            await Promise.all(eagerPromises);

            if (cancelled) return;

            // Make component interactive as soon as the first batch is ready
            setImages([...loadedImages]);
            setIsLoading(false);

            // Phase 2: Load remaining frames in background (small batches to avoid network congestion)
            const BACKGROUND_BATCH_SIZE = 5;
            for (let i = eagerCount; i < FRAME_COUNT; i += BACKGROUND_BATCH_SIZE) {
                if (cancelled) return;

                const batchEnd = Math.min(i + BACKGROUND_BATCH_SIZE, FRAME_COUNT);
                const batchPromises = [];
                for (let j = i; j < batchEnd; j++) {
                    batchPromises.push(
                        loadSingleImage(j).then((img) => {
                            loadedImages[j] = img;
                        })
                    );
                }
                await Promise.all(batchPromises);

                if (cancelled) return;

                // Update state with newly loaded frames
                setImages([...loadedImages]);
            }
        };

        loadProgressively();

        return () => {
            cancelled = true;
        };
    }, []);

    // Render a specific frame onto the canvas
    const renderFrame = (index: number, isOverlay = false) => {
        const canvas = isOverlay ? canvasOverlayRef.current : canvasRef.current;
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
        if (canvasOverlayRef.current) {
            canvasOverlayRef.current.width = window.innerWidth;
            canvasOverlayRef.current.height = window.innerHeight;
        }
    };

    // Pin the section, scrub through frames, hold last frame for subtitle + iris wipe
    useLayoutEffect(() => {
        if (isLoading || images.length === 0 || !irisContainerRef.current || !outerRef.current) return;

        syncCanvasSize();
        renderFrame(0);

        // Initialize iris wipe CSS variable on main container
        if (irisContainerRef.current) {
            irisContainerRef.current.style.setProperty("--hole-size", "0vw");
        }

        // Shorter scroll distance on mobile for better UX
        const isMobile = window.innerWidth < 768;
        const pxPerFrame = isMobile ? 40 : 60;
        const holdDistance = isMobile ? Math.round(HOLD_DISTANCE * 0.5) : HOLD_DISTANCE;
        // Iris wipe distance proportional on mobile
        const irisWipeDistance = isMobile ? Math.round(IRIS_WIPE_DISTANCE * 0.5) : IRIS_WIPE_DISTANCE;
        const frameScrollDistance = FRAME_COUNT * pxPerFrame;
        const totalScrollDistance = frameScrollDistance + holdDistance + irisWipeDistance;

        // Set height synchronously on the wrapper BEFORE
        outerRef.current.style.height = `${totalScrollDistance + window.innerHeight}px`;

        // Calculate phase boundaries
        const framePhaseEnd = frameScrollDistance / totalScrollDistance;
        const subtitlePhaseEnd = (frameScrollDistance + holdDistance) / totalScrollDistance;

        const st = ScrollTrigger.create({
            trigger: outerRef.current,
            start: "top top",
            end: `+=${totalScrollDistance}`,
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;

                // Phase 1: Frame sequence (0 to 40)
                if (progress <= framePhaseEnd) {
                    const frameProgress = progress / framePhaseEnd;
                    // Cap at frame 40 (index 39) - lock it, don't cycle back
                    const idx = Math.min(Math.floor(frameProgress * FRAME_COUNT), FRAME_COUNT - 2);

                    // Check if at max frame
                    const isAtMaxFrame = idx === FRAME_COUNT - 2;
                    atMaxFrameRef.current = isAtMaxFrame;

                    // Always render when idx changes or when at final frame
                    if (idx !== currentFrame.current || isAtMaxFrame) {
                        currentFrame.current = idx;
                        renderFrame(idx);
                    }

                    // Show overlay frame 41 (index 40) when frame 40 (index 39) is reached
                    if (isAtMaxFrame) {
                        if (!overlayShownRef.current) {
                            overlayShownRef.current = true;
                            showOverlayRef.current = true;
                            setShowOverlay(true);
                        }
                        renderFrame(FRAME_COUNT - 1, true); // Render frame 41 on overlay
                    } else if (overlayShownRef.current) {
                        overlayShownRef.current = false;
                        showOverlayRef.current = false;
                        setShowOverlay(false);
                    }
                }

                // Phase 2: Hold for subtitle (frame 40-41 stacked)
                if (progress > framePhaseEnd && progress <= subtitlePhaseEnd) {
                    // Keep both frames stacked - ensure frame 40 on base, frame 41 on overlay
                    if (!overlayShownRef.current) {
                        overlayShownRef.current = true;
                        showOverlayRef.current = true;
                        setShowOverlay(true);
                        renderFrame(FRAME_COUNT - 2, false); // Ensure frame 40 on base canvas
                    }
                    // Always re-render both frames to ensure they stay correct
                    renderFrame(FRAME_COUNT - 2, false); // Frame 40 on base
                    renderFrame(FRAME_COUNT - 1, true);  // Frame 41 on overlay

                    // Show subtitle when entering hold phase
                    if (!showSubtitleRef.current) {
                        showSubtitleRef.current = true;
                        setShowSubtitle(true);
                    }
                }

                // Phase 3: Iris wipe + Fade out animation
                if (progress > subtitlePhaseEnd) {
                    // Hide subtitle during iris wipe
                    if (showSubtitleRef.current) {
                        showSubtitleRef.current = false;
                        setShowSubtitle(false);
                    }

                    // Always render correct frames during iris wipe
                    renderFrame(FRAME_COUNT - 2, false); // Frame 40 on base (index 39)
                    renderFrame(FRAME_COUNT - 1, true);  // Frame 41 on overlay (index 40)

                    // Calculate iris wipe progress (0 to 1)
                    const irisProgress = (progress - subtitlePhaseEnd) / (1 - subtitlePhaseEnd);
                    const holeSize = irisProgress * 150; // 0 to 150vw

                    // Apply iris wipe to full container (reveals ProductShowcase underneath)
                    if (irisContainerRef.current) {
                        irisContainerRef.current.style.setProperty("--hole-size", `${holeSize}vw`);
                    }

                    // Apply fade out to frame 41 starting at 40% of iris progress
                    let frame41Opacity = 1;
                    if (irisProgress > 0.4) {
                        // Fade from 1 to 0 between 40% and 100% of iris progress
                        frame41Opacity = 1 - ((irisProgress - 0.4) / 0.6);
                        frame41Opacity = Math.max(0, Math.min(1, frame41Opacity));
                    }
                    if (frame41OverlayRef.current) {
                        frame41OverlayRef.current.style.setProperty("--frame41-opacity", `${frame41Opacity}`);
                    }
                } else {
                    // Reset effects when going back
                    if (irisContainerRef.current) {
                        irisContainerRef.current.style.setProperty("--hole-size", "0vw");
                    }
                    if (frame41OverlayRef.current) {
                        frame41OverlayRef.current.style.setProperty("--frame41-opacity", "1");
                    }
                }
            },
            onLeave: () => {
                if (subtitleRef.current) {
                    gsap.to(subtitleRef.current, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.in",
                    });
                }
            },
            onLeaveBack: () => {
                showSubtitleRef.current = false;
                showOverlayRef.current = false;
                setShowSubtitle(false);
                setShowOverlay(false);
                overlayShownRef.current = false;
                atMaxFrameRef.current = false;
                if (irisContainerRef.current) {
                    irisContainerRef.current.style.setProperty("--hole-size", "0vw");
                }
                if (frame41OverlayRef.current) {
                    frame41OverlayRef.current.style.setProperty("--frame41-opacity", "1");
                }
            },
        });

        ScrollTrigger.refresh();

        // Delayed refresh to ensure DOM is ready and next section is positioned correctly
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        const handleResize = () => {
            syncCanvasSize();
            renderFrame(currentFrame.current);
            if (showOverlayRef.current) {
                renderFrame(40, true);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            st.kill();
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoading, images]);

    return (
        <div ref={outerRef} className="relative" style={{ overflow: 'visible', marginBottom: 1 }}>
            {/* Main container with iris reveal effect - reveals ProductShowcase underneath */}
            <div
                ref={irisContainerRef}
                className="sticky top-0 w-full h-screen bg-transparent"
                style={{
                    zIndex: 20,
                    maskImage: 'radial-gradient(circle at center, transparent var(--hole-size), black var(--hole-size), black 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--hole-size), black var(--hole-size), black 100%)',
                }}
            >
                {/* Frame 40 - base canvas (no mask) */}
                <div className="absolute inset-0 w-full h-full">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-cover"
                    />
                </div>


                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                        Loading Sequence...
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                {/* Subtitle */}
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
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
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
