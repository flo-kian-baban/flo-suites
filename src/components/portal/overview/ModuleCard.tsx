import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
    title: string;
    status: string;
    icon: React.ReactNode;
    href: string;
    badgeCount?: number;
    className?: string; // For bento grid spanning if needed
}

export default function ModuleCard({ title, status, icon, href, badgeCount, className }: ModuleCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col justify-between p-8 rounded-[24px] bg-[#111111] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:-translate-y-[2px] hover:shadow-2xl hover:shadow-black/50",
                className
            )}
        >
            <div className="flex justify-between items-start mb-6">
                {/* Creative Icon Container: Double layer effect */}
                <div className="relative group/icon">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-[#1A1A1A] p-4 rounded-2xl text-white group-hover:text-flo-orange transition-colors duration-300 border border-white/10 shadow-[inner_0_1px_0_rgba(255,255,255,0.05)]">
                        {icon}
                    </div>
                </div>

                {typeof badgeCount === 'number' && badgeCount > 0 && (
                    <span className="flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-bold text-flo-orange border border-flo-orange/20 rounded-full bg-flo-orange/5 shadow-sm shadow-flo-orange/10">
                        {badgeCount}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-flo-orange/90 transition-colors tracking-tight">{title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed font-light">{status}</p>
                </div>

            </div>

            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </Link>
    );
}
