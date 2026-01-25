"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            const missionSection = document.getElementById("mission");
            const heroSection = document.getElementById("hero");

            if (missionSection && heroSection) {
                // If we are past the hero section significantly, switch to mission
                if (window.scrollY > window.innerHeight * 0.5) {
                    setActiveTab("mission");
                } else {
                    setActiveTab("home");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const elementId = id === "home" ? "hero" : "mission";
        const el = document.getElementById(elementId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setActiveTab(id);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[101] max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative bg-transparent">
            {/* Logo */}
            <a
                className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan rounded h-12"
                onClick={() => scrollTo("home")}
            >
                <Image
                    src="/logo.png"
                    alt="Ved AI Labs"
                    width={48}
                    height={48}
                    className="drop-shadow-lg"
                />
                <span className="text-xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-lg ml-2">
                    Ved AI
                </span>
            </a>

            {/* Centered Navigation */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <a
                    onClick={() => scrollTo("home")}
                    tabIndex={0}
                    className={`relative text-sm uppercase tracking-widest transition-colors duration-300 cursor-pointer focus:outline-none hover:text-white ${activeTab === "home" ? "text-accent-primary" : "text-white/60"}`}
                >
                    Home
                    {activeTab === "home" && (
                        <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-primary"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </a>
                <a
                    onClick={() => scrollTo("mission")}
                    tabIndex={0}
                    className={`relative text-sm uppercase tracking-widest transition-colors duration-300 cursor-pointer focus:outline-none hover:text-white ${activeTab === "mission" ? "text-accent-primary" : "text-white/60"}`}
                >
                    Mission
                    {activeTab === "mission" && (
                        <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-primary"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </a>
            </div>

            {/* Mobile Menu Button (hidden for now or implemented) */}
            <button className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer focus:outline-none">
                <span className="w-6 h-0.5 bg-white block"></span>
                <span className="w-6 h-0.5 bg-white block"></span>
                <span className="w-6 h-0.5 bg-white block"></span>
            </button>
        </nav>
    );
}
