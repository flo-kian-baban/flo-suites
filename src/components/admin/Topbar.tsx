'use client';

import { useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import { Search, LogOut } from 'lucide-react';

export default function Topbar() {
    const { logout } = useAdminAuth();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-20 flex items-center justify-between px-10 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-10 transition-all duration-300">
            {/* Left — Empty Space for Cleaner Look */}
            <div className="flex items-center gap-4">
                {/* Removed Page Title to be minimal */}
            </div>

            {/* Center — Search (Bolder & Wider) */}
            <div className="flex-1 max-w-lg mx-12 group">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-flo-orange/80 transition-colors duration-300" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-11 pr-5 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl
                            text-[14px] font-medium text-white placeholder-white/20
                            focus:outline-none focus:bg-white/[0.05] focus:border-flo-orange/30 focus:ring-1 focus:ring-flo-orange/25
                            transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-6">
                <button
                    onClick={logout}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] transition-all duration-300 group"
                >
                    <span className="text-[13px] font-semibold tracking-wide">Sign Out</span>
                    <LogOut className="w-4 h-4 group-hover:text-red-400/90 transition-colors" />
                </button>
            </div>
        </header>
    );
}
