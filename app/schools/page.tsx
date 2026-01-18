"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const points = [
    {
        title: "Zero cost",
        description: "No budget allocation needed. Schools get Ved AI at absolutely no cost.",
        icon: "💰"
    },
    {
        title: "Revenue share",
        description: "Partner schools benefit directly from the ecosystem growth.",
        icon: "📈"
    },
    {
        title: "Free LMS",
        description: "Complete learning management system for teachers and admins.",
        icon: "📊"
    }
];

export default function SchoolsPage() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
            {/* Hero */}
            <section className="mb-32">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="eyebrow mb-8"
                >
                    Institutional Partnership
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-12"
                >
                    We deeply integrate with schools to give students a{" "}
                    <span className="text-gradient">curriculum-aligned AI tutor</span> at home.
                </motion.h1>

                {/* Logo Ticker Placeholder */}
                <div className="w-full py-12 border-y border-white/5 overflow-hidden">
                    <div className="flex gap-20 animate-marquee text-white/20 whitespace-nowrap">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <span key={i} className="text-2xl font-bold tracking-tighter">PARTNER LOGO {i}</span>
                        ))}
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <span key={i} className="text-2xl font-bold tracking-tighter">PARTNER LOGO {i}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="mb-32">
                <h2 className="text-3xl font-bold mb-16">Schools get Ved AI with:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {points.map((point, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="panel"
                        >
                            <div className="text-3xl mb-6">{point.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{point.title}</h3>
                            <p className="text-white/50 leading-relaxed">{point.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Deep Ingestion */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Teacher-level ingestion</h2>
                    <p className="text-xl text-white/60 leading-relaxed">
                        Ved ingests notes and marking schemes for each teacher, enabling it to teach{" "}
                        <span className="text-white">better than any tuition teacher</span>.
                    </p>
                </div>
                <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="text-4xl mb-4">📄 → 🧠 → 🎓</div>
                        <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Semantic Processing Flow</p>
                    </div>
                </div>
            </section>

            {/* Monetization */}
            <section className="panel md:p-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Student monetization</h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
                    Ved charges students who use the product directly to unlock usage beyond limited chats.
                </p>
                <button className="btn primary">Establish Integration</button>
            </section>

            <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </main>
    );
}
