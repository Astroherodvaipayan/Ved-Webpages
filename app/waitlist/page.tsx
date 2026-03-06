"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";
import "../../components/ProfileCard.module.css";

interface WaitlistFormData {
    firstName: string;
    lastName: string;
    email: string;
    role: "student" | "teacher" | "institution" | "";
    imageUrl: string | null;
}

type WaitlistFormErrors = Partial<Record<keyof WaitlistFormData, string>>;

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1E3A8A&textColor=ffffff";

export default function WaitlistPage() {
    const [formData, setFormData] = useState<WaitlistFormData>({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        imageUrl: null,
    });
    const [errors, setErrors] = useState<WaitlistFormErrors>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: WaitlistFormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Please complete this required field.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Please complete this required field.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.role) {
            newErrors.role = "Please complete this required field.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        // Skip API call if flag is false (demo mode)
        if (process.env.NEXT_PUBLIC_ENABLE_WAITLIST_API !== 'true') {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsSubmitting(false);
            setIsSubmitted(true);
            return;
        }

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    role: formData.role,
                    avatarUrl: imagePreview,
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const data = await response.json();
                setErrors({ email: data.error || 'Something went wrong' });
            }
        } catch (error) {
            setErrors({ email: 'Failed to submit. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getRoleTitle = (role: string) => {
        switch (role) {
            case "student": return "Student";
            case "teacher": return "Teacher";
            case "institution": return "Institution";
            default: return "Member";
        }
    };

    return (
        <main className="min-h-screen bg-[#FAFBFF] flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Visual/Branding - Hidden on mobile, shown on lg+ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-[#0A0F2E] flex-col justify-between p-6 xl:p-12 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/40 to-[#0A0F2E]/80 mix-blend-multiply" />

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="relative w-48 xl:w-64 aspect-square opacity-80">
                        <Image
                            src="/logo.png"
                            alt="Ved AI Logo"
                            fill
                            className="object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        />
                    </div>
                </div>

                <div className="relative z-10 text-white/70 text-xs xl:text-sm font-light">
                    © {new Date().getFullYear()} Ved AI. Enabling a billion geniuses.
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 bg-white relative h-screen lg:h-auto">
                {/* Mobile Logo - Shown only on mobile */}
                <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/logo.png"
                            alt="Ved AI Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Back Link */}
                <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
                    <Link href="/" className="text-xs sm:text-sm font-medium text-[#6B7AA1] hover:text-[#1E3A8A] transition-colors flex items-center gap-2">
                        ← Back
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto py-16 lg:py-0 overflow-y-auto max-h-full">
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#0A0F2E] mb-6 lg:mb-10 tracking-tight" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
                                    Join the Waitlist
                                </h1>

                                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-8" noValidate>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        {/* First Name */}
                                        <div className="relative group">
                                            <label htmlFor="firstName" className="block text-xs sm:text-sm text-[#2D3A6B] mb-1.5 sm:mb-2 font-medium">
                                                First name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                placeholder="eg. John"
                                                className={`w-full bg-transparent border-b outline-none py-1.5 sm:py-2 text-sm sm:text-base text-[#0A0F2E] transition-colors placeholder:text-[#B0B8D1] focus:border-[#1E3A8A] ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                            )}
                                        </div>

                                        {/* Last Name */}
                                        <div className="relative group">
                                            <label htmlFor="lastName" className="block text-xs sm:text-sm text-[#2D3A6B] mb-1.5 sm:mb-2 font-medium">
                                                Last name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                placeholder="eg. Doe"
                                                className="w-full bg-transparent border-b border-gray-200 outline-none py-1.5 sm:py-2 text-sm sm:text-base text-[#0A0F2E] transition-colors placeholder:text-[#B0B8D1] focus:border-[#1E3A8A]"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <label htmlFor="email" className="block text-xs sm:text-sm text-[#2D3A6B] mb-1.5 sm:mb-2 font-medium">
                                            Work Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="eg. john.doe@company.com"
                                                className={`w-full bg-transparent border-b outline-none py-1.5 sm:py-2 text-sm sm:text-base text-[#0A0F2E] transition-colors placeholder:text-[#B0B8D1] focus:border-[#1E3A8A] pr-8 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                            />
                                            {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 absolute right-0 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Role Dropdown */}
                                    <div className="relative group">
                                        <label htmlFor="role" className="block text-xs sm:text-sm text-[#2D3A6B] mb-1.5 sm:mb-2 font-medium">
                                            Which best describes you? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="role"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value as WaitlistFormData["role"] })}
                                                className={`w-full bg-transparent border-b outline-none py-1.5 sm:py-2 text-sm sm:text-base text-[#0A0F2E] appearance-none transition-colors focus:border-[#1E3A8A] cursor-pointer ${errors.role ? 'border-red-500' : 'border-gray-200'} ${formData.role === '' ? 'text-[#B0B8D1]' : ''}`}
                                            >
                                                <option value="" disabled>Please Select</option>
                                                <option value="student" className="text-[#0A0F2E]">Student</option>
                                                <option value="teacher" className="text-[#0A0F2E]">Teacher</option>
                                                <option value="institution" className="text-[#0A0F2E]">Institution</option>
                                            </select>
                                            <svg className="w-3 sm:w-4 h-3 sm:h-4 text-[#6B7AA1] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {errors.role && (
                                            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                                        )}
                                    </div>

                                    {/* Profile Photo */}
                                    <div className="relative group">
                                        <label className="block text-xs sm:text-sm text-[#2D3A6B] mb-2 sm:mb-3 font-medium">
                                            Profile Photo (Optional)
                                        </label>
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs sm:text-sm font-medium text-[#1E3A8A] hover:text-[#0A0F2E] transition-colors border-b border-transparent hover:border-[#0A0F2E] pb-0.5"
                                            >
                                                {imagePreview ? "Change photo" : "Upload photo"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4 sm:pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1E3A8A] hover:bg-[#0F1F4D] text-white rounded-md transition-all font-semibold tracking-wide text-sm sm:text-base"
                                            style={{ fontFamily: "var(--font-montserrat, sans-serif)", boxShadow: "0 4px 14px rgba(30,58,138,0.2)" }}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>

                                    <p className="text-xs text-[#6B7AA1] leading-relaxed">
                                        By joining, you agree to our Terms of Service and Privacy Policy.
                                        We'll never share your data.
                                    </p>
                                </form>
                            </motion.div>
                        ) : (
                            /* Success State */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full"
                            >
                                <div className="p-4 sm:p-6 lg:p-8 text-center">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#0A0F2E] mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
                                        You&apos;re on the list!
                                    </h3>
                                    <p className="text-[#6B7AA1] text-sm sm:text-base mb-6 sm:mb-8 max-w-sm mx-auto">
                                        We&apos;ve received your request and will be in touch shortly when Ved AI is ready for you.
                                    </p>

                                    <div className="flex justify-center">
                                        <ProfileCard
                                            avatarUrl={imagePreview || DEFAULT_AVATAR}
                                            name={`${formData.firstName} ${formData.lastName}`.trim() || "New Member"}
                                            title={getRoleTitle(formData.role)}
                                            handle={formData.email.split('@')[0].toLowerCase()}
                                            status="Waitlist Confirmed"
                                            innerGradient="linear-gradient(145deg, #60496e8c 0%, #71C4FF44 100%)"
                                            behindGlowEnabled={true}
                                            behindGlowColor="rgba(125, 190, 255, 0.67)"
                                            behindGlowSize="50%"
                                            showUserInfo={true}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
