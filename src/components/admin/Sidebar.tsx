'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Image,
    Layers,
    Users,
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        label: 'Clients',
        href: '/admin/clients',
        icon: <Users className="w-5 h-5" />,
    },
    {
        label: 'Applications',
        href: '/admin/applications',
        icon: <Layers className="w-5 h-5" />,
    },
    {
        label: 'Content Manager',
        href: '/admin/media',
        icon: <Image className="w-5 h-5" />,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(href);
    };

    return (
        <aside className="w-[280px] h-full flex flex-col border-r border-white/[0.06] bg-[#0a0a0a] relative z-20">
            {/* Brand Header — aligned with Topbar height (h-20) */}
            <div className="h-20 flex items-center px-8 border-b border-white/[0.06]">
                <Link href="/admin" className="group">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-10 w-auto object-contain brightness-0 invert group-hover:drop-shadow-[0_0_12px_rgba(241,89,45,0.5)] transition-all duration-300"
                    />
                </Link>
            </div>

            {/* Section Label — Bolder & Spaced */}
            <div className="px-8 pt-8 pb-3">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">Menu</span>
            </div>

            {/* Navigation — Larger & Spaced */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300
                                ${active
                                    ? 'text-white bg-white/[0.05]'
                                    : 'text-white/50 hover:text-white/90 hover:bg-white/[0.03]'
                                }
                            `}
                        >
                            {/* Active Indicator — Bolder */}
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-flo-orange rounded-r-full shadow-[0_0_10px_rgba(241,89,45,0.6)]" />
                            )}

                            {/* Icon — Slightly larger */}
                            <span className={`
                                transition-all duration-300
                                ${active ? 'text-flo-orange scale-105' : 'group-hover:text-white/80'}
                            `}>
                                {item.icon}
                            </span>

                            {/* Label */}
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer — Bolder padding */}
            <div className="p-6 border-t border-white/[0.06]">
                <div className="px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-4 group hover:border-white/[0.08] transition-all duration-300 cursor-default">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-flo-orange to-flo-orange-dark flex items-center justify-center text-[11px] font-bold text-white shadow-lg group-hover:shadow-[0_4px_12px_rgba(241,89,45,0.3)] transition-all duration-300">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-white/90 group-hover:text-flo-orange transition-colors leading-none mb-0.5">Admin User</span>
                        <span className="text-[11px] text-white/30 font-medium">Super Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
