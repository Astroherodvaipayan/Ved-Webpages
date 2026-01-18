"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const cases = [
    {
        media: "Quantum Bloom",
        title: "Serenity Protocol",
        description: "Reactive lotus petals sync with stock market sentiment in under 600ms.",
        meta: ["Fintech", "Realtime"],
    },
    {
        media: "Pulse Nebula",
        title: "Halo Audit Labs",
        description: "3D-unfurled petals guide enterprise clients through an AI compliance funnel.",
        meta: ["B2B SaaS", "GSAP"],
    },
    {
        media: "Stellar Drift",
        title: "Ikigai Search",
        description: "Voice-triggered constellations collapse into a lotus glyph that launches query paths.",
        meta: ["Voice", "3D"],
    },
];

function CaseCard({ c, i }: { c: any; i: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || window.matchMedia("(pointer: coarse)").matches) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        cardRef.current.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = "";
    };

    return (
        <motion.article
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="case-card"
        >
            <div className="case-card__media">
                <span>{c.media}</span>
            </div>
            <div className="case-card__body">
                <h4 className="text-xl font-bold">{c.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{c.description}</p>
                <div className="case-card__meta py-2">
                    {c.meta.map((m: string) => (
                        <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-white/40 border border-white/5">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}

export default function CaseGrid() {
    return (
        <section className="case-grid py-20 px-6 max-w-7xl mx-auto flex flex-col gap-10">
            <header className="reveal in-view">
                <p className="eyebrow">RECENT ROLLOUTS</p>
                <h3 className="text-3xl md:text-5xl font-bold">Cards that feel alive, even when paused.</h3>
            </header>
            <div className="case-grid__items grid grid-cols-1 md:grid-cols-3 gap-6">
                {cases.map((c, i) => (
                    <CaseCard key={i} c={c} i={i} />
                ))}
            </div>
        </section>
    );
}
