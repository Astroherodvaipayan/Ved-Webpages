"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Waitlist.module.css";

interface WaitlistFormData {
  name: string;
  email: string;
  role: "student" | "teacher" | "institution" | "";
  imageUrl: string | null;
}

interface FormErrors {
  name?: string;
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
  { value: "student", label: "Student", desc: "Learning & growing", key: "A" },
  { value: "teacher", label: "Teacher", desc: "Educating the future", key: "B" },
  { value: "institution", label: "Institution", desc: "Scaling excellence", key: "C" },
];

const DEFAULT_AVATAR =
  "https://api.dicebear.com/9.x/glass/svg?flip=true&backgroundColor=4747eb,4762eb,477eeb,4799eb,47b4eb,47d0eb,47eb47,47eb62,47eb7e,47eb99,47ebb4,47ebd0,47ebeb,6247eb,62eb47,7e47eb,7eeb47,9947eb,99eb47,b447eb,b4eb47,d047eb,d0eb47,eb4747,eb4762,eb477e,eb4799,47ebd0,eb47eb,eb6247,eb7e47,eb9947,ebb447,ebd047,ebeb47,transparent&seed=User";

const TOTAL_FORM_STEPS = 4; // steps 1–4

const slideVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What\u2019s your name?";
      case 2: return "Where should we send your invite?";
      case 3: return "What\u2019s your role?";
      case 4: return "Almost there.";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "We\u2019ll personalize your experience based on this.";
      case 2: return "We\u2019ll send your unique waitlist link here.";
      case 3: return "Help us tailor the platform for you.";
      case 4: return "Add a photo to stand out in the queue. Optional.";
      default: return "";
    }
  };

  const renderInput = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.tfInputWrap}>
            <input
              autoFocus
              type="text"
              className={`${styles.tfInput} ${errors.name ? styles.tfError : ""} ${formData.name.trim() ? styles.tfValid : ""}`}
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              onKeyDown={onKeyPress}
            />
            {formData.name.trim() && (
              <span className={styles.tfValidIcon}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            {errors.name && (
              <div className={styles.tfErrorMsg}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {errors.name}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className={styles.tfInputWrap}>
            <input
              autoFocus
              type="email"
              className={`${styles.tfInput} ${errors.email ? styles.tfError : ""} ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? styles.tfValid : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              onKeyDown={onKeyPress}
            />
            {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <span className={styles.tfValidIcon}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            {errors.email && (
              <div className={styles.tfErrorMsg}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {errors.email}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <>
            <div className={styles.roleCards}>
              {ROLES.map((role) => (
                <div
                  key={role.value}
                  className={`${styles.roleCard} ${formData.role === role.value ? styles.roleSelected : ""}`}
                  onClick={() => onFieldChange("role", role.value)}
                >
                  <span className={styles.roleKey}>{role.key}</span>
                  <div className={styles.roleCardText}>
                    <span className={styles.roleCardLabel}>{role.label}</span>
                    <span className={styles.roleCardDesc}>{role.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            {errors.role && (
              <div className={styles.tfErrorMsg}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 4V6.5M6 8H6.01M10.5 6C10.5 8.76142 8.26142 11 5.5 11C2.73858 11 0.5 8.76142 0.5 6C0.5 3.23858 2.73858 1 5.5 1C8.26142 1 10.5 3.23858 10.5 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {errors.role}
              </div>
            )}
          </>
        );

      case 4:
        return (
          <div className={styles.photoSection}>
            <div className={styles.photoAvatarWrap}>
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
            <p className={styles.photoHelper}>Personalize your waitlist profile</p>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === TOTAL_FORM_STEPS;
  const progressPercent = ((currentStep - 1) / (TOTAL_FORM_STEPS - 1)) * 100;

  return (
    <>
      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className={styles.questionScreen}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.32, 0, 0.18, 1] }}
        >
          {/* Step number */}
          <div className={styles.qNumber}>
            <span>{String(currentStep).padStart(2, "0")}</span>
            <span className={styles.qNumberArrow}>→</span>
          </div>

          {/* Question */}
          <h2 className={styles.qTitle}>{getStepTitle()}</h2>
          <p className={styles.qSubtitle}>{getStepSubtitle()}</p>

          {/* Input */}
          {renderInput()}

          {/* OK button + Enter hint */}
          <div className={styles.tfActions}>
            <button
              type="button"
              className={styles.okBtn}
              onClick={isLastStep ? onSubmit : onNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.okBtnSpinner} />
              ) : isLastStep ? (
                "Join Waitlist →"
              ) : (
                <>
                  OK
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
            {!isLastStep && (
              <span className={styles.enterHint}>
                press <span className={styles.enterKey}>Enter ↵</span>
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back button fixed at bottom */}
      {currentStep > 1 && (
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M6.5 2L3.5 5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      )}
    </>
  );
}
