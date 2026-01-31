"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";

const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#mission", label: "Mission" },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    const lenis = useLenis(({ scroll }: { scroll: number }) => {
        // Scroll tracking if needed
    });

    // Handle Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Simple Scroll Spy
            const hero = document.getElementById("hero");
            const mission = document.getElementById("mission");

            const scrollPos = window.scrollY + 300; // Offset for better detection

            if (mission && scrollPos >= mission.offsetTop) setActiveSection("mission");
            else setActiveSection("hero");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
        e.preventDefault();
        const element = document.querySelector(id) as HTMLElement;
        if (element && lenis) {
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
            setIsMobileMenuOpen(false);
        } else if (element) {
            // Fallback if Lenis isn't ready
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Main Navigation */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
            >
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
                    {/* Logo (Empty link wrapper, logo is in Header.tsx which overlays this) */}
                    <Link
                        href="#hero"
                        onClick={(e) => scrollToSection(e, "#hero")}
                        onKeyDown={(e) => e.key === 'Enter' && scrollToSection(e, "#hero")}
                        className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan rounded w-12 h-12"
                    >
                        {/* Logo placeholder if needed */}
                    </Link>

                    {/* Desktop Nav Links - CENTERED */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                onKeyDown={(e) => e.key === 'Enter' && scrollToSection(e, link.href)}
                                tabIndex={0}
                                className={`relative text-sm uppercase tracking-widest transition-colors duration-300 cursor-pointer focus:outline-none hover:text-[var(--text-primary)] ${activeSection === link.href.substring(1)
                                    ? "text-[var(--accent-cyan)]"
                                    : "text-[var(--text-muted)]"
                                    }`}
                            >
                                {link.label}
                                {activeSection === link.href.substring(1) && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--accent-cyan)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer focus:outline-none"
                    >
                        <motion.span
                            animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
                            className="w-6 h-0.5 bg-white block"
                        />
                        <motion.span
                            animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                            className="w-6 h-0.5 bg-white block"
                        />
                        <motion.span
                            animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                            className="w-6 h-0.5 bg-white block"
                        />
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[99] bg-[var(--bg-primary)]/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className={`text-3xl font-medium cursor-pointer ${activeSection === link.href.substring(1) ? "text-gradient" : "text-[var(--text-secondary)]"
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                </motion.div>
                            ))}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="mt-8 px-10 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] text-black cursor-pointer"
                            >
                                Get Access
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
