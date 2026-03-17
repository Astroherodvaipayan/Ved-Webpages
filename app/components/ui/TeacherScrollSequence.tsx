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
    const currentFrame = useRef(0);
    const currentProgress = useRef(0);
    const currentFill = useRef(0);

    // ─── Image loading ───────────────────────────────────────────────────────────

    const loadSingleImage = (frameIndex: number): Promise<HTMLImageElement> =>
        new Promise((resolve) => {
            const img = new Image();
            const padded = (frameIndex + 1).toString().padStart(3, "0");
            img.src = `/images/ezgif-frame-${padded}.png`;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img); // resolve even on error so Promise.all doesn't hang
        });

    useEffect(() => {
        let cancelled = false;
        const loadProgressively = async () => {
            const loaded: HTMLImageElement[] = new Array(FRAME_COUNT);
            const eager = Math.min(EAGER_FRAME_COUNT, FRAME_COUNT);

            // Load first N frames eagerly before mounting ScrollTrigger
            await Promise.all(
                Array.from({ length: eager }, (_, i) =>
                    loadSingleImage(i).then((img) => { loaded[i] = img; })
                )
            );
            if (cancelled) return;
            imagesRef.current = [...loaded];
            setIsReady(true); // ← trigger ScrollTrigger setup exactly once

            // Load remaining frames in background batches
            const BATCH = 5;
            for (let i = eager; i < FRAME_COUNT; i += BATCH) {
                if (cancelled) return;
                const end = Math.min(i + BATCH, FRAME_COUNT);
                await Promise.all(
                    Array.from({ length: end - i }, (_, j) =>
                        loadSingleImage(i + j).then((img) => { loaded[i + j] = img; })
                    )
                );
                if (!cancelled) imagesRef.current = [...loaded];
            }
        };
        loadProgressively();
        return () => { cancelled = true; };
    }, []);

    // ─── Rendering ───────────────────────────────────────────────────────────────

    const getDrawParams = (
        img: HTMLImageElement,
        W: number,
        H: number
    ): [number, number, number, number] => {
        const imgRatio = img.width / img.height;
        const canvasRatio = W / H;
        if (imgRatio > canvasRatio) {
            const dh = H, dw = H * imgRatio;
            return [dw, dh, (W - dw) / 2, 0];
        } else {
            const dw = W, dh = W / imgRatio;
            return [dw, dh, 0, (H - dh) / 2];
        }
    };

    const renderFrame = (index: number, revealProgress: number = 0, fillProgress: number = 0) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const images = imagesRef.current;
        if (!images || images.length === 0) return;

        const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(index)));
        const img = images[idx];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const W = canvas.width;
        const H = canvas.height;
        const [dw, dh, ox, oy] = getDrawParams(img, W, H);

        // ── Phase 1: frame scrub — full opaque video, no clipping ───────────────
        if (revealProgress <= 0) {
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(img, ox, oy, dw, dh);
            return;
        }

        // ── Phase 2: reveal — clip video to scaled text shape ────────────────────
        //
        // Strategy: destination-in
        //   1. clearRect           → canvas fully transparent
        //   2. drawImage (video)   → canvas fully opaque with video
        //   3. offscreen canvas: text filled opaque on transparent bg
        //   4. destination-in      → canvas keeps video ONLY where offscreen is opaque
        //      i.e. only inside the letterforms
        //
        // Result: canvas is transparent outside letters.
        // BackgroundController (fixed -z-10 behind canvas) shows through naturally —
        // gradients, noise, grid and all — no color sampling needed.

        const MAX_SCALE = 10;
        const scale = MAX_SCALE - (MAX_SCALE - 1) * revealProgress; // 10 → 1

        const baseFontSize = Math.min(W * 0.13, 160);
        const lineHeight = baseFontSize * 1.15;
        const totalTextH = HEADLINE_LINES.length * lineHeight;
        const startY = H / 2 - totalTextH / 2 + lineHeight / 2;
        const fontString = `900 ${baseFontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;

        // ── Step A: build offscreen stencil (text = opaque, rest = transparent) ──
        if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
        const off = offscreenRef.current;
        if (off.width !== W || off.height !== H) { off.width = W; off.height = H; }
        const offCtx = off.getContext("2d")!;

        offCtx.clearRect(0, 0, W, H); // transparent base — this IS the bg proxy
        offCtx.save();
        offCtx.translate(W / 2, H / 2);
        offCtx.scale(scale, scale);
        offCtx.translate(-W / 2, -H / 2);
        offCtx.fillStyle = "#fff"; // colour irrelevant; only alpha matters for destination-in
        offCtx.font = fontString;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        HEADLINE_LINES.forEach((line, i) => {
            offCtx.fillText(line, W / 2, startY + i * lineHeight);
        });
        offCtx.restore();

        // ── Step B: draw video, then clip to stencil via destination-in ──────────
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(img, ox, oy, dw, dh);           // full video frame
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(off, 0, 0);                     // keep only text-shaped regions
        ctx.globalCompositeOperation = "source-over";

        // ── Step C: #254391 color fill — fades in during phase 3 ────────────────
        // Drawn at scale=1 (revealProgress=1) only. source-over on top of the
        // clipped video, so the video cross-fades out as the solid color takes over.
        if (fillProgress > 0) {
            ctx.save();
            ctx.globalAlpha = fillProgress;
            ctx.font = fontString;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#254391";
            HEADLINE_LINES.forEach((line, i) => {
                ctx.fillText(line, W / 2, startY + i * lineHeight);
            });
            ctx.restore();
        }

        // ── Step D: letterform edge glow at final scale ───────────────────────────
        // strokeText + shadowBlur applied AFTER the clip so it lands on the
        // now-transparent letterform edges, creating a delicate navy halo that
        // separates the video text from the gradient background behind it.
        const glowT = Math.max(0, Math.min(1, (scale - 1) / (2.5 - 1)));
        const glowAlpha = (1 - glowT) * 0.5; // 0.5 at scale=1, 0 at scale=2.5
        if (glowAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = glowAlpha;
            ctx.translate(W / 2, H / 2);
            ctx.scale(scale, scale);
            ctx.translate(-W / 2, -H / 2);
            ctx.font = fontString;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(26, 53, 120, 0.7)";
            ctx.shadowBlur = 14;
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = "rgba(26, 53, 120, 0.4)";
            HEADLINE_LINES.forEach((line, i) => {
                ctx.strokeText(line, W / 2, startY + i * lineHeight);
            });
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    };

    // ─── Canvas resize ───────────────────────────────────────────────────────────

    const syncCanvasSize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Invalidate offscreen so it gets recreated at new dimensions
        if (offscreenRef.current) {
            offscreenRef.current.width = 0;
            offscreenRef.current.height = 0;
        }
    };

    // ─── ScrollTrigger setup ─────────────────────────────────────────────────────

    useLayoutEffect(() => {
        if (!isReady || !canvasRef.current) return;

        syncCanvasSize();
        renderFrame(0, 0);

        const isMobile = window.innerWidth < 768;
        const pxPerFrame = isMobile ? 25 : 35;
        const frameScrollDist = FRAME_COUNT * pxPerFrame;  // phase 1
        const deadZone = 50;                         // pause
        const revealDist = 600;                        // phase 2
        const fillDist = 400;                        // phase 3 — color fill
        const totalScroll = frameScrollDist + deadZone + revealDist + fillDist;

        const framePhaseEnd = frameScrollDist / totalScroll;
        const deadZoneEnd = (frameScrollDist + deadZone) / totalScroll;
        const revealPhaseEnd = (frameScrollDist + deadZone + revealDist) / totalScroll;

        const st = ScrollTrigger.create({
            trigger: "#teacher-scroll",
            start: "top top",
            end: `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;

                if (p <= framePhaseEnd) {
                    // Phase 1: scrub through frames
                    const idx = Math.min(Math.floor((p / framePhaseEnd) * FRAME_COUNT), FRAME_COUNT - 1);
                    currentFrame.current = idx;
                    currentProgress.current = 0;
                    currentFill.current = 0;
                    renderFrame(idx, 0, 0);
                } else if (p <= deadZoneEnd) {
                    // Dead zone: hold last frame
                    currentFill.current = 0;
                    renderFrame(FRAME_COUNT - 1, 0, 0);
                } else if (p <= revealPhaseEnd) {
                    // Phase 2: text reveal (scale 10 → 1)
                    const revealProgress = (p - deadZoneEnd) / (revealPhaseEnd - deadZoneEnd);
                    currentFrame.current = FRAME_COUNT - 1;
                    currentProgress.current = revealProgress;
                    currentFill.current = 0;
                    renderFrame(FRAME_COUNT - 1, revealProgress, 0);
                } else {
                    // Phase 3: #254391 color fill fades in
                    const fillProgress = (p - revealPhaseEnd) / (1 - revealPhaseEnd);
                    currentFrame.current = FRAME_COUNT - 1;
                    currentProgress.current = 1;
                    currentFill.current = fillProgress;
                    renderFrame(FRAME_COUNT - 1, 1, fillProgress);
                }
            },
        });

        ScrollTrigger.refresh();

        const handleResize = () => {
            syncCanvasSize();
            renderFrame(currentFrame.current, currentProgress.current, currentFill.current);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            st.kill();
            window.removeEventListener("resize", handleResize);
            offscreenRef.current = null;
        };
    }, [isReady]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <section id="teacher-scroll" className="relative w-full h-screen">
            {/* bg-transparent — BackgroundController's fixed layer shows through */}
            <canvas ref={canvasRef} className="w-full h-full bg-transparent" />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-slate-400/60 text-xs tracking-[0.3em] uppercase font-light">
                        Loading
                    </span>
                </div>
            )}
        </section>
    );
}