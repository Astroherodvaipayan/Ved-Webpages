"use client";

import { motion } from "framer-motion";

export default function FooterCTA() {
    return (
        <section className="footer-cta py-32 px-6 max-w-4xl mx-auto text-center">
            <div className="reveal in-view">
                <p className="eyebrow mb-6">READY?</p>
                <h3 className="text-4xl md:text-6xl font-bold mb-10 leading-tight">
                    Let’s choreograph your own astral bloom.
                </h3>
                <button data-cursor="pointer" className="btn primary w-full max-w-[400px]">
                    Book a timing window
                </button>
            </div>
        </section>
    );
}
