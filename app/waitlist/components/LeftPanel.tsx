import Image from "next/image";
import styles from "./Waitlist.module.css";

export default function LeftPanel() {
    return (
        <div className={styles.leftPanel}>
            <div className={styles.leftPanelNoise} />
            <div className={styles.leftGlow1} />
            <div className={styles.leftGlow2} />
            <div className={styles.leftGrid} />

            <div className={styles.leftContent}>
                <div className={styles.leftBrand}>
                    <div className={styles.leftLogoRing}>
                        <Image src="/logo.png" alt="Ved AI" fill className="object-contain p-1.5" />
                    </div>
                    <span className={styles.leftBrandName}>Ved AI</span>
                </div>

                <div className={styles.leftCenter}>
                    <h2 className={styles.leftHeadline}>
                        Learning,<br />
                        finally <em>personal.</em>
                    </h2>
                    <p className={styles.leftSub}>
                        One-on-one tutoring has always been the gold standard.
                        We're making it available to every person on Earth.
                    </p>
                </div>

                <div className={styles.leftFooter}>
                    © {new Date().getFullYear()} Ved AI · Enabling a billion geniuses
                </div>
            </div>
        </div>
    );
}
