"use client";

import CustomCursor from "./ui/CustomCursor";
import SmoothScroll from "./ui/SmoothScroll";
import Navigation from "./ui/Navigation";
import ScrollProgress from "./ui/ScrollProgress";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress />
            <CustomCursor />
            <Navigation />
            <SmoothScroll>{children}</SmoothScroll>
        </>
    );
}
