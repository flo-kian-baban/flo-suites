'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CampaignPayload, CampaignStatus, CampaignObjective } from '@/lib/campaigns';

interface CampaignCreateModalProps {
    onClose: () => void;
    onCreate: (payload: CampaignPayload) => void;
}

const STATUSES: CampaignStatus[] = ['draft', 'active', 'paused', 'completed'];
const OBJECTIVES: CampaignObjective[] = ['leads', 'bookings', 'awareness', 'other'];

export default function CampaignCreateModal({ onClose, onCreate }: CampaignCreateModalProps) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<CampaignStatus>('draft');
    const [objective, setObjective] = useState('');
    const [offer, setOffer] = useState('');
    const [targetingSummary, setTargetingSummary] = useState('');
    const [saving, setSaving] = useState(false);

    const canSave = name.trim() && targetingSummary.trim();

    const handleSubmit = async () => {
        if (!canSave) return;
        setSaving(true);
        try {
            onCreate({
                name: name.trim(),
                status,
                objective: objective || null,
                offer: offer || null,
                targeting_summary: targetingSummary.trim(),
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="fixed -inset-10 z-[100] bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-lg bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
                        <h2 className="text-base font-semibold text-white">New Campaign</h2>
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
                                placeholder="e.g. Spring Lead Gen 2026"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Status</label>
                            <div className="flex gap-1.5">
                                {STATUSES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg border transition-all capitalize ${status === s
                                                ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                                : 'border-white/[0.06] text-white/25 hover:text-white/50'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Objective */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Objective</label>
                            <div className="flex gap-1.5">
                                {OBJECTIVES.map((o) => (
                                    <button
                                        key={o}
                                        type="button"
                                        onClick={() => setObjective(objective === o ? '' : o)}
                                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg border transition-all capitalize ${objective === o
                                                ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                                : 'border-white/[0.06] text-white/25 hover:text-white/50'
                                            }`}
                                    >
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Offer */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Offer</label>
                            <input
                                value={offer}
                                onChange={(e) => setOffer(e.target.value)}
                                placeholder="e.g. Free consultation, 20% off first visit"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Targeting Summary */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Targeting Summary *</label>
                            <textarea
                                value={targetingSummary}
                                onChange={(e) => setTargetingSummary(e.target.value)}
                                rows={3}
                                placeholder="Describe who we're targeting..."
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
                            {saving ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
