"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ImageTransition() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !textRef.current || !imageContainerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.5,
                }
            });

            // 1. Text fades in & zooms slightly
            tl.fromTo(textRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
            )
                // 2. Text holds then fades out
                .to(textRef.current, { opacity: 0, scale: 1.1, duration: 0.5 }, "+=0.5")

                // 3. Image container starts tiny, zooms in
                .fromTo(imageContainerRef.current,
                    { scale: 0.1, opacity: 0 },
                    {
                        scale: 0.5,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out"
                    },
                    "-=0.3"
                )
                // 4. Image zooms to full screen
                .to(imageContainerRef.current, {
                    scale: 1,
                    ease: "power2.inOut",
                    duration: 0.6
                })
                // 5. Image fades out
                .to(imageContainerRef.current, {
                    opacity: 0,
                    scale: 1.2,
                    duration: 0.5
                });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#050505' }}
        >
            {/* The Text */}
            <h2
                ref={textRef}
                className="absolute z-20 text-4xl md:text-6xl lg:text-7xl text-center text-white leading-tight max-w-4xl px-6"
                style={{ opacity: 0 }}
            >
                <span style={{ fontFamily: "var(--font-instrument-serif)" }}>
                    Building the companion that understands you.
                </span>
            </h2>

            {/* The Divine Image Container */}
            <div
                ref={imageContainerRef}
                className="absolute z-10 overflow-hidden rounded-2xl"
                style={{
                    width: '80vw',
                    height: '80vh',
                    maxWidth: '1200px',
                    maxHeight: '800px',
                    transformOrigin: 'center center',
                    transform: 'scale(0.1)',
                    opacity: 0,
                }}
            >
                <img
                    src="/divine-teacher.jpg"
                    alt="Divine Teacher"
                    className="w-full h-full object-cover"
                    style={{
                        maskImage: 'radial-gradient(circle at center, black 50%, transparent 90%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 90%)',
                    }}
                />
            </div>
        </section>
    );
}
