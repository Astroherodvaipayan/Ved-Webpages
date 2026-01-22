"use client";

import { useEffect } from "react";
import CustomCursor from "./ui/CustomCursor";
import SmoothScroll from "./ui/SmoothScroll";
import Navigation from "./ui/Navigation";
import ScrollProgress from "./ui/ScrollProgress";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    // Scroll to top on page load/reload
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <ScrollProgress />
            <CustomCursor />
            <Navigation />
            <SmoothScroll>{children}</SmoothScroll>
        </>
    );
}
