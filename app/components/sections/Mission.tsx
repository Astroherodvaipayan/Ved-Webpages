"use client";

import { motion } from "framer-motion";

export default function Mission() {
    return (
        <section id="mission" className="relative w-full py-40 px-6 max-w-7xl mx-auto overflow-hidden text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                <p className="eyebrow mb-8">Our Mission</p>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight mb-12">
                    To enable <br />
                    <span className="text-gradient">a billion geniuses</span>.
                </h2>

                <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-16">
                    We believe intelligence is evenly distributed, but opportunity is not.
                    Ved AI democratizes elite-level personalized education for everyone on Earth.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 240, 255, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary px-10 py-5 text-lg"
                >
                    Join the Revolution
                </motion.button>
            </motion.div>
        </section>
    );
}
