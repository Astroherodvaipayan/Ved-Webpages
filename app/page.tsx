"use client";

import { useState } from "react";

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
                    <Hero />

                    {/* Content flows after Hero — Mission scrolls up behind pinned Hero */}
                    <div className="relative w-full bg-transparent">
                        <GlobalBackground />
                        <ProductShowcase />
                        <ProblemStatement />
                        <Mission />
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
