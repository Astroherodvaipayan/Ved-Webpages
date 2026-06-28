"use client";

import { motion } from "framer-motion";

const INPUT_CARDS = [
    {
        id: "parent",
        label: "Parent",
        copy: ["Care", "Support", "Values"],
        ariaLabel: "Parent input source",
    },
    {
        id: "teacher",
        label: "Teacher",
        copy: ["Guidance", "Feedback", "Wisdom"],
        ariaLabel: "Teacher input source",
    },
    {
        id: "student",
        label: "Student",
        copy: ["Learning", "Curiosity", "Growth"],
        ariaLabel: "Student input source",
    },
    {
        id: "institution",
        label: "Institution",
        copy: ["Resources", "System", "Environment"],
        ariaLabel: "Institution input source",
    },
];

const FLOW_GROUPS = [
    {
        id: "parent",
        stroke: "url(#vedLayerParentGradient)",
        signalStroke: "#9b7be6",
        signalDelay: "-2s",
        paths: [
            ["ved-layer-flow-glow", "M 143 179 C 164 300 262 348 365 410 C 430 448 458 396 493 357"],
            ["ved-layer-flow-body", "M 165 179 C 185 294 284 356 386 421 C 436 452 468 395 516 358"],
            ["ved-layer-thread ved-layer-strong", "M 128 179 C 154 296 242 336 350 399 C 421 440 446 398 484 359"],
            ["ved-layer-thread", "M 146 179 C 173 306 254 350 365 411 C 418 440 465 405 501 358"],
            ["ved-layer-thread", "M 163 179 C 188 300 278 349 381 417 C 430 450 474 406 514 360"],
            ["ved-layer-thread ved-layer-faint", "M 180 179 C 199 298 296 357 399 425 C 443 454 487 402 526 362"],
            ["ved-layer-thread ved-layer-faint", "M 198 179 C 214 287 309 351 414 420 C 454 446 492 396 538 363"],
            ["ved-layer-thread ved-layer-faint", "M 217 179 C 227 277 328 352 432 411 C 467 431 501 392 546 365"],
        ],
        signalPath: "M 146 179 C 173 306 254 350 365 411 C 418 440 465 405 501 358",
    },
    {
        id: "teacher",
        stroke: "url(#vedLayerTeacherGradient)",
        signalStroke: "#7aa9e5",
        signalDelay: "-4s",
        paths: [
            ["ved-layer-flow-glow", "M 402 179 C 384 304 456 348 517 415 C 540 440 531 397 550 360"],
            ["ved-layer-flow-body", "M 430 179 C 413 299 467 354 532 418 C 558 443 550 395 571 360"],
            ["ved-layer-thread ved-layer-strong", "M 372 179 C 365 295 424 339 494 404 C 530 437 522 398 541 360"],
            ["ved-layer-thread", "M 392 179 C 383 300 444 351 508 415 C 540 448 535 399 553 359"],
            ["ved-layer-thread", "M 412 179 C 399 293 454 348 521 415 C 552 445 549 396 564 360"],
            ["ved-layer-thread ved-layer-faint", "M 452 179 C 430 288 478 352 543 412 C 568 436 566 391 585 362"],
            ["ved-layer-thread ved-layer-faint", "M 475 179 C 450 282 496 353 559 408 C 581 428 582 389 598 363"],
        ],
        signalPath: "M 412 179 C 399 293 454 348 521 415 C 552 445 549 396 564 360",
    },
    {
        id: "student",
        stroke: "url(#vedLayerStudentGradient)",
        signalStroke: "#67c8be",
        signalDelay: "-1s",
        paths: [
            ["ved-layer-flow-glow", "M 675 179 C 704 294 658 350 607 414 C 582 445 596 397 591 360"],
            ["ved-layer-flow-body", "M 704 179 C 724 299 672 354 622 417 C 598 448 610 394 610 360"],
            ["ved-layer-thread ved-layer-strong", "M 641 179 C 674 291 640 344 593 408 C 570 440 584 398 582 360"],
            ["ved-layer-thread", "M 662 179 C 693 301 651 352 605 417 C 584 447 595 399 594 359"],
            ["ved-layer-thread", "M 684 179 C 712 295 662 351 617 417 C 599 443 610 397 608 360"],
            ["ved-layer-thread ved-layer-faint", "M 724 179 C 744 289 686 351 637 413 C 620 434 626 391 626 361"],
            ["ved-layer-thread ved-layer-faint", "M 746 179 C 760 283 704 351 656 408 C 640 427 642 389 642 363"],
        ],
        signalPath: "M 684 179 C 712 295 662 351 617 417 C 599 443 610 397 608 360",
    },
    {
        id: "institution",
        stroke: "url(#vedLayerInstitutionGradient)",
        signalStroke: "#e5949b",
        signalDelay: "-6s",
        paths: [
            ["ved-layer-flow-glow", "M 1035 179 C 1006 296 923 337 826 397 C 759 438 738 397 706 357"],
            ["ved-layer-flow-body", "M 1012 179 C 986 303 896 358 808 417 C 758 451 728 395 686 358"],
            ["ved-layer-thread ved-layer-strong", "M 1065 179 C 1030 297 947 331 845 392 C 777 433 748 398 715 358"],
            ["ved-layer-thread", "M 1044 179 C 1015 306 929 350 828 411 C 772 445 736 405 701 359"],
            ["ved-layer-thread", "M 1024 179 C 997 300 905 348 810 416 C 758 454 724 407 688 360"],
            ["ved-layer-thread ved-layer-faint", "M 1004 179 C 982 293 887 353 794 421 C 747 456 712 403 676 362"],
            ["ved-layer-thread ved-layer-faint", "M 984 179 C 967 285 871 349 777 416 C 734 446 705 397 665 363"],
            ["ved-layer-thread ved-layer-faint", "M 962 179 C 951 276 854 348 758 405 C 724 426 698 390 654 365"],
        ],
        signalPath: "M 1024 179 C 997 300 905 348 810 416 C 758 454 724 407 688 360",
    },
];

const GOLD_STREAMS = [
    ["ved-layer-gold-glow", "M 600 655 C 598 707 596 742 600 790 C 604 817 610 837 600 858"],
    ["ved-layer-gold-body", "M 600 653 C 600 704 600 745 600 790 C 600 818 600 840 600 858"],
    ["ved-layer-gold-thread", "M 563 650 C 555 705 553 756 479 804 C 445 827 433 841 421 858"],
    ["ved-layer-gold-thread", "M 575 653 C 565 710 569 755 512 805 C 486 828 476 841 462 858"],
    ["ved-layer-gold-thread", "M 586 655 C 578 708 584 759 542 806 C 520 831 514 842 506 858"],
    ["ved-layer-gold-thread ved-layer-strong", "M 596 657 C 594 708 595 759 584 806 C 578 830 575 843 572 858"],
    ["ved-layer-gold-thread ved-layer-strong", "M 604 657 C 606 708 605 759 616 806 C 622 830 625 843 628 858"],
    ["ved-layer-gold-thread", "M 614 655 C 622 708 616 759 658 806 C 680 831 686 842 694 858"],
    ["ved-layer-gold-thread", "M 625 653 C 635 710 631 755 688 805 C 714 828 724 841 738 858"],
    ["ved-layer-gold-thread", "M 637 650 C 645 705 647 756 721 804 C 755 827 767 841 779 858"],
    ["ved-layer-gold-thread ved-layer-faint", "M 548 653 C 540 712 535 765 454 812 C 420 832 408 844 393 858"],
    ["ved-layer-gold-thread ved-layer-faint", "M 652 653 C 660 712 665 765 746 812 C 780 832 792 844 807 858"],
];

function CopyWithSeparators({ items }: { items: string[] }) {
    return (
        <>
            {items.map((item, index) => (
                <span key={item}>
                    {index > 0 && <span aria-hidden="true"> &middot; </span>}
                    {item}
                </span>
            ))}
        </>
    );
}

function ConnectedLayerDiagram() {
    return (
        <div className="ved-layer-stage" aria-label="VED connected intelligence layer diagram">
            <div className="ved-layer-diagram">
                <div className="ved-layer-annotation">
                    <span className="ved-layer-annotation-line" />
                    Connected context becomes intelligence
                    <span className="ved-layer-annotation-line" />
                </div>

                <svg
                    className="ved-layer-flows"
                    viewBox="0 0 1200 1000"
                    role="img"
                    aria-labelledby="ved-layer-diagram-title"
                >
                    <title id="ved-layer-diagram-title">
                        Colored input streams flowing into Ved, then one golden stream flowing into unified intelligence
                    </title>
                    <defs>
                        <linearGradient id="vedLayerParentGradient" x1="115" y1="165" x2="520" y2="390" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#9b7be6" stopOpacity="0.74" />
                            <stop offset="0.54" stopColor="#9b7be6" stopOpacity="0.30" />
                            <stop offset="1" stopColor="#9b7be6" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="vedLayerTeacherGradient" x1="390" y1="165" x2="570" y2="390" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#7aa9e5" stopOpacity="0.70" />
                            <stop offset="0.58" stopColor="#7aa9e5" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#7aa9e5" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="vedLayerStudentGradient" x1="690" y1="165" x2="620" y2="390" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#67c8be" stopOpacity="0.68" />
                            <stop offset="0.55" stopColor="#67c8be" stopOpacity="0.25" />
                            <stop offset="1" stopColor="#67c8be" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="vedLayerInstitutionGradient" x1="1030" y1="165" x2="700" y2="390" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#e5949b" stopOpacity="0.70" />
                            <stop offset="0.56" stopColor="#e5949b" stopOpacity="0.28" />
                            <stop offset="1" stopColor="#e5949b" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="vedLayerGoldGradient" x1="600" y1="650" x2="600" y2="850" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#f2ca70" stopOpacity="0.12" />
                            <stop offset="0.42" stopColor="#e2ad47" stopOpacity="0.70" />
                            <stop offset="1" stopColor="#d5972b" stopOpacity="0.28" />
                        </linearGradient>
                        <linearGradient id="vedLayerGoldGradientLight" x1="520" y1="650" x2="680" y2="850" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#f9df9a" stopOpacity="0.28" />
                            <stop offset="0.56" stopColor="#dca642" stopOpacity="0.66" />
                            <stop offset="1" stopColor="#fff4c6" stopOpacity="0.18" />
                        </linearGradient>
                        <filter id="vedLayerSoftBlur" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="9" />
                        </filter>
                        <filter id="vedLayerGoldBlur" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="11" />
                        </filter>
                        <filter id="vedLayerMicroGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {FLOW_GROUPS.map((group) => (
                        <g key={group.id}>
                            {group.paths.map(([className, d]) => (
                                <path key={`${group.id}-${d}`} className={className} stroke={group.stroke} d={d} />
                            ))}
                            <path
                                className="ved-layer-signal"
                                stroke={group.signalStroke}
                                style={{ animationDelay: group.signalDelay }}
                                d={group.signalPath}
                            />
                        </g>
                    ))}

                    <g>
                        {GOLD_STREAMS.map(([className, d]) => (
                            <path
                                key={d}
                                className={className}
                                stroke={className.includes("glow") ? "url(#vedLayerGoldGradient)" : "url(#vedLayerGoldGradientLight)"}
                                d={d}
                            />
                        ))}
                        <path
                            className="ved-layer-gold-signal"
                            stroke="#dca642"
                            d="M 600 653 C 600 704 600 745 600 790 C 600 818 600 840 600 858"
                        />
                    </g>
                </svg>

                {INPUT_CARDS.map((card) => (
                    <article
                        key={card.id}
                        className={`ved-layer-card ved-layer-card-${card.id}`}
                        aria-label={card.ariaLabel}
                    >
                        <div className="ved-layer-card-inner">
                            <span className="ved-layer-card-title">{card.label}</span>
                            <span className="ved-layer-card-copy">
                                <CopyWithSeparators items={card.copy} />
                            </span>
                        </div>
                    </article>
                ))}

                <div className="ved-layer-orb" aria-label="VED connected intelligence layer">
                    <div className="ved-layer-orb-content">
                        <span className="ved-layer-brand">ved</span>
                        <span className="ved-layer-brand-subtitle">Connected Intelligence Layer</span>
                    </div>
                </div>

                <div className="ved-layer-output-pill" aria-label="Unified intelligence output">
                    <div>
                        <span className="ved-layer-output-title">Unified Intelligence</span>
                        <span className="ved-layer-output-copy">
                            <CopyWithSeparators items={["Insight", "Clarity", "Action"]} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TogetherLeap() {
    return (
        <>
            <section
                id="together-leap"
                aria-label="Transformation"
                className="relative z-10 min-h-[clamp(940px,112dvh,1160px)] w-full overflow-hidden bg-transparent px-5 py-20 text-[#0A0F2E] sm:py-28 lg:py-36"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,254,251,0) 0%, rgba(255,254,251,0.86) 16%, #FFFEFB 48%, #FFFEFB 100%)",
                }}
            >
                <motion.div
                    className="ved-layer-background"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.72 }}
                    viewport={{ once: true, margin: "-18%" }}
                    transition={{ duration: 1.05, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                    <ConnectedLayerDiagram />
                </motion.div>

                <div className="relative z-10 mx-auto flex min-h-[78dvh] w-full max-w-7xl items-start">
                    <motion.div
                        className="grid w-full items-end gap-7 pt-12 md:grid-cols-[minmax(0,0.9fr)_minmax(260px,0.48fr)] lg:gap-20 lg:pt-16"
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-18%" }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div>
                            <p
                                className="mb-4 text-[11px] font-semibold uppercase text-[#D4AF37] sm:text-xs"
                                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                            >
                                Transformation
                            </p>
                            <h2
                                className="max-w-4xl text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.92] tracking-normal [text-wrap:balance]"
                                style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                            >
                                The next leap is together.
                            </h2>
                        </div>

                        <p
                            className="max-w-xl text-base leading-7 text-[#6B7AA1] sm:text-lg"
                            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                        >
                            When every rhythm meets, education becomes one living movement.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section
                aria-label="Ved reveal"
                className="relative z-10 overflow-hidden bg-[#0D1117] px-5 py-24 text-center text-[#FFFAF2] sm:py-32 lg:py-44"
            >
                <motion.div
                    className="relative z-10 mx-auto w-full max-w-5xl"
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-18%" }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="mx-auto mb-9 grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(from_180deg,#f9dfaa,#8d611d,#d2a152,#f9dfaa)] shadow-[0_0_0_1px_rgba(255,250,242,0.22),0_42px_120px_rgba(183,130,47,0.25)] sm:h-36 sm:w-36">
                        <span
                            className="grid h-20 w-20 place-items-center rounded-full bg-[#0D1117] text-base font-extrabold text-[#FFFAF2] sm:h-24 sm:w-24 sm:text-lg"
                            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                        >
                            VED
                        </span>
                    </div>
                    <p
                        className="mb-4 text-[11px] font-semibold uppercase text-[#E8C88D] sm:text-xs"
                        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                    >
                        The reveal
                    </p>
                    <h2
                        className="text-[clamp(3.4rem,8vw,6.75rem)] font-normal leading-[0.9] tracking-normal [text-wrap:balance]"
                        style={{ fontFamily: "var(--font-instrument-serif), Instrument Serif, serif" }}
                    >
                        Ved is building that path.
                    </h2>
                    <p
                        className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#FFFAF2]/72 sm:text-xl"
                        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                    >
                        A connected education layer for schools, teachers, parents and every child.
                    </p>
                </motion.div>
            </section>
        </>
    );
}
