'use client';

import { useState } from 'react';
import { ChevronDown, Megaphone, Target, MapPin, MessageSquare, AlertCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Campaign {
    id: string;
    name: string;
    status: string;
    objective: string | null;
    offer: string | null;
    targetingSummary: string;
    targetingLocation: string | null;
    messagingPillars: string | null;
    startDate: string | null;
    endDate: string | null;
}

export default function CampaignAccordion({ campaign }: { campaign: Campaign }) {
    const [isOpen, setIsOpen] = useState(false);

    const isActive = campaign.status === 'active';

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/10 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg mt-1 ${isActive
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-white/[0.05] text-white/40'
                        }`}>
                        <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1.5">{campaign.name}</h3>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border ${isActive
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-white/[0.05] text-white/40 border-white/[0.05]'
                                }`}>
                                {campaign.status}
                            </span>
                            {campaign.startDate && (
                                <span className="flex items-center gap-1.5 text-xs text-white/40">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(campaign.startDate).toLocaleDateString()}
                                    {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 border-t border-white/[0.06]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                {/* Strategy */}
                                <div className="space-y-6">
                                    {campaign.objective && (
                                        <div>
                                            <h4 className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                                                <Target className="w-3.5 h-3.5" /> Objective
                                            </h4>
                                            <p className="text-sm text-white bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                                                {campaign.objective}
                                            </p>
                                        </div>
                                    )}

                                    {campaign.offer && (
                                        <div>
                                            <h4 className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                                                <AlertCircle className="w-3.5 h-3.5" /> Core Offer
                                            </h4>
                                            <p className="text-sm text-white bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                                                {campaign.offer}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Targeting & Messaging */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                                            <MapPin className="w-3.5 h-3.5" /> Targeting
                                        </h4>
                                        <div className="bg-white/[0.02] p-3 rounded-lg border border-white/[0.04] space-y-2">
                                            <p className="text-sm text-white font-medium">{campaign.targetingSummary}</p>
                                            {campaign.targetingLocation && (
                                                <p className="text-xs text-white/60 flex items-center gap-1.5 pt-1 border-t border-white/[0.04]">
                                                    <MapPin className="w-3 h-3" /> {campaign.targetingLocation}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {campaign.messagingPillars && (
                                        <div>
                                            <h4 className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                                                <MessageSquare className="w-3.5 h-3.5" /> Messaging Pillars
                                            </h4>
                                            <p className="text-sm text-white/80 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04] whitespace-pre-wrap">
                                                {campaign.messagingPillars}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
