"use client";

import { motion } from "framer-motion";

const panels = [
    {
        label: "01",
        title: "Interstellar Splits",
        description: "Diagonal wipes, masked reveals, and velocity curves mirroring the Workoholics experience—tailored for the lotus mythos.",
        tags: ["GSAP", "Scroll Sync", "Realtime"],
        accent: false,
    },
    {
        label: "02",
        title: "Card Bloom Ballet",
        description: "Cards pop, fold, and hover with depth-sensitive parallax to keep every case study tactile on desktop and touch-friendly on mobile.",
        tags: ["Depth", "Hover Z", "Touch Safe"],
        accent: true,
    },
    {
        label: "03",
        title: "Lotus Responsive Core",
        description: "Layouts flex with CSS clamp, fluid grids, and viewport-based typography so every motion cue breathes on any screen.",
        tags: ["Clamp()", "Grid", "Adaptive"],
        accent: false,
    },
];

export default function TransitionPanels() {
    return (
        <section className="transition-panels grid grid-cols-1 md:grid-cols-3 gap-6 py-20 px-6 max-w-7xl mx-auto">
            {panels.map((panel, i) => (
                <motion.article
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className={`panel ${panel.accent ? "panel--accent" : ""}`}
                >
                    <div className="panel__label">{panel.label}</div>
                    <h2 className="text-2xl font-bold mb-3">{panel.title}</h2>
                    <p className="text-white/60 mb-6">{panel.description}</p>
                    <div className="panel__tags flex flex-wrap gap-2">
                        {panel.tags.map((tag) => (
                            <span key={tag} className="text-xs px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.article>
            ))}
        </section>
    );
}
