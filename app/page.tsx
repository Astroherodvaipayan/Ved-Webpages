"use client";

import { useState } from "react";

import Hero from "./components/sections/Hero";
import EducationShift from "./components/sections/EducationShift";
import RhythmCards from "./components/sections/RhythmCards";
import ProblemStatement from "./components/sections/ProblemStatement";
import FeatureShowcase from "./components/sections/FeatureShowcase";
import Moat from "./components/sections/Moat";
import FutureExperience from "./components/sections/FutureExperience";
import BillionGeniuses from "./components/sections/BillionGeniuses";
import Mission from "./components/sections/Mission";
import TogetherLeap from "./components/sections/TogetherLeap";
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

                    {/* Content flows after the hero morph completes */}
                    <div className="relative w-full bg-transparent">
                        <GlobalBackground />
                        <EducationShift />
                        <RhythmCards />
                        <ProblemStatement />
                        <Mission />
                        <TogetherLeap />
                        <FeatureShowcase />
                        <Moat />
                        <FutureExperience />
                        <BillionGeniuses />
                        <JoinRevolution />
                        <FooterCTA />
                    </div>
                </div>
            </div>
        </main>
    );
}
