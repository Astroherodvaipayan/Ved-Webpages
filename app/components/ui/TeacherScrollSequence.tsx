"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;
const HEADLINE_LINES = ["Building the", "greatest teacher", "ever"];
const EAGER_FRAME_COUNT = 10;

export default function TeacherScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [debugInfo, setDebugInfo] = useState("Initializing...");
    const currentFrame = useRef(0);
    const currentProgress = useRef(0);

    const loadSingleImage = (frameIndex: number): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = (frameIndex + 1).toString().padStart(3, "0");
            const src = `/images/ezgif-frame-${paddedIndex}.png`;
            img.src = src;
            img.onload = () => {
                if (frameIndex === 0) {
                    console.log(`✅ Frame 0 loaded: ${img.naturalWidth}x${img.naturalHeight} from ${src}`);
                }
                resolve(img);
            };
            img.onerror = () => {
                console.error(`❌ FAILED to load: ${src} — check your /public/images/ folder`);
                resolve(img);
            };
        });
    };

    useEffect(() => {
        let cancelled = false;
        console.log("🚀 Starting image load...");
        setDebugInfo("Loading images...");

        const loadProgressively = async () => {
            const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);
            const eagerCount = Math.min(EAGER_FRAME_COUNT, FRAME_COUNT);

            await Promise.all(
                Array.from({ length: eagerCount }, (_, i) =>
                    loadSingleImage(i).then((img) => { loadedImages[i] = img; })
                )
            );

            if (cancelled) return;

            const validCount = loadedImages.filter(img => img?.naturalWidth > 0).length;
            console.log(`📦 Eager load done. ${validCount}/${eagerCount} valid images`);

            if (validCount === 0) {
                setDebugInfo("❌ No images loaded — check /public/images/ path");
                console.error("No images loaded. Check that files exist at /public/images/ezgif-frame-001.png etc.");
                return;
            }

            imagesRef.current = [...loadedImages];
            setIsReady(true);
            setDebugInfo(`✅ ${validCount} frames ready`);

            const BATCH = 5;
            for (let i = eagerCount; i < FRAME_COUNT; i += BATCH) {
                if (cancelled) return;
                const end = Math.min(i + BATCH, FRAME_COUNT);
                await Promise.all(
                    Array.from({ length: end - i }, (_, j) =>
                        loadSingleImage(i + j).then((img) => {
                            loadedImages[i + j] = img;
                        })
                    )
                );
                if (!cancelled) imagesRef.current = [...loadedImages];
            }
            console.log("✅ All frames loaded");
        };

        loadProgressively();
        return () => { cancelled = true; };
    }, []);

    const getDrawParams = (
        img: HTMLImageElement,
        W: number,
        H: number
    ): [number, number, number, number] => {
        const imgRatio = img.width / img.height;
        const canvasRatio = W / H;
        if (imgRatio > canvasRatio) {
            const dh = H;
            const dw = H * imgRatio;
            return [dw, dh, (W - dw) / 2, 0];
        } else {
            const dw = W;
            const dh = W / imgRatio;
            return [dw, dh, 0, (H - dh) / 2];
        }
    };

    const renderFrame = (index: number, progress: number = 0) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const images = imagesRef.current;
        if (!images || images.length === 0) return;

        const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(index)));
        const img = images[idx];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const W = canvas.width;
        const H = canvas.height;
        const [dw, dh, ox, oy] = getDrawParams(img, W, H);

        const scale = 5 - 4 * progress;
        const drawX = ox - (dw * (scale - 1)) / 2;
        const drawY = oy - (dh * (scale - 1)) / 2;
        const drawW = dw * scale;
        const drawH = dh * scale;

        const fontSize = Math.min(W * 0.13, 160);
        const lineHeight = fontSize * 1.15;
        const totalTextH = HEADLINE_LINES.length * lineHeight;
        const startY = H / 2 - totalTextH / 2 + lineHeight / 2;

        // ── Black base on main canvas ──
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);

        // ── Set up offscreen ──
        if (!offscreenRef.current) {
            offscreenRef.current = document.createElement("canvas");
        }
        const off = offscreenRef.current;
        if (off.width !== W || off.height !== H) {
            off.width = W;
            off.height = H;
        }
        const offCtx = off.getContext("2d")!;
        offCtx.clearRect(0, 0, W, H);

        // ── Step 1: draw text first (the mask shape) ──
        offCtx.globalCompositeOperation = "source-over";
        offCtx.fillStyle = "white";
        offCtx.shadowColor = "white";
        offCtx.shadowBlur = 10;
        offCtx.font = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        HEADLINE_LINES.forEach((line, i) => {
            offCtx.fillText(line, W / 2, startY + i * lineHeight);
        });
        offCtx.shadowBlur = 0;

        // ── Step 2: clip image INTO the text shape ──
        offCtx.globalCompositeOperation = "source-in";
        offCtx.drawImage(img, drawX, drawY, drawW, drawH);

        // ── Step 3: reset and composite onto main ──
        offCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(off, 0, 0);
    };

    const syncCanvasSize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`📐 Canvas sized to ${canvas.width}x${canvas.height}`);
        // Force offscreen to resize next render
        if (offscreenRef.current) {
            offscreenRef.current.width = 0;
            offscreenRef.current.height = 0;
        }
    };

    useLayoutEffect(() => {
        if (!isReady || !canvasRef.current) return;

        syncCanvasSize();
        renderFrame(0, 0);

        const isMobile = window.innerWidth < 768;
        const pxPerFrame = isMobile ? 25 : 35;

        const frameScrollDist = FRAME_COUNT * pxPerFrame;  // 1400
        const deadZone = 50;
        const revealDist = 600;
        const totalScroll = frameScrollDist + deadZone + revealDist;

        const framePhaseEnd = frameScrollDist / totalScroll;
        const deadZoneEnd = (frameScrollDist + deadZone) / totalScroll;

        const st = ScrollTrigger.create({
            trigger: "#teacher-scroll",
            start: "top top",
            end: `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;

                if (p <= framePhaseEnd) {
                    // Phase 1: scrub frames, scale locked at 5 (fullscreen look)
                    const frameProgress = p / framePhaseEnd;
                    const idx = Math.min(
                        Math.floor(frameProgress * FRAME_COUNT),
                        FRAME_COUNT - 1
                    );
                    currentFrame.current = idx;
                    currentProgress.current = 0;
                    renderFrame(idx, 0);

                } else if (p <= deadZoneEnd) {
                    // Dead zone: hold last frame, scale stays at 5
                    currentFrame.current = FRAME_COUNT - 1;
                    currentProgress.current = 0;
                    renderFrame(FRAME_COUNT - 1, 0);

                } else {
                    // Phase 2: zoom-out reveal, scale 5 → 1
                    const revealProgress = (p - deadZoneEnd) / (1 - deadZoneEnd);
                    currentFrame.current = FRAME_COUNT - 1;
                    currentProgress.current = revealProgress;
                    renderFrame(FRAME_COUNT - 1, revealProgress);
                }
            },
        });

        ScrollTrigger.refresh();

        const handleResize = () => {
            syncCanvasSize();
            renderFrame(currentFrame.current, currentProgress.current);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            st.kill();
            window.removeEventListener("resize", handleResize);
            offscreenRef.current = null;
        };
    }, [isReady]);

    return (
        <section id="teacher-scroll" className="relative w-full h-screen bg-black">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Debug overlay — remove in production */}
            <div className="absolute top-4 left-4 text-white/60 text-xs font-mono bg-black/40 px-2 py-1 rounded pointer-events-none">
                {debugInfo}
            </div>

            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs tracking-widest uppercase">
                    Loading Sequence...
                </div>
            )}
        </section>
    );
}