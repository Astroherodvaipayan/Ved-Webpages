"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    const options = {
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical" as const, // Fix type error
        gestureOrientation: "vertical" as const, // Fix type error
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
        <ReactLenis root ref={lenisRef} autoRaf={false} options={options}>
            {children as any}
        </ReactLenis>
    );
}
