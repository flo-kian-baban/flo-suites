'use client';

import { Menu } from 'lucide-react';

interface PortalTopbarProps {
    clientName: string;
    clientSlug: string;
    logoUrl: string | null;
    userName: string;
    onMobileMenuClick: () => void;
}

export default function PortalTopbar({ clientName, clientSlug, logoUrl, userName, onMobileMenuClick }: PortalTopbarProps) {
    return (
        <header className="h-[105px] flex items-center px-4 lg:px-8 sticky top-0 z-40 transition-all duration-300">
            {/* Backdrop blur layer */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/[0.08] -z-10" />

            <div className="flex items-center gap-6">
                <button
                    onClick={onMobileMenuClick}
                    className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white bg-white/[0.05] rounded-xl"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-5">
                    {logoUrl ? (
                        <div className="relative group">
                            <div className="absolute inset-0 bg-flo-orange/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                                src={logoUrl}
                                alt={clientName}
                                className="relative w-12 h-12 rounded-xl object-cover border border-white/[0.1] shadow-lg"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-flo-orange/20 to-flo-orange/5 flex items-center justify-center text-flo-orange font-bold text-base border border-flo-orange/20 shadow-[0_0_15px_-3px_rgba(241,89,45,0.2)]">
                            {clientName.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold text-white mt-1.5 leading-none tracking-tight">
                            {clientName}
                        </h1>
                        {userName && (
                            <p className="text-xs text-white/40 font-medium">
                                {userName}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
