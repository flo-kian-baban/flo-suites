'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Image,
    FolderKanban,
    Megaphone,
    PanelTop,
    FileText,
    LogOut
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

interface PortalSidebarProps {
    clientSlug: string;
}

export default function PortalSidebar({ clientSlug }: PortalSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const isActive = (path: string) => {
        if (path === '') {
            return pathname === `/portal/client/${clientSlug}`;
        }
        return pathname.startsWith(`/portal/client/${clientSlug}/${path}`);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/portal/login');
        router.refresh();
    };

    const navItems = [
        { label: 'Overview', icon: LayoutDashboard, path: '' },
        { label: 'Media', icon: Image, path: 'media' },
        { label: 'Projects', icon: FolderKanban, path: 'projects' },
        { label: 'Campaigns', icon: Megaphone, path: 'campaigns' },
        { label: 'Landing Pages', icon: PanelTop, path: 'landing-pages' },
        { label: 'Resources', icon: FileText, path: 'resources' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-black/40 backdrop-blur-xl border-r border-white/[0.08]">
            {/* Logo Area */}
            <div className="px-0 pt-7 mb-6">
                <div className="flex justify-center items-end gap-3 mb-7">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-12 w-auto object-contain brightness-0 invert"
                    />
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.1] border border-white/[0.05] text-[10px] font-semibold text-white/50 uppercase tracking-wider backdrop-blur-sm">
                        Portal
                    </span>
                </div>

                <div className="h-px bg-white/10" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={`/portal/client/${clientSlug}/${item.path}`}
                            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${active
                                ? 'text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                                }`}
                        >
                            {/* Active background glow */}
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-flo-orange/10 to-transparent rounded-xl border border-flo-orange/10" />
                            )}

                            {/* Icon with glow on active */}
                            <div className={`relative z-10 p-1 rounded-lg transition-colors ${active ? 'bg-flo-orange/20 text-flo-orange' : 'bg-transparent text-current group-hover:text-white'}`}>
                                <item.icon className="w-4 h-4" />
                            </div>

                            <span className="relative z-10">{item.label}</span>

                            {/* Active indicator bar */}
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-flo-orange rounded-r-full shadow-[0_0_10px_rgba(241,89,45,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 mx-4 mb-4 border-t border-white/[0.06]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                >
                    <LogOut className="w-4 h-4 group-hover:first-letter:text-red-400 transition-colors" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

