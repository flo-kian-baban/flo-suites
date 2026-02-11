'use client';

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Mobile Blocker — visible only on small screens */}
            <div className="mobile-blocker">
                <div className="mobile-blocker-content">
                    {/* Ambient glow */}
                    <div className="mobile-blocker-glow mobile-blocker-glow-1" />
                    <div className="mobile-blocker-glow mobile-blocker-glow-2" />

                    {/* Icon */}
                    <div className="mobile-blocker-icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mobile-blocker-svg"
                        >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>

                    {/* Message */}
                    <h1 className="mobile-blocker-title">
                        Big decisions aren&apos;t made on small screens.
                    </h1>
                    <p className="mobile-blocker-subtitle">
                        Open Flo Suites on a desktop or laptop for the full experience.
                    </p>
                </div>
            </div>

            {/* Desktop content — hidden on mobile */}
            <div className="desktop-only">
                {children}
            </div>
        </>
    );
}
