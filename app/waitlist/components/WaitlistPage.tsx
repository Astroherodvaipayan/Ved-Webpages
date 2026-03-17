"use client";

import { useState, useRef, useEffect } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import WaitlistForm from "./WaitlistForm";
import WaitlistSuccess from "./WaitlistSuccess";
import BackgroundController from "@/components/ui/BackgroundController";
import styles from "./Waitlist.module.css";
import "@/components/ProfileCard.module.css";
import disposableDomains from "disposable-email-domains";

const validateEmail = (email: string): { valid: boolean; error?: string } => {
    const domain = email.split('@')[1];
    if (!domain) return { valid: false, error: 'Invalid email address' };

    if (disposableDomains.includes(domain)) {
        return { valid: false, error: 'Temporary emails are not allowed' };
    }

    return { valid: true };
};

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

const TOTAL_STEPS = 4;

export default function WaitlistPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WaitlistFormData>({
        name: "",
        email: "",
        role: "",
        imageUrl: null,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [serverReferralLink, setServerReferralLink] = useState<string | null>(null);
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        setMounted(true);

        // Capture referral code from URL
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            setReferralCode(ref);
        }
    }, []);

    // Use server-generated referral link when available, fallback to client-side
    const referralLink = serverReferralLink || (mounted && formData.email
        ? `${window.location.origin}/waitlist?ref=${formData.email.split('@')[0].toLowerCase()}`
        : mounted ? `${window.location.origin}/waitlist` : '/waitlist');

    const shareToTwitter = () => {
        const text = `I just secured spot #1 on the @VedAI waitlist!\n\nPersonalized AI tutoring for everyone — 98% better learning outcomes.\n\nJoin me: ${referralLink}\n\n#EdTech #AILearning #FutureOfEducation`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToWhatsApp = async () => {
        const text = `I'm on the Ved AI waitlist! 🚀\n\nPersonalized 1-on-1 AI tutoring that improves learning outcomes by 98%.\n\nJoin me: ${referralLink}`;
        const encoded = encodeURIComponent(text);

        // On mobile, try the native app deep link first
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            // whatsapp:// deep link opens the app directly with the share text
            window.location.href = `whatsapp://send?text=${encoded}`;
        } else {
            // On desktop, use web.whatsapp.com
            window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank');
        }
    };

    const shareToLinkedIn = () => {
        const title = `I just joined the Ved AI waitlist!`;
        const summary = `Personalized 1-on-1 AI tutoring that improves learning outcomes by 98%. Ved AI is making world-class tutoring accessible to every learner on Earth. Join me!`;
        const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent('Ved AI')}`;
        window.open(shareUrl, '_blank');
    };

    const copyReferralLink = async () => {
        try {
            await navigator.clipboard.writeText(`I'm on the Ved AI waitlist (#1)!\n\nJoin me in experiencing the future of personalized learning:\n${referralLink}\n\nSee you inside!`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const validateCurrentStep = (): boolean => {
        const newErrors: FormErrors = {};

        switch (currentStep) {
            case 1:
                if (!formData.name.trim()) newErrors.name = "Name is required";
                break;
            case 2:
                if (!formData.email.trim()) newErrors.email = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
                else {
                    const emailValidation = validateEmail(formData.email);
                    if (!emailValidation.valid) newErrors.email = emailValidation.error;
                }
                break;
            case 3:
                if (!formData.role) newErrors.role = "Please select your role";
                break;
            case 4:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(currentStep + 1);
                setErrors({});
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        if (process.env.NEXT_PUBLIC_ENABLE_WAITLIST_API !== 'true') {
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsSubmitting(false);
            setIsSubmitted(true);
            return;
        }

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.name,
                    last_name: "",
                    email: formData.email,
                    role: formData.role,
                    avatarUrl: imagePreview,
                    referralCode: referralCode
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Store server-generated referral link
                if (data.referral_link) {
                    setServerReferralLink(data.referral_link);
                }
                if (data.referral_code) {
                    setReferralCode(data.referral_code);
                }
                setIsSubmitted(true);

                // Fetch referral stats to get count (in case user was referred)
                try {
                    const statsResponse = await fetch(`/api/waitlist/referrals?email=${encodeURIComponent(formData.email)}`);
                    if (statsResponse.ok) {
                        const statsData = await statsResponse.json();
                        if (statsData.referralCount !== undefined) {
                            setReferralCount(statsData.referralCount);
                        }
                    }
                } catch {
                    // Silently fail - referral stats are not critical
                }
            } else {
                setErrors({ email: data.error || 'Something went wrong' });
            }
        } catch {
            setErrors({ email: 'Failed to submit. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFieldChange = (field: keyof WaitlistFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep < TOTAL_STEPS) {
                handleNext();
            } else {
                handleSubmit();
            }
        }
    };

    return (
        <main className={styles.waitlistRoot}>
            <LeftPanel />
            <RightPanel>
                {isSubmitted ? (
                    <WaitlistSuccess
                        formData={formData}
                        imagePreview={imagePreview}
                        referralLink={referralLink}
                        referralCount={referralCount}
                        copied={copied}
                        onCopyLink={copyReferralLink}
                        onShareTwitter={shareToTwitter}
                        onShareWhatsApp={shareToWhatsApp}
                        onShareLinkedIn={shareToLinkedIn}
                    />
                ) : (
                    <WaitlistForm
                        currentStep={currentStep}
                        formData={formData}
                        errors={errors}
                        imagePreview={imagePreview}
                        isSubmitting={isSubmitting}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        onFieldChange={handleFieldChange}
                        onImageUpload={handleImageUpload}
                        onKeyPress={handleKeyPress}
                    />
                )}
            </RightPanel>
        </main>
    );
}
