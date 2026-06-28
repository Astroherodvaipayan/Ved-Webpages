"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const RHYTHMS = [
    {
        role: "Child",
        tag: "Student",
        line: "Learning comes alive.",
        image: "/images/rhythm-child-study-cutout.png",
        width: 879,
        height: 1234,
    },
    {
        role: "Teacher",
        tag: "Teacher",
        line: "Craft carries further.",
        image: "/images/rhythm-teacher-cutout.png",
        width: 561,
        height: 1244,
    },
    {
        role: "Institution",
        tag: "Institution",
        line: "Purpose finds rhythm.",
        image: "/images/rhythm-institution-cutout.png",
        width: 1254,
        height: 1008,
    },
    {
        role: "Parent",
        tag: "Parent",
        line: "Belief becomes steady.",
        image: "/images/rhythm-parent-cutout.png",
        width: 825,
        height: 1249,
    },
];

const cardPaddingClass: Record<string, string> = {
    Child: "pr-[40%] sm:pr-[41%] xl:pr-[38%]",
    Teacher: "pr-[34%] sm:pr-[35%] xl:pr-[34%]",
    Institution: "pr-[54%] sm:pr-[56%] xl:pr-[54%]",
    Parent: "pr-[42%] sm:pr-[44%] xl:pr-[42%]",
};

const imageWrapClass: Record<string, string> = {
    Child: "bottom-2 right-4 h-[66%] w-[34%] max-w-[9.25rem] sm:right-5 sm:h-[70%] sm:w-[34%] xl:right-6 xl:h-[68%]",
    Teacher: "bottom-3 right-4 h-[76%] w-[30%] max-w-[7rem] sm:right-5 sm:h-[80%] sm:w-[30%] xl:right-6 xl:h-[78%]",
    Institution: "bottom-2 right-3 h-[78%] w-[60%] max-w-[22rem] sm:right-4 sm:h-[80%] sm:w-[60%] xl:right-5 xl:h-[78%]",
    Parent: "bottom-2 right-4 h-[78%] w-[40%] max-w-[11.25rem] sm:right-5 sm:h-[82%] sm:w-[40%] xl:right-6 xl:h-[80%]",
};

const imageClass: Record<string, string> = {
    Child: "h-full w-auto",
    Teacher: "h-full w-auto",
    Institution: "h-auto w-full",
    Parent: "h-full w-auto",
};

const textClass: Record<string, string> = {
    Child: "max-w-[6.4ch] text-[clamp(1.55rem,3vw,2.25rem)]",
    Teacher: "max-w-[5.4ch] text-[clamp(1.45rem,2.6vw,2rem)]",
    Institution: "max-w-[4.9ch] text-[clamp(1.45rem,2.55vw,2rem)]",
    Parent: "max-w-[5.8ch] text-[clamp(1.45rem,2.6vw,2rem)]",
};

export default function RhythmCards() {
    return (
        <section className="relative z-10 w-full overflow-hidden bg-transparent px-5 py-20 text-[#0A0F2E] sm:py-28 lg:py-36">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-[28rem] w-[34rem] rounded-full bg-[#1E3A8A]/[0.035] blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-7xl">
                <motion.div
                    className="mb-10 grid items-end gap-7 md:mb-16 md:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.48fr)] lg:gap-20"
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-18%" }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div>
                        <p
                            className="mb-4 text-[11px] font-semibold uppercase text-[#D4AF37] sm:text-xs"
                            style={{
                                fontFamily: "var(--font-inter), Inter, sans-serif",
                                letterSpacing: "0.24em",
                            }}
                        >
                            World shift
                        </p>
                        <h2
                            className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.92] tracking-normal"
                            style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                        >
                            Education is entering a new rhythm.
                        </h2>
                    </div>

                    <p
                        className="max-w-xl text-base leading-7 text-[#6B7AA1] sm:text-lg"
                        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                    >
                        The learner&apos;s rhythm becomes visible. The teacher&apos;s craft travels further. The institution&apos;s
                        purpose moves with clarity.
                    </p>
                </motion.div>

                <motion.div
                    className="grid overflow-hidden rounded-[30px] border border-[#1E3A8A]/10 bg-white/52 shadow-[0_32px_90px_rgba(30,58,138,0.12)] backdrop-blur-xl sm:rounded-[34px] md:grid-cols-2 xl:grid-cols-[1.22fr_0.9fr_1.56fr_1.2fr]"
                    aria-label="Four stakeholder outcomes in education"
                    initial={{ opacity: 0, y: 44 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-16%" }}
                    transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                    {RHYTHMS.map((rhythm, index) => (
                        <div
                            key={rhythm.role}
                            className={`group relative flex min-h-[230px] flex-col justify-between overflow-hidden border-b border-[#1E3A8A]/10 p-7 last:border-b-0 md:min-h-[300px] md:[&:nth-child(2)]:border-r-0 md:[&:nth-child(3)]:border-b-0 xl:min-h-[360px] xl:border-b-0 xl:border-r xl:last:border-r-0 ${
                                cardPaddingClass[rhythm.role]
                            }`}
                        >
                            <div
                                className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0A0F2E]/12 shadow-[0_0_0_24px_rgba(255,255,255,0.25),0_0_0_52px_rgba(255,255,255,0.14)] transition duration-700 group-hover:scale-110 group-hover:border-[#D4AF37]/35 sm:h-44 sm:w-44"
                                style={{
                                    animation: `vedRhythmPulse 4.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.65}s infinite`,
                                }}
                            />

                            {rhythm.image && (
                                <div
                                    className={`pointer-events-none absolute z-[1] overflow-visible ${imageWrapClass[rhythm.role]}`}
                                >
                                    <Image
                                        src={rhythm.image}
                                        alt=""
                                        width={rhythm.width}
                                        height={rhythm.height}
                                        className={`absolute bottom-0 right-0 max-w-none object-contain drop-shadow-[0_24px_36px_rgba(10,15,46,0.18)] transition duration-700 group-hover:scale-[1.03] ${imageClass[rhythm.role]}`}
                                        sizes="(min-width: 1280px) 240px, (min-width: 768px) 300px, 52vw"
                                        priority={false}
                                    />
                                </div>
                            )}

                            <p
                                className="relative z-10 text-[11px] font-extrabold uppercase text-[#0A0F2E]/50 sm:text-sm"
                                style={{
                                    fontFamily: "var(--font-inter), Inter, sans-serif",
                                    letterSpacing: "0.16em",
                                }}
                            >
                                {rhythm.tag}
                            </p>

                            <p
                                className={`relative z-10 ${textClass[rhythm.role]} font-normal leading-none tracking-normal`}
                                style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                            >
                                {rhythm.line}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes vedRhythmPulse {
                    0%,
                    100% {
                        transform: translate(-50%, -50%) scale(0.88);
                        opacity: 0.52;
                    }

                    50% {
                        transform: translate(-50%, -50%) scale(1.08);
                        opacity: 0.96;
                    }
                }
            `}</style>
        </section>
    );
}
