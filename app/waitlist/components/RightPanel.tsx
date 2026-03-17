"use client";

import Link from "next/link";
import { ReactNode } from "react";
import styles from "./Waitlist.module.css";

interface RightPanelProps {
    children: ReactNode;
}

export default function RightPanel({ children }: RightPanelProps) {
    return (
        <div className={styles.rightPanel}>
            <Link href="/" className={styles.backLink}>
                <span className={styles.backArrow}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <path d="M7 3.5L3 5L7 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </span>
                Back
            </Link>

            <div className={styles.mobileLogo}>
                <div className={styles.leftLogoRing} style={{ width: 32, height: 32 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Ved AI" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                </div>
                <span className={styles.mobileLogoName}>Ved AI</span>
            </div>

            <div className={styles.rightPanelContent}>
                {children}
            </div>
        </div>
    );
}
