"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";

const STAKEHOLDERS = [
    { label: "Student", left: "13%" },
    { label: "Teacher", left: "31%" },
    { label: "Parent", left: "50%" },
    { label: "Institution", left: "69%" },
    { label: "Industry", left: "87%" },
];

export default function EducationShift() {
    const sectionRef = useRef<HTMLElement>(null);
    const chaoticVideoRef = useRef<HTMLVideoElement>(null);
    const syncedVideoRef = useRef<HTMLVideoElement>(null);
    const unsyncedLabelRef = useRef<HTMLDivElement>(null);
    const syncLabelRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const chaoticVideo = chaoticVideoRef.current;
        const syncedVideo = syncedVideoRef.current;
        const unsyncedLabel = unsyncedLabelRef.current;
        const syncLabel = syncLabelRef.current;
        if (!section || !chaoticVideo || !syncedVideo || !unsyncedLabel || !syncLabel) return;

        let frameId = 0;
        const clamp = (value: number) => Math.max(0, Math.min(1, value));
        const ease = (value: number) => value * value * (3 - 2 * value);
        const syncPlayback = () => {
            if (!Number.isFinite(chaoticVideo.currentTime) || !Number.isFinite(syncedVideo.currentTime)) return;

            const drift = Math.abs(syncedVideo.currentTime - chaoticVideo.currentTime);
            if (drift > 0.035) {
                syncedVideo.currentTime = chaoticVideo.currentTime;
            }

            syncedVideo.playbackRate = chaoticVideo.playbackRate;
        };

        const render = () => {
            const rect = section.getBoundingClientRect();
            const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
            const progress = clamp(-rect.top / scrollDistance);
            const videoProgress = ease(clamp((progress - 0.48) / 0.34));
            const beforeLabelProgress = ease(clamp((progress - 0.42) / 0.14));
            const afterLabelProgress = ease(clamp((progress - 0.54) / 0.18));

            syncPlayback();
            syncedVideo.style.opacity = `${videoProgress}`;
            unsyncedLabel.style.opacity = `${1 - beforeLabelProgress}`;
            unsyncedLabel.style.transform = `translateY(${-beforeLabelProgress * 10}px)`;
            syncLabel.style.opacity = `${afterLabelProgress}`;
            syncLabel.style.transform = `translateY(${(1 - afterLabelProgress) * 12}px)`;
        };

        const scheduleRender = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(() => {
                frameId = 0;
                render();
            });
        };

        window.addEventListener("scroll", scheduleRender, { passive: true });
        window.addEventListener("resize", scheduleRender);
        chaoticVideo.addEventListener("play", syncPlayback);
        chaoticVideo.addEventListener("seeked", syncPlayback);
        chaoticVideo.addEventListener("timeupdate", syncPlayback);
        syncedVideo.addEventListener("loadedmetadata", syncPlayback);
        render();

        return () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", scheduleRender);
            window.removeEventListener("resize", scheduleRender);
            chaoticVideo.removeEventListener("play", syncPlayback);
            chaoticVideo.removeEventListener("seeked", syncPlayback);
            chaoticVideo.removeEventListener("timeupdate", syncPlayback);
            syncedVideo.removeEventListener("loadedmetadata", syncPlayback);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="education-shift"
            className="relative z-10 h-[210dvh] w-full overflow-visible bg-transparent px-5 text-center"
            style={{
                background:
                    "linear-gradient(180deg, rgba(250, 251, 255, 0) 0%, rgba(255, 254, 251, 0.72) 10%, rgba(255, 254, 251, 0.96) 22%, #FFFEFB 36%, #FFFEFB 100%)",
            }}
        >
            <div className="pointer-events-none absolute inset-x-0 -top-72 h-[34rem] bg-gradient-to-b from-transparent via-[#FFFEFB]/70 to-[#FFFEFB]" />

            <div className="sticky top-0 flex min-h-[100dvh] w-full flex-col items-center justify-center py-16 sm:py-20">
                <motion.div
                    className="relative mx-auto max-w-6xl"
                    initial={{ opacity: 0, y: 42 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p
                        className="mb-4 text-[11px] font-semibold uppercase text-[#1E3A8A]/55 sm:text-xs"
                        style={{
                            fontFamily: "var(--font-inter), Inter, sans-serif",
                            letterSpacing: "0.28em",
                        }}
                    >
                        The missing layer
                    </p>
                    <h2
                        className="text-[clamp(2.7rem,6.2vw,5.8rem)] font-normal leading-[0.92] tracking-normal text-[#0A0F2E]"
                        style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                    >
                        Education has changed.
                        <span className="block text-[#6B7AA1]">But not together</span>
                    </h2>
                </motion.div>

                <motion.div
                    className="relative mt-7 w-full max-w-6xl sm:mt-8"
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-18%" }}
                    transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="pointer-events-none absolute left-1/2 top-10 h-[calc(100%-2rem)] w-[min(1040px,100%)] -translate-x-1/2 rounded-[42px] bg-white/40 blur-2xl" />

                    <div className="relative z-10 mx-auto mb-3 flex min-h-[52px] w-full max-w-3xl items-start justify-center text-center sm:mb-4 sm:min-h-[58px]">
                        <div
                            ref={unsyncedLabelRef}
                            className="absolute inset-x-0 top-0 px-4 py-1"
                            style={{
                                transition: "opacity 220ms ease-out, transform 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                                willChange: "opacity, transform",
                            }}
                        >
                            <p
                                className="text-[10px] font-semibold uppercase text-[#8B91A3] sm:text-xs"
                                style={{
                                    fontFamily: "var(--font-inter), Inter, sans-serif",
                                    letterSpacing: "0.18em",
                                }}
                            >
                                Before Ved
                            </p>
                            <p
                                className="mt-1 text-base font-semibold leading-tight text-[#0A0F2E] sm:text-xl"
                                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                            >
                                Everyone is learning in a different rhythm.
                            </p>
                        </div>
                        <div
                            ref={syncLabelRef}
                            className="absolute inset-x-0 top-0 px-4 py-1 opacity-0"
                            style={{
                                transition: "opacity 220ms ease-out, transform 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                                willChange: "opacity, transform",
                            }}
                        >
                            <p
                                className="text-[10px] font-semibold uppercase text-[#1E3A8A] sm:text-xs"
                                style={{
                                    fontFamily: "var(--font-inter), Inter, sans-serif",
                                    letterSpacing: "0.18em",
                                }}
                            >
                                With Ved
                            </p>
                            <p
                                className="mt-1 text-base font-semibold leading-tight text-[#0A0F2E] sm:text-xl"
                                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                            >
                                Different rhythms sync into one learning system.
                            </p>
                        </div>
                    </div>

                    <div
                        className="relative z-10 mx-auto overflow-hidden rounded-[22px] bg-white/90 shadow-[0_26px_80px_rgba(30,58,138,0.08)] ring-1 ring-white/80 sm:rounded-[32px]"
                        style={{
                            aspectRatio: "1.36 / 1",
                            width: "min(100%, calc(52vh * 1.36), 920px)",
                            maxWidth: "100%",
                        }}
                    >
                        <video
                            ref={chaoticVideoRef}
                            src="/videos/pendulum-chaotic.mp4"
                            className="absolute inset-0 h-full w-full scale-[1.012] object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                        <video
                            ref={syncedVideoRef}
                            src="/videos/pendulum-synced.mp4"
                            className="absolute inset-0 h-full w-full scale-[1.012] object-cover opacity-0"
                            style={{
                                transition: "opacity 180ms linear",
                                willChange: "opacity",
                            }}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                        <div className="pointer-events-none absolute inset-0 z-10">
                            {STAKEHOLDERS.map((stakeholder) => (
                                <div
                                    key={stakeholder.label}
                                    className="absolute top-3 -translate-x-1/2 rounded-full border border-white/45 bg-white/82 px-2 py-1 text-[9px] font-semibold text-[#0A0F2E] shadow-[0_8px_24px_rgba(10,15,46,0.12)] backdrop-blur-sm sm:top-8 sm:px-3 sm:text-xs"
                                    style={{
                                        left: stakeholder.left,
                                        fontFamily: "var(--font-inter), Inter, sans-serif",
                                    }}
                                >
                                    {stakeholder.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
