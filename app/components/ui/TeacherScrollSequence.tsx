"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const FRAME_COUNT = 40;

export default function TeacherScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll (0 to 1) to frame index (0 to 39)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Smooth out the index slightly for fluid playback
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 200, damping: 30 });

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    // Pad with leading zeros (001, 002... 040)
                    const paddedIndex = i.toString().padStart(3, '0');
                    img.src = `/images/teacher-sequence/ezgif-frame-${paddedIndex}.jpg`;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve(); // Resolve anyway to continue
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

    // Draw frame to canvas
    useEffect(() => {
        if (isLoading || images.length === 0) return;

        const render = (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            // Ensure index is valid integer
            const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(index)));
            const img = images[idx];

            if (!img) return;

            // Maintain aspect ratio cover
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                // Image is wider than canvas
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgRatio;
                offsetY = 0;
                offsetX = (canvasWidth - drawWidth) / 2;
            } else {
                // Image is taller than canvas
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Subscribe to changes
        const unsubscribe = smoothFrameIndex.on("change", (latest) => {
            render(latest);
        });

        // Initial render
        render(smoothFrameIndex.get());

        // Handle resize (set canvas internal resolution)
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                // We want to fit the viewport or container width
                const rect = containerRef.current.getBoundingClientRect();
                // Set resolution higher for crispness
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight; // Or specific height
                render(smoothFrameIndex.get());
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, [isLoading, images, smoothFrameIndex]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[300vh] bg-black" // Tall container for scroll space
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                    }}
                />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">
                        Loading Sequence...
                    </div>
                )}
            </div>

            {/* Optional Overlay Text or Gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="sticky top-0 w-full h-screen bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
        </div>
    );
}
