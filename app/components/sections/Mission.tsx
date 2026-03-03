"use client";

import TeacherScrollSequence from "../ui/TeacherScrollSequence";
import { motion } from "framer-motion";

const cloudImages = {
    cloud1: "https://framerusercontent.com/images/PUqLPHI41YgCP0yPAqH270KUaQ.png?lossless=1",
    cloud2: "https://framerusercontent.com/images/DfKhD1nnzWVqMFRKSErjEE4TNg.png?lossless=1",
};

export default function Mission() {
    return (
        <section id="mission" className="relative w-full text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px]" />
            </div>

            {/* Static Floating Clouds at the start of the sequence */}
            <div className="absolute top-0 left-0 w-full h-[60vh] z-40 pointer-events-none overflow-hidden -translate-y-[40%]">
                <motion.img
                    src={cloudImages.cloud1}
                    alt=""
                    className="absolute bottom-0 left-0 w-full h-auto object-cover object-bottom"
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ minHeight: '100%', opacity: 0.95 }}
                />
                <motion.img
                    src={cloudImages.cloud2}
                    alt=""
                    className="absolute bottom-0 w-[55%] h-auto object-cover object-bottom"
                    style={{ left: '-5%', minHeight: '100%', opacity: 0.8, transform: 'scaleX(-1)' }}
                    animate={{ x: [0, -15, 0], y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.img
                    src={cloudImages.cloud2}
                    alt=""
                    className="absolute bottom-0 w-[50%] h-auto object-cover object-bottom"
                    style={{ right: '-5%', minHeight: '100%', opacity: 0.75 }}
                    animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Scrollable Teacher Sequence - Video Effect */}
            <div className="relative w-full">
                <TeacherScrollSequence />
            </div>
        </section>
    );
}
