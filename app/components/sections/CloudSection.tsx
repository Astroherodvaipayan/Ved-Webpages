"use client";

// Dedicated section for cloud transition - creates space between Hero and ProductShowcase
export default function CloudSection() {
    return (
        <section
            id="cloud-transition"
            className="relative w-full h-[120vh] overflow-hidden"
        >
            {/* This section provides breathing room for the cloud reveal effect */}
            {/* The clouds float up through this section as user scrolls */}

            {/* Optional subtle text or empty space */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Can add transitional content here if needed */}
            </div>
        </section>
    );
}
