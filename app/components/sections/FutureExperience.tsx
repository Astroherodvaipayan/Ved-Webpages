"use client";

const experienceCards = [
    {
        role: "Student",
        title: "A path that feels made for them.",
        body: "Learning becomes personal, steady, and alive.",
    },
    {
        role: "Teacher",
        title: "The teacher's craft, carried with greater continuity.",
        body: "The teacher remains the source.",
    },
    {
        role: "Institution",
        title: "A school moving with shared purpose.",
        body: "Capability compounds across the institution.",
    },
    {
        role: "Parent",
        title: "Progress families believe in.",
        body: "The child is seen, not merely measured.",
    },
];

export default function FutureExperience() {
    return (
        <section
            id="future-experience"
            className="relative z-10 w-full overflow-hidden bg-transparent px-4 py-20 sm:px-6 md:py-32"
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
                    <div>
                        <p className="mb-6 text-xs font-bold uppercase tracking-[0.32em] text-[#B8832F] md:text-sm">
                            Experience
                        </p>
                        <h2
                            className="max-w-4xl text-[clamp(4.5rem,11vw,9.8rem)] leading-[0.82] text-[#060B14]"
                            style={{ fontFamily: "var(--font-instrument-serif)" }}
                        >
                            This is what the future feels like.
                        </h2>
                    </div>

                    <p className="max-w-xl text-2xl leading-relaxed text-[#6B7280] md:text-3xl">
                        Not more noise. More presence. More continuity. More confidence in every step.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {experienceCards.map((card) => (
                        <article
                            key={card.role}
                            className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[28px] border border-[#E4DED2] bg-[#FFFDF8] p-8 shadow-[0_24px_80px_rgba(42,31,16,0.08)] md:min-h-[430px] md:p-10"
                        >
                            <div
                                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-70 blur-3xl"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(218, 166, 64, 0.26), rgba(255,255,255,0) 68%)",
                                }}
                            />
                            <p className="relative text-sm font-bold uppercase tracking-[0.34em] text-[#8B8E91]">
                                {card.role}
                            </p>
                            <div className="relative">
                                <h3
                                    className="text-[clamp(2.35rem,4vw,3.55rem)] leading-[0.9] text-[#060B14]"
                                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                                >
                                    {card.title}
                                </h3>
                                <p className="mt-8 text-xl leading-snug text-[#6B7280] md:text-2xl">
                                    {card.body}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
