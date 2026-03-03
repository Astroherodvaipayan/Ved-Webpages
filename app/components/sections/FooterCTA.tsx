"use client";

import { motion } from "framer-motion";

export default function FooterCTA() {
    return (
        <footer id="footer-cta" className="w-full py-16 px-6 text-center border-t border-accent-primary/10">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <p className="text-sm text-[#6B7AA1] tracking-widest uppercase">
                        © 2025 Ved AI Labs. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
