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

                    {/* Logo */}
                    <img
                        src="/assets/FLO.png"
                        alt="Flo"
                        className="mobile-blocker-logo"
                    />

                    {/* Message */}
                    <h1 className="mobile-blocker-title">
                        Big decisions aren&apos;t made on small screens.
                    </h1>
                </div>
            </div>

            {/* Desktop content — hidden on mobile */}
            <div className="desktop-only">
                {children}
            </div>
        </>
    );
}
