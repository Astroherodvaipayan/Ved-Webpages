"use client";

import Link from "next/link";
import GradientButton from "../ui/GradientButton";

export default function BillionGeniuses() {
    return (
        <section
            id="billion-geniuses"
            className="relative z-10 w-full overflow-hidden bg-transparent px-4 py-16 sm:px-6 md:py-28"
        >
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[36px] border border-[#E4DED2] bg-[#FFFDF8] px-6 py-24 text-center shadow-[0_34px_110px_rgba(42,31,16,0.10)] sm:px-10 md:rounded-[56px] md:py-36">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 12%, rgba(255,255,255,0.95), rgba(255,255,255,0) 30%), radial-gradient(circle at 82% 14%, rgba(218,166,64,0.16), rgba(255,255,255,0) 28%), radial-gradient(circle at 12% 12%, rgba(218,166,64,0.10), rgba(255,255,255,0) 34%)",
                        }}
                    />
                    <div
                        className="pointer-events-none absolute -left-28 -top-36 h-[440px] w-[440px] rounded-full border border-[#D6CFC1]/70"
                    />
                    <div
                        className="pointer-events-none absolute -left-44 -top-52 h-[620px] w-[620px] rounded-full border border-[#D6CFC1]/45"
                    />

                    <div className="relative mx-auto max-w-5xl">
                        <p className="mb-8 text-xs font-bold uppercase tracking-[0.32em] text-[#B8832F] md:text-sm">
                            Mission
                        </p>
                        <h2
                            className="text-[clamp(4.2rem,10vw,9rem)] leading-[0.85] text-[#060B14]"
                            style={{ fontFamily: "var(--font-instrument-serif)" }}
                        >
                            Enabling a billion geniuses.
                        </h2>
                        <p className="mx-auto mt-10 max-w-4xl text-xl leading-relaxed text-[#6B7280] md:text-3xl">
                            Genius is not only rank. It is capability brought to life. Ved exists to carry that
                            capability through every child, every classroom, every institution, and every generation.
                        </p>
                        <div className="mt-12 flex justify-center">
                            <Link href="/waitlist" className="inline-block">
                                <GradientButton label="Join Beta" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
