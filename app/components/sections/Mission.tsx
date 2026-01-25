"use client";

import TeacherScrollSequence from "../ui/TeacherScrollSequence";

export default function Mission() {
    return (
        <section id="mission" className="relative w-full py-40 text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[150px]" />
            </div>

            {/* Scrollable Teacher Sequence - Video Effect */}
            <div className="relative w-full">
                <TeacherScrollSequence />
            </div>
        </section>
    );
}
