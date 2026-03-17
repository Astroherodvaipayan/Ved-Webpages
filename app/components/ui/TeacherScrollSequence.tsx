"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;

export default function TeacherScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentFrame = useRef(0);

    const EAGER_FRAME_COUNT = 10;

    const loadSingleImage = (frameIndex: number): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = (frameIndex + 1).toString().padStart(3, '0');
            img.src = `/images/ezgif-frame-${paddedIndex}.png`;
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`Failed to load frame ${frameIndex + 1}`);
                resolve(img);
            };
        });
    };

    useEffect(() => {
        let cancelled = false;

        const loadProgressively = async () => {
            const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);

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

            setImages([...loadedImages]);
            setIsLoading(false);

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
                setImages([...loadedImages]);
            }
        };

        loadProgressively();

        return () => {
            cancelled = true;
        };
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(index)));
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

    const syncCanvasSize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    useLayoutEffect(() => {
        if (isLoading || images.length === 0 || !canvasRef.current) return;

        syncCanvasSize();
        renderFrame(0);

        const isMobile = window.innerWidth < 768;
        const pxPerFrame = isMobile ? 25 : 35;
        const totalScrollDistance = FRAME_COUNT * pxPerFrame;

        const st = ScrollTrigger.create({
            trigger: "#teacher-scroll",
            start: "top top",
            end: `+=${totalScrollDistance}`,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
                const idx = Math.floor(self.progress * FRAME_COUNT);
                if (idx !== currentFrame.current && idx < FRAME_COUNT) {
                    currentFrame.current = idx;
                    renderFrame(idx);
                }
            },
        });

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
        <section id="teacher-scroll" className="relative w-full h-screen">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                    Loading Sequence...
                </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
        </section>
    );
}
