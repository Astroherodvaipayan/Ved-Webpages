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
    const isWaitlistPage = pathname === "/waitlist" || pathname === "/waitlist_refactored";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [immersiveNavReveal, setImmersiveNavReveal] = useState(0);

    const lenis = useLenis();

    // Handle Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            // Simple Scroll Spy
            const mission = document.getElementById("join-revolution");
            const hero = document.getElementById("hero");
            const scrollPos = window.scrollY + 300;

            if (mission && scrollPos >= mission.offsetTop) setActiveSection("join-revolution");
            else setActiveSection("hero");

            if (hero) {
                const rect = hero.getBoundingClientRect();
                const scrollDistance = Math.max(1, hero.offsetHeight - window.innerHeight);
                const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
                const isInsideImmersiveHero = rect.top <= 0 && rect.bottom >= window.innerHeight * 0.35;
                const reveal = isInsideImmersiveHero
                    ? Math.max(0, Math.min(1, (progress - 0.48) / 0.22))
                    : 1;

                setImmersiveNavReveal(reveal);
            } else {
                setImmersiveNavReveal(1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
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

    const navOnLight = immersiveNavReveal > 0.35;
    const brandTextColor = navOnLight ? "#1E3A8A" : "#ffffff";
    const linkColor = navOnLight ? "#1E3A8A" : "#ffffff";
    const linkHoverColor = navOnLight ? "#0F1F4D" : "rgba(255,255,255,0.8)";

    return (
        <>
            {/* ═══ Floating Pill Navbar ═══ */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-[100] flex justify-center"
                style={{ padding: "18px 16px 0", pointerEvents: "none" }}
            >
                <div
                    className="mx-auto w-full max-w-[1220px]"
                    style={{
                        opacity: immersiveNavReveal,
                        pointerEvents: immersiveNavReveal > 0.85 ? "auto" : "none",
                        transform: `translateY(${(1 - immersiveNavReveal) * -18}px)`,
                        transition: "opacity 220ms ease, transform 220ms ease",
                    }}
                >
                    {/* ── Desktop: 3-Column Grid ── */}
                    <div className="hidden md:flex items-center justify-between gap-3">
                        {/* Logo - left */}
                        <Link
                            href="#hero"
                            onClick={(e) => scrollToSection(e, "#hero")}
                            onKeyDown={(e) => e.key === "Enter" && scrollToSection(e, "#hero")}
                            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan rounded flex-shrink-0"
                            style={{ textDecoration: "none" }}
                        >
                            <Image
                                src="/ved-lotus-logo.png"
                                alt="Ved AI Labs"
                                width={36}
                                height={36}
                                className="drop-shadow-lg"
                            />
                            <span
                                style={{
                                    fontFamily: "var(--font-instrument-serif)",
                                    fontSize: "1.45rem",
                                    fontWeight: 400,
                                    color: brandTextColor,
                                    letterSpacing: "0.025em",
                                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                    lineHeight: 1,
                                }}
                            >
                                Ved
                            </span>
                        </Link>

                        {/* Center: GlassSurface navbar with nav links */}
                        <GlassSurface
                            width={320}
                            height={50}
                        >
                            <div className="flex items-center justify-center gap-5 px-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        onKeyDown={(e) => e.key === "Enter" && scrollToSection(e, link.href)}
                                        tabIndex={0}
                                        style={{
                                            position: "relative",
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            textDecoration: "none",
                                            color: linkColor,
                                            transition: "color 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
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
                        <div className="flex justify-end flex-shrink-0">
                            <Link href="/waitlist" className="inline-block">
                                <GradientButton
                                    label="Join Beta"
                                    style={{ padding: "10px 26px", fontSize: "1rem" }}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* ── Mobile: Full-width GlassSurface bar ── */}
                    <div className="md:hidden">
                        <GlassSurface
                            width={350}
                            height={52}
                            className="md:hidden"
                            style={{ width: '100%' }}
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
                                        src="/ved-lotus-logo.png"
                                        alt="Ved AI Labs"
                                        width={28}
                                        height={28}
                                        className="drop-shadow-lg"
                                    />
                                    <span
                                        style={{
                                            fontFamily: "var(--font-instrument-serif)",
                                            fontSize: "1.2rem",
                                            fontWeight: 400,
                                            color: brandTextColor,
                                            letterSpacing: "0.025em",
                                            lineHeight: 1,
                                        }}
                                    >
                                        Ved
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
                                        className="w-6 h-0.5 block"
                                        style={{ backgroundColor: brandTextColor }}
                                    />
                                    <motion.span
                                        animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-6 h-0.5 block"
                                        style={{ backgroundColor: brandTextColor }}
                                    />
                                    <motion.span
                                        animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-6 h-0.5 block"
                                        style={{ backgroundColor: brandTextColor }}
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
