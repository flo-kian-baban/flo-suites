'use client';

import { useState } from 'react';
import PortalSidebar from './PortalSidebar';
import PortalTopbar from './PortalTopbar';
import { PortalAccessProvider } from './PortalAccessProvider';

interface PortalShellProps {
    children: React.ReactNode;
    clientSlug: string;
    clientName: string;
    clientLogo: string | null;
    clientId: string;
    userEmail: string;
    userName: string;
    role: string;
}

export default function PortalShell({
    children,
    clientSlug,
    clientName,
    clientLogo,
    clientId,
    userEmail,
    userName,
    role,
}: PortalShellProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <PortalAccessProvider
            value={{ clientId, clientSlug, userEmail, role }}
        >
            <div className="h-screen w-full overflow-hidden bg-[#0a0a0a] text-white font-sans selection:bg-flo-orange/30 flex flex-col">
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block relative z-30 h-full">
                        <PortalSidebar clientSlug={clientSlug} />
                    </div>

                    {/* Sidebar - Mobile Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            <div
                                className="bg-black/60 backdrop-blur-sm flex-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <div className="w-64 bg-[#0a0a0a] border-r border-white/10 h-full overflow-y-auto">
                                <PortalSidebar clientSlug={clientSlug} />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 h-full">
                        <PortalTopbar
                            clientName={clientName}
                            clientSlug={clientSlug}
                            logoUrl={clientLogo}
                            userName={userName}
                            onMobileMenuClick={() => setIsMobileMenuOpen(true)}
                        />
                        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                            <div className="max-w-7xl mx-auto space-y-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </PortalAccessProvider>
    );
}

