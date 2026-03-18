"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";
import { SendIcon } from "@/components/ui/send";
import styles from "./Waitlist.module.css";

interface WaitlistSuccessProps {
  formData: {
    name: string;
    email: string;
    role: string;
    imageUrl: string | null;
  };
  imagePreview: string | null;
  referralLink: string;
  referralCount?: number;
  copied: boolean;
  onCopyLink: () => void;
  onShareTwitter: () => void;
  onShareWhatsApp: () => void;
  onShareLinkedIn: () => void;
}

const DEFAULT_AVATAR =
  "https://api.dicebear.com/9.x/glass/svg?flip=true&backgroundColor=4747eb,4762eb,477eeb,4799eb,47b4eb,47d0eb,47eb47,47eb62,47eb7e,47eb99,47ebb4,47ebd0,47ebeb,6247eb,62eb47,7e47eb,7eeb47,9947eb,99eb47,b447eb,b4eb47,d047eb,d0eb47,eb4747,eb4762,eb477e,eb4799,47ebd0,eb47eb,eb6247,eb7e47,eb9947,ebb447,ebd047,ebeb47,transparent&seed=User";

export default function WaitlistSuccess({
  formData,
  imagePreview,
  referralLink,
  referralCount = 0,
  copied,
  onCopyLink,
  onShareTwitter,
  onShareWhatsApp,
  onShareLinkedIn,
}: WaitlistSuccessProps) {
  const [isShareExpanded, setIsShareExpanded] = useState(true);

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "student": return "Student";
      case "teacher": return "Teacher";
      case "institution": return "Institution";
      default: return "Member";
    }
  };

  const displayImage = imagePreview || DEFAULT_AVATAR;
  const fullName = formData.name || "New Member";
  const roleTitle = getRoleTitle(formData.role);
  const handle = formData.email
    ? formData.email.split("@")[0].toLowerCase()
    : "vedmember";

  return (
    <motion.div
      className={styles.successScreen}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0, 0.18, 1] }}
    >
      <p className={styles.successEyebrow}>— You&apos;re in</p>
      <h2 className={styles.successTitle}>You&apos;re on the list!</h2>
      <p className={styles.successSub}>
        {referralCount > 0
          ? `You were referred by ${referralCount} person${referralCount > 1 ? "s" : ""}. Share your link to climb the queue.`
          : "Spot #1 secured. We\u2019ll notify you when it\u2019s your turn."}
      </p>

      <div className={styles.cardWrap} style={{ width: "85%", maxWidth: 420 }}>
        <ProfileCard
          name={fullName}
          title={roleTitle}
          handle={handle}
          avatarUrl={displayImage}
          status="Waitlist Confirmed"
          innerGradient="linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)"
          behindGlowEnabled={true}
          behindGlowColor="rgba(125, 190, 255, 0.67)"
          behindGlowSize="50%"
          showUserInfo={true}
        />
      </div>

      <AnimatePresence mode="wait">
        {isShareExpanded ? (
          <motion.div
            className={`${styles.shareBox} ${styles.shareNotification}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.32, 0, 0.18, 1] }}
          >
            <button
              className={styles.shareCloseBtn}
              onClick={() => setIsShareExpanded(false)}
              aria-label="Close share section"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h4 className={styles.shareTitle}>Skip the line</h4>
            <p className={styles.shareSub}>
              Share your unique link. For every friend who joins, you move up{" "}
              <strong>5 spots</strong>.
            </p>

            <div className={styles.referralBox}>
              <span className={styles.referralUrl}>{referralLink}</span>
              <button className={styles.copyBtn} onClick={onCopyLink}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className={styles.socialGrid}>
              <button className={styles.socialBtn} onClick={onShareTwitter}>
                <div className={styles.socialIcon} style={{ background: "#000000" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className={styles.socialName}>Twitter</span>
              </button>

              <button className={styles.socialBtn} onClick={onShareLinkedIn}>
                <div className={styles.socialIcon} style={{ background: "#0077B5" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className={styles.socialName}>LinkedIn</span>
              </button>

              <button className={styles.socialBtn} onClick={onShareWhatsApp}>
                <div className={styles.socialIcon} style={{ background: "#25D366" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className={styles.socialName}>WhatsApp</span>
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.button
            className={styles.shareToggleBtn}
            onClick={() => setIsShareExpanded(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label="Open share section"
          >
            <SendIcon size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
