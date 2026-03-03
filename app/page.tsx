"use client";

import { useState } from "react";
import Hero from "./components/sections/Hero";

import ProductShowcase from "./components/sections/ProductShowcase";
import ProblemStatement from "./components/sections/ProblemStatement";
import Architecture from "./components/sections/Architecture";
import FeatureShowcase from "./components/sections/FeatureShowcase";
import Moat from "./components/sections/Moat";
import Roadmap from "./components/sections/Roadmap";
import Mission from "./components/sections/Mission";
import JoinRevolution from "./components/sections/JoinRevolution";
import FooterCTA from "./components/sections/FooterCTA";
import CinematicIntro from "./components/CinematicIntro";
import BackgroundController from "./components/ui/BackgroundController";
import CloudReveal from "./components/ui/CloudReveal";

export default function Home() {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <main className="relative">
            {/* Dynamic Background Controller */}
            {!showIntro && <BackgroundController />}

            {/* Removed CloudReveal */}



            {showIntro && (
                <CinematicIntro
                    onComplete={() => {
                        setShowIntro(false);
                    }}
                />
            )}
            {/* Main Content Sections - Continuous Scroll */}
            <div className={`transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
                <Hero isActive={!showIntro} />

                {/* Seamless transition gradient between Hero and Teacher sequence */}
                <div className="relative w-full z-[35] pointer-events-none" style={{ height: 0 }}>
                    <div
                        className="absolute top-0 left-0 w-full h-[30vh]"
                        style={{ background: 'linear-gradient(to bottom, #E8EEFF 0%, transparent 100%)' }}
                    />
                </div>

                <Mission />

                <ProductShowcase />
                <ProblemStatement />
                <Architecture />
                <FeatureShowcase />
                <Moat />


                <JoinRevolution />
                <FooterCTA />
            </div>
        </main>
    );
}
