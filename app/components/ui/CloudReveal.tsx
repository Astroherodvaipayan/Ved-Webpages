"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Cloud images from localhosthq reference
const cloudImages = {
    cloud1: "https://framerusercontent.com/images/PUqLPHI41YgCP0yPAqH270KUaQ.png?lossless=1",
    cloud2: "https://framerusercontent.com/images/DfKhD1nnzWVqMFRKSErjEE4TNg.png?lossless=1",
};

export default function CloudReveal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cloudLayersRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cloudSection = document.getElementById("cloud-transition");
            if (!cloudSection) return;

            // Helper to create cloud animation timeline
            const createCloudTimeline = (layer: any, delayIndex: number, speedMultiplier: number, xDrift: number) => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: cloudSection,
                        start: "top 60%", // Start early to appear in gap
                        end: "bottom -20%", // End well after
                        scrub: 0.5 + delayIndex * 0.1,
                    }
                });

                // Initial set
                gsap.set(layer, {
                    y: window.innerHeight * 0.5 + 570, // Shift down 15cm total
                    opacity: 1, // Start opaque
                    x: 0
                });

                // Animation steps
                tl.to(layer, {
                    opacity: 1, // Stay opaque
                    y: window.innerHeight * 0.1 + 570, // Rise to visible (shifted down)
                    duration: 1,
                    ease: "none"
                })
                    .to(layer, {
                        y: (-window.innerHeight * 1.5 * speedMultiplier) + 570, // Continue rising high (shifted down)
                        x: xDrift,
                        opacity: 0, // Fade out at end as requested ("go away")
                        duration: 3, // Long rise duration
                        ease: "none"
                    });
            };

            // Layer 0 - Bottom cloud bank
            if (cloudLayersRef.current[0]) createCloudTimeline(cloudLayersRef.current[0], 0, 1.0, 0);

            // Layer 1 - Left clouds
            if (cloudLayersRef.current[1]) createCloudTimeline(cloudLayersRef.current[1], 1, 0.9, -150);

            // Layer 2 - Right clouds
            if (cloudLayersRef.current[2]) createCloudTimeline(cloudLayersRef.current[2], 2, 0.95, 150);

            // Layer 3 - Top wisps
            if (cloudLayersRef.current[3]) createCloudTimeline(cloudLayersRef.current[3], 3, 1.2, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-x-0 bottom-0 pointer-events-none overflow-visible"
            style={{ zIndex: 40, height: '100vh' }}
        >
            {/* Layer 0 - Bottom cloud bank */}
            <div
                ref={(el) => { cloudLayersRef.current[0] = el; }}
                className="absolute bottom-0 left-0 right-0"
                style={{ height: '55vh' }}
            >
                <motion.img
                    src={cloudImages.cloud1}
                    alt=""
                    className="absolute bottom-0 left-0 w-full h-auto object-cover object-bottom"
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ minHeight: '100%', opacity: 0.95 }}
                />
            </div>

            {/* Layer 1 - Left side clouds */}
            <div
                ref={(el) => { cloudLayersRef.current[1] = el; }}
                className="absolute bottom-0"
                style={{ height: '60vh', width: '55%', left: '-5%' }}
            >
                <motion.img
                    src={cloudImages.cloud2}
                    alt=""
                    className="absolute bottom-0 left-0 w-full h-auto object-cover object-bottom"
                    animate={{ x: [0, -15, 0], y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ minHeight: '100%', opacity: 0.8, transform: 'scaleX(-1)' }}
                />
            </div>

            {/* Layer 2 - Right side clouds */}
            <div
                ref={(el) => { cloudLayersRef.current[2] = el; }}
                className="absolute bottom-0"
                style={{ height: '55vh', width: '50%', right: '-5%' }}
            >
                <motion.img
                    src={cloudImages.cloud2}
                    alt=""
                    className="absolute bottom-0 right-0 w-full h-auto object-cover object-bottom"
                    animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ minHeight: '100%', opacity: 0.75 }}
                />
            </div>

            {/* Layer 3 - Top wisps */}
            <div
                ref={(el) => { cloudLayersRef.current[3] = el; }}
                className="absolute bottom-0 left-0 right-0"
                style={{ height: '75vh' }}
            >
                <motion.img
                    src={cloudImages.cloud1}
                    alt=""
                    className="absolute bottom-[-15%] left-[5%] w-[90%] h-auto object-cover"
                    animate={{ x: [8, -8, 8], scale: [1, 1.02, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ opacity: 0.5, transform: 'scale(1.15)', filter: 'blur(2px)' }}
                />
            </div>
        </div>
    );
}
