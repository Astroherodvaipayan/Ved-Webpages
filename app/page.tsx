"use client";

import { useState, useEffect } from "react";

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

export default function Home() {
    const [showIntro, setShowIntro] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if user has seen intro before - only show on first visit
        if (typeof window !== "undefined" && localStorage.getItem("hasSeenIntro") !== "true") {
            setShowIntro(true);
        }
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <main className="relative">
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
                    {/* Hero - wrapped in higher z-index to stay above backgrounds */}
                    <div className="relative z-30">
                        <Hero />
                    </div>

                    {/* Normal Document Flow Continues Here - padding-top for overlapping clouds */}
                    <div className="relative z-10 w-full bg-transparent pt-32">
                        <GlobalBackground />
                        <Mission />
                        <ProductShowcase />
                        <ProblemStatement />
                        <FeatureShowcase />
                        <Moat />
                        <JoinRevolution />
                        <FooterCTA />
                    </div>
                </div>
            </div>
        </main>
    );
}
