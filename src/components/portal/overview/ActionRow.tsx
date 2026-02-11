import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ActionRowProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    href: string;
    ctaText?: string;
}

export default function ActionRow({ icon, title, subtitle, href, ctaText = "Open" }: ActionRowProps) {
    return (
        <div className="group flex items-center justify-between p-5 bg-[#111111] border border-white/5 rounded-2xl hover:border-flo-orange/20 hover:bg-[#161616] transition-all duration-200">
            <div className="flex items-center gap-5">
                <div className="bg-[#1A1A1A] p-3 rounded-xl text-white group-hover:text-flo-orange border border-white/5 group-hover:border-flo-orange/10 transition-colors duration-200">
                    {icon}
                </div>
                <div>
                    <h3 className="text-base font-medium text-white group-hover:text-flo-orange/90 transition-colors duration-200 mb-0.5">{title}</h3>
                    <p className="text-xs text-white/40">{subtitle}</p>
                </div>
            </div>

            <Link
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-medium text-white hover:bg-flo-orange hover:text-black hover:border-flo-orange transition-all duration-200 opacity-60 group-hover:opacity-100"
            >
                {ctaText}
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </div>
    );
}
