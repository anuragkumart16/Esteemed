"use client";

import { useEffect, useState } from "react";
import DesktopWarning from "./DesktopWarning";

export default function MobileGuard({ children }: { children: React.ReactNode }) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            // Check if screen width is greater than or equal to 768px (md breakpoint)
            setIsDesktop(window.innerWidth >= 768);
        };

        // Check initially
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Use CSS to hide/show based on media query for immediate effect (SSR safe)
    // But also use JS state to prevent interaction/logic if possible.
    // Since we can't block initial render on server, we use CSS classes on the wrapper.

    return (
        <>
            {/* Show warning only on desktop (md and up) */}
            <div className="hidden md:block fixed inset-0 z-[100] bg-zinc-950">
                <DesktopWarning />
            </div>

            {/* Hide content on desktop */}
            <div className="md:hidden w-full min-h-screen">
                {children}
            </div>
        </>
    );
}
