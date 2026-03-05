"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "./GradientButton";
import { useLenis } from "@studio-freight/react-lenis";
import GlassSurface from "../../../components/GlassSurface";

const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#join-revolution", label: "Mission" },
];

export default function Navigation() {
    const pathname = usePathname();
    const isWaitlistPage = pathname === "/waitlist";
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
            const mission = document.getElementById("join-revolution");
            const scrollPos = window.scrollY + 300;

            if (mission && scrollPos >= mission.offsetTop) setActiveSection("join-revolution");
            else setActiveSection("hero");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileMenuOpen) setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isMobileMenuOpen]);

    const scrollToSection = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
        e.preventDefault();
        const element = document.querySelector(id) as HTMLElement;
        if (element && lenis) {
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
            setIsMobileMenuOpen(false);
        } else if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    if (isWaitlistPage) {
        return null;
    }

    return (
        <>
            {/* ═══ Floating Pill Navbar ═══ */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-[100] flex justify-center"
                style={{ padding: "18px 20px 0", pointerEvents: "none" }}
            >
                <div
                    className="mx-auto w-full max-w-[1220px]"
                    style={{ pointerEvents: "auto" }}
                >
                    {/* ── Desktop: 3-Column Grid ── */}
                    <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                        {/* Logo - left */}
                        <Link
                            href="#hero"
                            onClick={(e) => scrollToSection(e, "#hero")}
                            onKeyDown={(e) => e.key === "Enter" && scrollToSection(e, "#hero")}
                            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan rounded"
                            style={{ textDecoration: "none" }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Ved AI Labs"
                                width={36}
                                height={36}
                                className="drop-shadow-lg"
                            />
                            <span
                                style={{
                                    fontSize: "1.05rem",
                                    fontWeight: 800,
                                    color: "#ffffff",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                }}
                            >
                                Ved AI
                            </span>
                        </Link>

                        {/* Center: GlassSurface navbar with nav links */}
                        <GlassSurface
                            width={380}
                            height={62}
                        >
                            <div className="flex items-center justify-center gap-8 px-6">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        onKeyDown={(e) => e.key === "Enter" && scrollToSection(e, link.href)}
                                        tabIndex={0}
                                        style={{
                                            position: "relative",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            textDecoration: "none",
                                            color: activeSection === link.href.replace('#', '')
                                                ? "#ffffff"
                                                : "rgba(255,255,255,0.55)",
                                            transition: "color 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                                        onMouseLeave={(e) =>
                                        (e.currentTarget.style.color =
                                            activeSection === link.href.replace('#', '')
                                                ? "#ffffff"
                                                : "rgba(255,255,255,0.55)")
                                        }
                                    >
                                        {link.label}
                                        {activeSection === link.href.replace('#', '') && (
                                            <motion.div
                                                layoutId="activeNav"
                                                style={{
                                                    position: "absolute",
                                                    bottom: "-6px",
                                                    left: 0,
                                                    right: 0,
                                                    height: "2px",
                                                    background: "linear-gradient(90deg, rgba(212,175,55,0.8), rgba(30,58,138,0.8))",
                                                    borderRadius: "1px",
                                                    boxShadow: "0 0 8px rgba(212,175,55,0.3)",
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </GlassSurface>

                        {/* Right: Join Beta - using GradientButton */}
                        <div className="flex justify-end">
                            <Link href="/waitlist" className="inline-block">
                                <GradientButton
                                    label="Join Beta"
                                    style={{ padding: "10px 24px", fontSize: "0.85rem" }}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* ── Mobile: Full-width GlassSurface bar ── */}
                    <div className="md:hidden">
                        <GlassSurface
                            width="100%"
                            height={58}
                            className="md:hidden"
                        >
                            <div
                                className="flex items-center justify-between w-full px-4"
                                style={{ height: "100%" }}
                            >
                                {/* Mobile Logo */}
                                <Link
                                    href="#hero"
                                    onClick={(e) => scrollToSection(e, "#hero")}
                                    className="flex items-center gap-2"
                                    style={{ textDecoration: "none" }}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="Ved AI Labs"
                                        width={28}
                                        height={28}
                                        className="drop-shadow-lg"
                                    />
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                            fontWeight: 800,
                                            color: "#ffffff",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Ved AI
                                    </span>
                                </Link>

                                {/* Mobile Hamburger */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="flex flex-col gap-1.5 p-2 cursor-pointer focus:outline-none"
                                    aria-label="Toggle menu"
                                    aria-expanded={isMobileMenuOpen}
                                >
                                    <motion.span
                                        animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-6 h-0.5 bg-white block"
                                    />
                                    <motion.span
                                        animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-6 h-0.5 bg-white block"
                                    />
                                    <motion.span
                                        animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-6 h-0.5 bg-white block"
                                    />
                                </button>
                            </div>
                        </GlassSurface>
                    </div>
                </div>
            </motion.header>

            {/* ═══ Mobile Slide-Down Menu ═══ */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed left-0 right-0 z-[99] md:hidden"
                        style={{
                            top: "80px",
                            margin: "0 20px",
                            background: "rgba(10, 15, 46, 0.92)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            borderRadius: "16px",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, delay: i * 0.08 }}
                                    style={{
                                        display: "block",
                                        padding: "16px 24px",
                                        color:
                                            activeSection === link.href.replace('#', '')
                                                ? "#ffffff"
                                                : "rgba(255,255,255,0.6)",
                                        textDecoration: "none",
                                        fontSize: "1rem",
                                        fontWeight: 500,
                                        letterSpacing: "0.04em",
                                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                                        transition: "color 0.2s, background 0.2s",
                                        cursor: "pointer",
                                    }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            {/* Mobile "Join Beta" */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "12px 16px 16px",
                                }}
                            >
                                <Link href="/waitlist" className="w-full">
                                    <GradientButton
                                        label="Join Beta"
                                        style={{ padding: "14px 24px", width: "100%" }}
                                    />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
