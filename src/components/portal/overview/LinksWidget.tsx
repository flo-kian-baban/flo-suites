'use client';

import { Link as LinkIcon, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DashboardCard from '../DashboardCard';

interface LinkSummary {
    id: string;
    name: string;
    url: string;
    type: 'landing_page' | 'website';
}

interface LinksWidgetProps {
    links: LinkSummary[];
    clientSlug: string;
}

export default function LinksWidget({ links, clientSlug }: LinksWidgetProps) {
    return (
        <DashboardCard delay={0.3} className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <LinkIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Quick Links</h3>
                </div>
                <Link
                    href={`/portal/client/${clientSlug}/landing-pages`}
                    className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="flex-1 space-y-2">
                {links.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                        <p className="text-xs text-white/30">No links available.</p>
                    </div>
                ) : (
                    links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg hover:shadow-blue-500/5 transition-all group duration-200"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                    <LinkIcon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </p>
                                    <p className="text-[10px] text-white/30 truncate group-hover:text-white/50 transition-colors">
                                        {link.url}
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </a>
                    ))
                )}
            </div>
        </DashboardCard>
    );
}

