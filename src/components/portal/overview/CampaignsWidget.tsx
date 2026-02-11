'use client';

import { Megaphone, ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import DashboardCard from '../DashboardCard';

interface CampaignSummary {
    id: string;
    name: string;
    objective: string | null;
    targeting: string;
    status: string;
}

interface CampaignsWidgetProps {
    campaigns: CampaignSummary[];
    clientSlug: string;
}

export default function CampaignsWidget({ campaigns, clientSlug }: CampaignsWidgetProps) {
    return (
        <DashboardCard delay={0.2} className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Megaphone className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Live Campaigns</h3>
                </div>
                <Link
                    href={`/portal/client/${clientSlug}/campaigns`}
                    className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="flex-1 space-y-3">
                {campaigns.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                        <p className="text-xs text-white/30">No active campaigns.</p>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <Link
                            key={campaign.id}
                            href={`/portal/client/${clientSlug}/campaigns`}
                            className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200 group/item"
                        >
                            <h4 className="text-sm font-semibold text-white mb-2 group-hover/item:text-purple-300 transition-colors">{campaign.name}</h4>

                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${campaign.status === 'active'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_8px_-2px_rgba(74,222,128,0.3)]'
                                    : 'bg-white/[0.05] text-white/40 border-white/[0.05]'
                                    }`}>
                                    {campaign.status}
                                </span>
                                {campaign.objective && (
                                    <span className="text-[10px] text-white/50 flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {campaign.objective}
                                    </span>
                                )}
                            </div>

                            <p className="text-[10px] text-white/40 line-clamp-1 border-t border-white/[0.04] pt-2">
                                {campaign.targeting}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </DashboardCard>
    );
}

