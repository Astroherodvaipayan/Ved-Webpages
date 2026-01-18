"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const schools = [
    {
        name: "Greenwood High",
        logo: "GH",
        color: "#00f0ff",
        stat: "98% Pass Rate",
        desc: "Integrated Ved AI into their core curriculum for 10th grade physics."
    },
    {
        name: "Oakridge International",
        logo: "OI",
        color: "#8b5cf6",
        stat: "2x Retention",
        desc: "Used Ved AI planner agents to personalize homework schedules."
    },
    {
        name: "Valley School",
        logo: "VS",
        color: "#ff00aa",
        stat: "Top 1% Rank",
        desc: "Achieved state-topping results using our Evaluation Agents."
    }
];

export default function Schools() {
    return (
        <section id="schools" className="relative w-full py-40 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <p className="eyebrow mb-6">Partner Schools</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Powering the <span className="text-gradient">next generation</span> of institutions.
                </h2>
            </motion.div>

            {/* School Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {schools.map((school, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -10 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        className="p-8 rounded-3xl bg-bg-card border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-white/5 border border-white/10 mb-8"
                            style={{ color: school.color, borderColor: `${school.color}40` }}
                        >
                            {school.logo}
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{school.name}</h3>
                        <p className="text-white/60 mb-8 h-20">{school.desc}</p>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Outcome</p>
                            <p className="text-xl font-mono" style={{ color: school.color }}>{school.stat}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
