"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressIndicator from "./ProgressIndicator";
import styles from "./Waitlist.module.css";

interface WaitlistFormData {
    firstName: string;
    lastName: string;
    email: string;
    role: "student" | "teacher" | "institution" | "";
    imageUrl: string | null;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    imageUrl?: string;
}

interface WaitlistFormProps {
    currentStep: number;
    formData: WaitlistFormData;
    errors: FormErrors;
    imagePreview: string | null;
    isSubmitting: boolean;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
    onFieldChange: (field: keyof WaitlistFormData, value: string) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

const ROLES = [
    { value: "student", label: "Student", desc: "Learning & growing" },
    { value: "teacher", label: "Teacher", desc: "Educating the future" },
    { value: "institution", label: "Institution", desc: "Scaling excellence" },
];

const DEFAULT_AVATAR = "https://api.dicebear.com/9.x/glass/svg?flip=true&backgroundColor=4747eb,4762eb,477eeb,4799eb,47b4eb,47d0eb,47eb47,47eb62,47eb7e,47eb99,47ebb4,47ebd0,47ebeb,6247eb,62eb47,7e47eb,7eeb47,9947eb,99eb47,b447eb,b4eb47,d047eb,d0eb47,eb4747,eb4762,eb477e,eb4799,47ebd0,eb47eb,eb6247,eb7e47,eb9947,ebb447,ebd047,ebeb47,transparent&seed=User";

export default function WaitlistForm({
    currentStep,
    formData,
    errors,
    imagePreview,
    isSubmitting,
    onNext,
    onBack,
    onSubmit,
    onFieldChange,
    onImageUpload,
    onKeyPress,
}: WaitlistFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>
                                First Name <span className={styles.req}>*</span>
                            </label>
                            <div className={styles.fieldInputWrap}>
                                <input
                                    type="text"
                                    className={`${styles.fieldInput} ${errors.firstName ? styles.error : ""} ${formData.firstName.trim() ? styles.valid : ""}`}
                                    placeholder="Arjun"
                                    value={formData.firstName}
                                    onChange={(e) => onFieldChange("firstName", e.target.value)}
                                    onKeyDown={onKeyPress}
                                />
                                {formData.firstName.trim() && (
                                    <span className={styles.fieldCheck}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            {errors.firstName && (
                                <div className={styles.fieldError}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    {errors.firstName}
                                </div>
                            )}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Last Name</label>
                            <input
                                type="text"
                                className={styles.fieldInput}
                                placeholder="Kumar"
                                value={formData.lastName}
                                onChange={(e) => onFieldChange("lastName", e.target.value)}
                                onKeyDown={onKeyPress}
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                            Email Address <span className={styles.req}>*</span>
                        </label>
                        <div className={styles.fieldInputWrap}>
                            <input
                                type="email"
                                className={`${styles.fieldInput} ${errors.email ? styles.error : ""} ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? styles.valid : ""}`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => onFieldChange("email", e.target.value)}
                                onKeyDown={onKeyPress}
                            />
                            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                <span className={styles.fieldCheck}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        {errors.email && (
                            <div className={styles.fieldError}>
                                <svg width="12" viewBox="" height="120 0 12 12" fill="none">
                                    <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {errors.email}
                            </div>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>
                            I am a <span className={styles.req}>*</span>
                        </label>
                        <div className={styles.roleGrid}>
                            {ROLES.map((role) => (
                                <div
                                    key={role.value}
                                    className={`${styles.roleOption} ${formData.role === role.value ? styles.selected : ""}`}
                                    onClick={() => onFieldChange("role", role.value)}
                                >
                                    <span className={styles.roleLabel}>{role.label}</span>
                                    <span className={styles.roleDesc}>{role.desc}</span>
                                </div>
                            ))}
                        </div>
                        {errors.role && (
                            <div className={styles.fieldError}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {errors.role}
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className={styles.photoSection}>
                        <div className={styles.photoAvatarLarge}>
                            <img
                                src={imagePreview || DEFAULT_AVATAR}
                                alt="Your avatar"
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.photoUploadBtn}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? "Change Photo" : "Upload Photo"}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageUpload}
                            style={{ display: "none" }}
                        />
                        <p className={styles.photoHelper}>Optional — Personalize your profile</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Let's get started";
            case 2: return "Where should we send your invite?";
            case 3: return "What's your role?";
            case 4: return "Almost there!";
            default: return "";
        }
    };

    const getStepSubtitle = () => {
        switch (currentStep) {
            case 1: return "We'll personalize your experience based on this.";
            case 2: return "We'll send your unique waitlist link here.";
            case 3: return "Help us tailor the platform for you.";
            case 4: return "Add a photo to stand out in the queue.";
            default: return "";
        }
    };

    return (
        <div className={styles.formContainer}>
            <ProgressIndicator currentStep={currentStep} totalSteps={4} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className={styles.formTitle}>{getStepTitle()}</h3>
                    <p className={styles.formSubtitle}>{getStepSubtitle()}</p>

                    {renderStepContent()}

                    <div className={styles.navButtons}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                className={`${styles.navBtn} ${styles.navBtnBack}`}
                                onClick={onBack}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M3.5 2L6.5 5l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>
                        )}
                        <button
                            type="button"
                            className={`${styles.navBtn} ${styles.navBtnNext}`}
                            onClick={currentStep < 4 ? onNext : onSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className={styles.submitSpinner} />
                            ) : currentStep < 4 ? (
                                <>
                                    Continue
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M3.5 8L6.5 5l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            ) : (
                                "Join Waitlist"
                            )}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
