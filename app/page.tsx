"use client";

import { useState } from "react";
import Header from "./components/sections/Header";
import Hero from "./components/sections/Hero";
import CloudSection from "./components/sections/CloudSection";

import ProductShowcase from "./components/sections/ProductShowcase";
import ProblemStatement from "./components/sections/ProblemStatement";
import Architecture from "./components/sections/Architecture";
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

            {/* Cloud Reveal Effect - Rising clouds */}
            {!showIntro && <CloudReveal />}

            {/* Header with Logo - Always visible */}
            {!showIntro && <Header />}

            {/* Intro Animation Layer */}
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
                <CloudSection />
                <Mission />

                <ProductShowcase />
                <ProblemStatement />
                <Architecture />
                <Moat />
                <Roadmap />


                <JoinRevolution />
                <FooterCTA />
            </div>
        </main>
    );
}
