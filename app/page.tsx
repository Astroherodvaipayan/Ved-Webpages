"use client";

import { useState } from "react";
import Hero from "./components/sections/Hero";
import ProblemStatement from "./components/sections/ProblemStatement";
import Architecture from "./components/sections/Architecture";
import Moat from "./components/sections/Moat";
import Traction from "./components/sections/Traction";
import Schools from "./components/sections/Schools";
import Mission from "./components/sections/Mission";
import CinematicIntro from "./components/CinematicIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="relative">
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
        <ProblemStatement />
        <Architecture />
        <Moat />
        <Traction />
        <Schools />
        <Mission />
        <div className="h-40" />
      </div>
    </main>
  );
}
