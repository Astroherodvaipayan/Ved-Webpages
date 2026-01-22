"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[101]">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex items-center gap-4"
                >
                    <Image
                        src="/logo.png"
                        alt="Ved AI Labs"
                        width={48}
                        height={48}
                        className="drop-shadow-lg"
                    />
                    <span className="text-xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-lg">
                        Ved AI
                    </span>
                </motion.div>
            </div>
        </header>
    );
}
