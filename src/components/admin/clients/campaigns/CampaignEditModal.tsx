'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Campaign, CampaignPayload, CampaignStatus, CampaignObjective } from '@/lib/campaigns';

interface CampaignEditModalProps {
    campaign: Campaign;
    onClose: () => void;
    onSave: (id: string, payload: Partial<CampaignPayload>) => void;
}

const STATUSES: CampaignStatus[] = ['draft', 'active', 'paused', 'completed'];
const OBJECTIVES: CampaignObjective[] = ['leads', 'bookings', 'awareness', 'other'];

export default function CampaignEditModal({ campaign, onClose, onSave }: CampaignEditModalProps) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<CampaignStatus>('draft');
    const [objective, setObjective] = useState('');
    const [offer, setOffer] = useState('');
    const [targetingSummary, setTargetingSummary] = useState('');
    const [targetingReason, setTargetingReason] = useState('');
    const [targetingLocation, setTargetingLocation] = useState('');
    const [messagingPillars, setMessagingPillars] = useState('');
    const [exclusions, setExclusions] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [internalNotes, setInternalNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(campaign.name);
        setStatus(campaign.status);
        setObjective(campaign.objective || '');
        setOffer(campaign.offer || '');
        setTargetingSummary(campaign.targeting_summary);
        setTargetingReason(campaign.targeting_reason || '');
        setTargetingLocation(campaign.targeting_location || '');
        setMessagingPillars(campaign.messaging_pillars || '');
        setExclusions(campaign.exclusions || '');
        setStartDate(campaign.start_date || '');
        setEndDate(campaign.end_date || '');
        setInternalNotes(campaign.internal_notes || '');
    }, [campaign]);

    const canSave = name.trim() && targetingSummary.trim();

    const handleSubmit = async () => {
        if (!canSave) return;
        setSaving(true);
        try {
            onSave(campaign.id, {
                name: name.trim(),
                status,
                objective: objective || null,
                offer: offer || null,
                targeting_summary: targetingSummary.trim(),
                targeting_reason: targetingReason || null,
                targeting_location: targetingLocation || null,
                messaging_pillars: messagingPillars || null,
                exclusions: exclusions || null,
                start_date: startDate || null,
                end_date: endDate || null,
                internal_notes: internalNotes || null,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="fixed -inset-10 z-[100] bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-2xl bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
                        <h2 className="text-base font-semibold text-white">Edit Campaign</h2>
                        <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5 overflow-y-auto">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Campaign Name *</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Status + Objective row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Status</label>
                                <div className="flex gap-1">
                                    {STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`flex-1 px-1.5 py-2 text-[11px] font-medium rounded-lg border transition-all capitalize ${status === s
                                                    ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                                    : 'border-white/[0.06] text-white/25 hover:text-white/50'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Objective</label>
                                <div className="flex gap-1">
                                    {OBJECTIVES.map((o) => (
                                        <button
                                            key={o}
                                            type="button"
                                            onClick={() => setObjective(objective === o ? '' : o)}
                                            className={`flex-1 px-1.5 py-2 text-[11px] font-medium rounded-lg border transition-all capitalize ${objective === o
                                                    ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                                    : 'border-white/[0.06] text-white/25 hover:text-white/50'
                                                }`}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Offer */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Offer</label>
                            <input
                                value={offer}
                                onChange={(e) => setOffer(e.target.value)}
                                placeholder="e.g. Free consultation, 20% off"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Divider: Targeting */}
                        <div className="pt-2">
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Targeting</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Targeting Summary *</label>
                            <textarea
                                value={targetingSummary}
                                onChange={(e) => setTargetingSummary(e.target.value)}
                                rows={3}
                                placeholder="Who are we targeting?"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Location</label>
                                <input
                                    value={targetingLocation}
                                    onChange={(e) => setTargetingLocation(e.target.value)}
                                    placeholder="Neighborhoods / radius / city"
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Reason / Hypothesis</label>
                                <input
                                    value={targetingReason}
                                    onChange={(e) => setTargetingReason(e.target.value)}
                                    placeholder="Why this audience?"
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Exclusions</label>
                            <input
                                value={exclusions}
                                onChange={(e) => setExclusions(e.target.value)}
                                placeholder="Who to exclude"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Divider: Messaging */}
                        <div className="pt-2">
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Messaging</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Messaging Pillars</label>
                            <textarea
                                value={messagingPillars}
                                onChange={(e) => setMessagingPillars(e.target.value)}
                                rows={4}
                                placeholder={"• Key message 1\n• Key message 2\n• Key message 3"}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors resize-none"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Internal Notes */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Internal Notes</label>
                            <textarea
                                value={internalNotes}
                                onChange={(e) => setInternalNotes(e.target.value)}
                                rows={2}
                                placeholder="Notes for the team..."
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/[0.06] p-5 flex justify-end gap-3 shrink-0 bg-[#111] rounded-b-2xl">
                        <button onClick={onClose} className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSave || saving}
                            className="px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
