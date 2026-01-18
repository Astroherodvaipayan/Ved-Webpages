"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const storyPoints = [
    {
        story: "A classroom where the teacher must move on, even if a student hasn’t fully understood.",
        visual: "🏫",
    },
    {
        story: "No mentor or teacher at home to help fill the gaps left in class.",
        visual: "🏠",
    },
    {
        story: "The only option becomes spending hours and thousands on sub-standard tutors limited by geography.",
        visual: "💸",
    },
    {
        story: "Ved AI is giving 10,000 students a personal tutor at home.",
        visual: "🌟",
    },
    {
        story: "Personal tutoring improves learning outcomes by 98%. That’s how we enable a billion geniuses.",
        visual: "🌎",
    },
];

export default function MissionPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <main ref={containerRef} className="relative min-h-[500vh] bg-[#050505]">
            {/* Central Thread */}
            <div className="fixed left-1/2 top-0 -translate-x-1/2 w-px h-full bg-white/5 pointer-events-none">
                <motion.div
                    className="w-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-tertiary)] to-[var(--accent-secondary)]"
                    style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                />
            </div>

            {/* Story Sections */}
            <div className="relative">
                {storyPoints.map((point, i) => (
                    <section
                        key={i}
                        className="relative h-screen flex items-center justify-center px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: "-20%" }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-3xl text-center z-10"
                        >
                            <div className="text-6xl mb-12 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                {point.visual}
                            </div>
                            <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-white/80">
                                {point.story}
                            </h2>

                            {/* Glowing Node on Thread */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white blur-sm opacity-20 pointer-events-none"
                                whileInView={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </section>
                ))}
            </div>

            {/* Final Mission Statement */}
            <section className="relative h-screen flex flex-col items-center justify-center px-6 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_60%)]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <p className="eyebrow mb-12">The Mission</p>
                    <h3 className="text-[clamp(3rem,10vw,8rem)] font-extrabold leading-[0.9] tracking-tighter uppercase mb-6">
                        Enabling a<br />
                        <span className="text-gradient">Billion</span><br />
                        Geniuses.
                    </h3>
                    <p className="text-white/40 tracking-[0.4em] uppercase text-sm mt-8">Ved Artificial Intelligence</p>
                </motion.div>
            </section>
        </main>
    );
}
