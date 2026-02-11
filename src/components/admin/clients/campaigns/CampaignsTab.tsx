'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Megaphone } from 'lucide-react';
import {
    Campaign, CampaignStatus, CampaignPayload,
} from '@/lib/campaigns';
import {
    getAdminCampaigns, createAdminCampaign, updateAdminCampaign, deleteAdminCampaign,
} from '@/actions/admin-campaigns';
import CampaignAccordion from './CampaignAccordion';
import CampaignCreateModal from './CampaignCreateModal';
import CampaignEditModal from './CampaignEditModal';

const STATUS_TABS: { key: CampaignStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: 'Draft' },
    { key: 'active', label: 'Active' },
    { key: 'paused', label: 'Paused' },
    { key: 'completed', label: 'Completed' },
];

interface CampaignsTabProps {
    clientId: string;
}

export default function CampaignsTab({ clientId }: CampaignsTabProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAdminCampaigns(clientId, search || undefined, statusFilter);
            setCampaigns(data);
        } catch { /* ignore */ }
        setLoading(false);
    }, [clientId, search, statusFilter]);

    useEffect(() => {
        load();
    }, [load]);

    const handleCreate = async (payload: CampaignPayload) => {
        await createAdminCampaign(clientId, payload);
        setShowCreate(false);
        load();
    };

    const handleUpdate = async (id: string, payload: Partial<CampaignPayload>) => {
        await updateAdminCampaign(id, payload);
        setEditingCampaign(null);
        load();
    };

    const handleDelete = async (id: string) => {
        await deleteAdminCampaign(id);
        load();
    };

    return (
        <div className="space-y-6">
            {/* Top Row */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-flo-orange/30 transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex gap-1">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all capitalize ${statusFilter === tab.key
                                ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                : 'border-white/[0.06] text-white/30 hover:text-white/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* New Campaign */}
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </button>
            </div>

            {/* Campaign List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 border-2 border-flo-orange/30 border-t-flo-orange rounded-full animate-spin" />
                </div>
            ) : campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <Megaphone className="w-7 h-7 text-white/15" />
                    </div>
                    <h3 className="text-lg font-semibold text-white/50 mb-2">No Campaigns Yet</h3>
                    <p className="text-sm text-white/25 max-w-sm mb-6">
                        Create your first marketing campaign to start organizing strategy, targeting, and asset assignments.
                    </p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Campaign
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {campaigns.map((campaign) => (
                        <CampaignAccordion
                            key={campaign.id}
                            campaign={campaign}
                            clientId={clientId}
                            onEdit={setEditingCampaign}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showCreate && (
                <CampaignCreateModal
                    onClose={() => setShowCreate(false)}
                    onCreate={handleCreate}
                />
            )}
            {editingCampaign && (
                <CampaignEditModal
                    campaign={editingCampaign}
                    onClose={() => setEditingCampaign(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}
