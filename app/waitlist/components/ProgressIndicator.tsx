import styles from "./Waitlist.module.css";

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className={styles.progressIndicator}>
            <span className={styles.progressNumber}>{currentStep}/{totalSteps}</span>
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
