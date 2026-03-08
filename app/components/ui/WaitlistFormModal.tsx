"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientButton from "./GradientButton";
import PixelCard from "@/components/PixelCard";
import ProfileCard from "@/components/ProfileCard";

interface WaitlistFormData {
    name: string;
    email: string;
    role: "student" | "teacher" | "institution";
    imageUrl: string | null;
}

interface WaitlistFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WaitlistFormData) => void;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=1E3A8A&textColor=ffffff";

export default function WaitlistFormModal({ isOpen, onClose, onSubmit }: WaitlistFormModalProps) {
    const [formData, setFormData] = useState<WaitlistFormData>({
        name: "",
        email: "",
        role: "student",
        imageUrl: null,
    });
    const [errors, setErrors] = useState<Partial<WaitlistFormData>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: Partial<WaitlistFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitted(true);
            onSubmit({
                ...formData,
                imageUrl: imagePreview || DEFAULT_AVATAR,
            });
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

    const handleClose = () => {
        setFormData({ name: "", email: "", role: "student", imageUrl: null });
        setImagePreview(null);
        setErrors({});
        setIsSubmitted(false);
        onClose();
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[#0A0F2E]/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6 overflow-y-auto"
                        onClick={(e) => e.target === e.currentTarget && handleClose()}
                    >
                        {!isSubmitted ? (
                            <div
                                className="w-full max-w-md rounded-2xl overflow-y-auto max-h-[90vh]"
                                style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    border: "1px solid rgba(30, 58, 138, 0.1)",
                                    boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.25)",
                                }}
                            >
                                {/* Header */}
                                <div
                                    className="px-6 py-4 border-b text-center"
                                    style={{ borderColor: "rgba(30, 58, 138, 0.1)" }}
                                >
                                    <h3
                                        className="text-xl font-bold"
                                        style={{
                                            fontFamily: "var(--font-montserrat)",
                                            color: "#0A0F2E",
                                        }}
                                    >
                                        Join the Waitlist
                                    </h3>
                                    <p style={{ color: "#6B7AA1", fontSize: "0.875rem" }}>
                                        Be the first to experience Ved AI
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: "#2D3A6B" }}
                                        >
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border transition-all outline-none focus:ring-2"
                                            style={{
                                                background: "#FAFBFF",
                                                borderColor: errors.name ? "#ef4444" : "rgba(30, 58, 138, 0.2)",
                                                color: "#0A0F2E",
                                            }}
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: "#2D3A6B" }}
                                        >
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border transition-all outline-none focus:ring-2"
                                            style={{
                                                background: "#FAFBFF",
                                                borderColor: errors.email ? "#ef4444" : "rgba(30, 58, 138, 0.2)",
                                                color: "#0A0F2E",
                                            }}
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Role Dropdown */}
                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: "#2D3A6B" }}
                                        >
                                            I am a *
                                        </label>
                                        <select
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as WaitlistFormData["role"] })}
                                            className="w-full px-4 py-2.5 rounded-lg border transition-all outline-none focus:ring-2"
                                            style={{
                                                background: "#FAFBFF",
                                                borderColor: "rgba(30, 58, 138, 0.2)",
                                                color: "#0A0F2E",
                                            }}
                                        >
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="institution">Institution</option>
                                        </select>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-1"
                                            style={{ color: "#2D3A6B" }}
                                        >
                                            Profile Photo (Optional)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                                                style={{
                                                    background: "linear-gradient(135deg, #1E3A8A 0%, #D4AF37 100%)",
                                                    border: "2px solid rgba(255, 255, 255, 0.3)",
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="w-8 h-8 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
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
                                                className="text-sm px-4 py-2 rounded-lg transition-colors"
                                                style={{
                                                    background: "rgba(30, 58, 138, 0.1)",
                                                    color: "#1E3A8A",
                                                }}
                                            >
                                                {imagePreview ? "Change Photo" : "Upload Photo"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <GradientButton
                                            label="Join Waitlist"
                                            onClick={() => { }}
                                            className="w-full justify-center"
                                            style={{ display: "flex" }}
                                        />
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* Success - Show PixelCard + ProfileCard */
                            <div className="w-full max-w-md">
                                <PixelCard
                                    variant="blue"
                                    gap={10}
                                    speed={25}
                                    colors="#e0f2fe,#7dd3fc,#0ea5e9"
                                    noFocus={false}
                                    className="w-full"
                                >
                                    <div
                                        className="p-6 text-center"
                                        style={{
                                            background: "rgba(255, 255, 255, 0.9)",
                                            borderRadius: "1rem",
                                        }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{
                                                background: "linear-gradient(135deg, #1E3A8A 0%, #D4AF37 100%)",
                                            }}
                                        >
                                            <svg
                                                className="w-10 h-10 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </motion.div>

                                        <h3
                                            className="text-2xl font-bold mb-2"
                                            style={{
                                                fontFamily: "var(--font-montserrat)",
                                                color: "#0A0F2E",
                                            }}
                                        >
                                            You&apos;re on the list!
                                        </h3>
                                        <p style={{ color: "#6B7AA1", marginBottom: "1.5rem" }}>
                                            We&apos;ll notify you when Ved AI is ready
                                        </p>

                                        <ProfileCard
                                            avatarUrl={imagePreview || DEFAULT_AVATAR}
                                            name={formData.name}
                                            title={getRoleTitle(formData.role)}
                                            handle={formData.email}
                                            status="Waitlist Confirmed"
                                            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                                            behindGlowEnabled={false}
                                            behindGlowColor="rgba(125, 190, 255, 0.67)"
                                            behindGlowSize="50%"
                                            showUserInfo={false}
                                            className="mx-auto"
                                        />

                                        <button
                                            onClick={handleClose}
                                            className="mt-6 text-sm underline"
                                            style={{ color: "#6B7AA1" }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </PixelCard>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
