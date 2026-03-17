// app/components/sections/FooterCTA.tsx

"use client";

import { motion } from "framer-motion";

export default function FooterCTA() {
    return (
        <footer id="footer-cta" className="relative w-full bg-[#030614] pt-24 pb-0 px-6 sm:px-12 md:px-20 overflow-hidden min-h-[50vh] md:min-h-[600px] flex flex-col">
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 flex-1">
                {/* Left Column */}
                <div className="flex flex-col space-y-4 text-sm text-[#8B9BB4]">
                    <div>
                        <span className="text-white font-bold text-lg tracking-wide">Ved-AI</span>
                        <p className="text-xs text-[#5D6B82] mt-1">(Democratizing personalized education)</p>
                    </div>
                    <a href="mailto:contact@ved.ai" className="hover:text-white transition-colors">
                        contact@ved.ai
                    </a>
                    <p className="pt-2">© Ved AI 2026</p>
                </div>

                {/* Right Column / Links */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-[#8B9BB4] lg:justify-end">
                    <a href="#" className="hover:text-white transition-colors">FAQs</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">AI Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                </div>
            </div>

            {/* VED-AI Huge Text */}
            <div className="relative z-0 mt-20 md:mt-auto flex justify-center w-full pointer-events-none select-none overflow-hidden">
                <span
                    className="font-black text-center tracking-tighter whitespace-nowrap"
                    style={{
                        fontSize: "clamp(100px, 24vw, 500px)",
                        lineHeight: 0.75,
                        background: "linear-gradient(180deg, rgba(90, 138, 232, 0.4) 0%, rgba(3, 6, 20, 0) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transform: "translateY(12%)",
                    }}
                >
                    VED-AI
                </span>
            </div>
        </footer>
    );
}
