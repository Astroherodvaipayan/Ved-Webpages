"use client";

import { motion } from "framer-motion";

const metricsList = [
    {
        eyebrow: "LAUNCH CADENCE",
        value: "48h",
        description: "to produce a tactile prototype once we lock your motif.",
    },
    {
        eyebrow: "DEVICE COVERAGE",
        value: "14",
        description: "breakpoints rigorously tuned so every fold stays intentional.",
    },
    {
        eyebrow: "INTERACTION SCORE",
        value: "97%",
        description: "of testers reported “I can feel the brand emerging” during QA.",
    },
];

export default function Metrics() {
    return (
        <section className="metrics reveal in-view py-28 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-white/10">
            {metricsList.map((m, i) => (
                <div key={i} className="text-center">
                    <p className="eyebrow text-xs mb-4">{m.eyebrow}</p>
                    <h2 className="text-7xl font-extrabold text-gradient">{m.value}</h2>
                    <p className="text-white/40 text-sm max-w-[25ch] mx-auto">{m.description}</p>
                </div>
            ))}
        </section>
    );
}
