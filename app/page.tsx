"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "./components/sections/Hero";
import ProductShowcase from "./components/sections/ProductShowcase";
import ProblemStatement from "./components/sections/ProblemStatement";
import Architecture from "./components/sections/Architecture";
import FeatureShowcase from "./components/sections/FeatureShowcase";
import Moat from "./components/sections/Moat";
import Mission from "./components/sections/Mission";
import JoinRevolution from "./components/sections/JoinRevolution";
import FooterCTA from "./components/sections/FooterCTA";
import CinematicIntro from "./components/CinematicIntro";
import BackgroundController from "./components/ui/BackgroundController";
import GlobalBackground from "./components/ui/GlobalBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const [showIntro, setShowIntro] = useState(false);
    const heroPinnedRef = useRef<HTMLDivElement>(null);
    const heroClipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroPinnedRef.current || !heroClipRef.current) return;

        heroClipRef.current.style.setProperty("--hole-size", "0vw");

        const st = ScrollTrigger.create({
            trigger: heroPinnedRef.current,
            start: "top top",
            end: "+=800",
            pin: true,
            pinSpacing: false, // Prevents pushing the underlying content down
            scrub: true,
            animation: gsap.fromTo(
                heroClipRef.current,
                { "--hole-size": "0vw" },
                {
                    "--hole-size": "150vw",
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(heroClipRef.current, { pointerEvents: "none" });
                    },
                    onReverseComplete: () => {
                        gsap.set(heroClipRef.current, { pointerEvents: "auto" });
                    }
                }
            )
        });

        return () => st.kill();
    }, []);

    return (
        <main className="relative bg-black">
            {/* Dynamic Background Controller */}
            {!showIntro && <BackgroundController />}

            {showIntro && (
                <CinematicIntro
                    onComplete={() => {
                        setShowIntro(false);
                    }}
                />
            )}

            <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>

                <div className="relative w-full">
                    {/* Hero is absolutely positioned on top. The mask creates a growing hole revealing the normal flow below. */}
                    <div
                        ref={heroPinnedRef}
                        className="absolute top-0 left-0 w-full h-[100vh] z-30 pointer-events-none"
                    >
                        <div
                            ref={heroClipRef}
                            className="w-full h-full pointer-events-auto bg-[#FAFBFF]"
                            style={{
                                maskImage: "radial-gradient(circle at center, transparent var(--hole-size, 0vw), black var(--hole-size, 0vw), black 100%)",
                                WebkitMaskImage: "radial-gradient(circle at center, transparent var(--hole-size, 0vw), black var(--hole-size, 0vw), black 100%)"
                            }}
                        >
                            <Hero isActive={!showIntro} />
                        </div>
                    </div>

                    {/* Normal Document Flow Begins Here */}
                    {/* Because Hero is absolute, Mission starts at scroll Y = 0 naturally. */}
                    <div className="relative z-20 w-full bg-transparent">
                        <GlobalBackground />

                        <Mission />
                        <ProductShowcase />
                        <ProblemStatement />
                        {/* <FeatureShowcase /> */}
                        <Moat />
                        <JoinRevolution />
                        <FooterCTA />
                    </div>
                </div>
            </div>
        </main>
    );
}
