'use client';

import { useState, useEffect } from 'react';
import {
    ChevronDown, ChevronRight, Pencil, Trash2,
    Plus, X, Star, Video, Globe, MapPin, Target,
    MessageSquare, Calendar
} from 'lucide-react';
import {
    Campaign, CampaignMediaLink, CampaignLandingPageLink,
} from '@/lib/campaigns';
import {
    getAdminCampaignMedia, getAdminCampaignLandingPages,
    detachAdminMedia, detachAdminLandingPage, attachAdminMedia, attachAdminLandingPages,
    setAdminPrimaryLandingPage,
} from '@/actions/admin-campaigns';
import MediaPickerModal from './MediaPickerModal';
import LandingPagePickerModal from './LandingPagePickerModal';

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-white/[0.06] text-white/50',
    active: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

interface CampaignAccordionProps {
    campaign: Campaign;
    clientId: string;
    onEdit: (campaign: Campaign) => void;
    onDelete: (id: string) => void;
}

export default function CampaignAccordion({ campaign, clientId, onEdit, onDelete }: CampaignAccordionProps) {
    const [open, setOpen] = useState(false);
    const [mediaLinks, setMediaLinks] = useState<CampaignMediaLink[]>([]);
    const [pageLinks, setPageLinks] = useState<CampaignLandingPageLink[]>([]);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [showPagePicker, setShowPagePicker] = useState(false);
    const [loadedAssets, setLoadedAssets] = useState(false);

    // Load assets when expanded
    useEffect(() => {
        if (open && !loadedAssets) {
            loadAssets();
        }
    }, [open]);

    const loadAssets = async () => {
        try {
            const [media, pages] = await Promise.all([
                getAdminCampaignMedia(campaign.id),
                getAdminCampaignLandingPages(campaign.id),
            ]);
            setMediaLinks(media);
            setPageLinks(pages);
            setLoadedAssets(true);
        } catch { /* ignore */ }
    };

    const handleDetachMedia = async (mediaItemId: string) => {
        await detachAdminMedia(campaign.id, mediaItemId);
        setMediaLinks((prev) => prev.filter((m) => m.media_item_id !== mediaItemId));
    };

    const handleDetachPage = async (landingPageId: string) => {
        await detachAdminLandingPage(campaign.id, landingPageId);
        setPageLinks((prev) => prev.filter((p) => p.landing_page_id !== landingPageId));
    };

    const handleAttachMedia = async (ids: string[]) => {
        await attachAdminMedia(campaign.id, ids);
        setShowMediaPicker(false);
        // Reload
        const media = await getAdminCampaignMedia(campaign.id);
        setMediaLinks(media);
    };

    const handleAttachPages = async (ids: string[]) => {
        await attachAdminLandingPages(campaign.id, ids);
        setShowPagePicker(false);
        const pages = await getAdminCampaignLandingPages(campaign.id);
        setPageLinks(pages);
    };

    const handleSetPrimary = async (landingPageId: string) => {
        await setAdminPrimaryLandingPage(campaign.id, landingPageId);
        setPageLinks((prev) =>
            prev.map((p) => ({ ...p, is_primary: p.landing_page_id === landingPageId }))
        );
    };

    const updatedStr = new Date(campaign.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <>
            <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01] transition-all">
                {/* Header */}
                <div
                    onClick={() => setOpen(!open)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(!open); }}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                    {open ? (
                        <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-white truncate">{campaign.name}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[campaign.status]}`}>
                                {campaign.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            {campaign.objective && (
                                <span className="text-[11px] text-white/30 capitalize">
                                    <Target className="w-3 h-3 inline mr-0.5" />{campaign.objective}
                                </span>
                            )}
                            <span className="text-[11px] text-white/20">Updated {updatedStr}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(campaign)}
                            className="p-2 text-white/15 hover:text-white/60 transition-colors rounded-lg hover:bg-white/[0.04]"
                            title="Edit campaign"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => { if (confirm('Delete this campaign?')) onDelete(campaign.id); }}
                            className="p-2 text-white/15 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            title="Delete campaign"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Expanded Body */}
                {open && (
                    <div className="border-t border-white/[0.04] p-5 space-y-6">
                        {/* Targeting Section */}
                        <section>
                            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" /> Targeting
                            </h4>
                            <div className="space-y-2.5">
                                <Field label="Summary" value={campaign.targeting_summary} />
                                <Field label="Location" value={campaign.targeting_location} />
                                <Field label="Reason" value={campaign.targeting_reason} />
                                <Field label="Exclusions" value={campaign.exclusions} />
                            </div>
                        </section>

                        {/* Messaging Section */}
                        <section>
                            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Messaging
                            </h4>
                            <div className="space-y-2.5">
                                {campaign.messaging_pillars && (
                                    <div>
                                        <span className="text-[11px] text-white/30 block mb-1">Pillars</span>
                                        <p className="text-sm text-white/70 whitespace-pre-line">{campaign.messaging_pillars}</p>
                                    </div>
                                )}
                                <Field label="Offer" value={campaign.offer} />
                                <Field label="Objective" value={campaign.objective} />
                                {(campaign.start_date || campaign.end_date) && (
                                    <div className="flex items-center gap-4 text-sm text-white/50">
                                        <Calendar className="w-3.5 h-3.5 text-white/30" />
                                        {campaign.start_date && <span>{campaign.start_date}</span>}
                                        {campaign.start_date && campaign.end_date && <span className="text-white/20">→</span>}
                                        {campaign.end_date && <span>{campaign.end_date}</span>}
                                    </div>
                                )}
                                <Field label="Notes" value={campaign.internal_notes} />
                            </div>
                        </section>

                        {/* Assets Section */}
                        <section>
                            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5" /> Assets Attached
                            </h4>

                            {/* Media */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-white/30 font-medium">Media Items ({mediaLinks.length})</span>
                                    <button
                                        onClick={() => setShowMediaPicker(true)}
                                        className="flex items-center gap-1 text-[11px] text-flo-orange hover:text-flo-orange-light transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> Add Media
                                    </button>
                                </div>
                                {mediaLinks.length === 0 ? (
                                    <p className="text-xs text-white/20 italic">No media attached</p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {mediaLinks.map((m) => (
                                            <span
                                                key={m.id}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60"
                                            >
                                                <Video className="w-3 h-3 text-white/30" />
                                                {m.media_title || 'Untitled'}
                                                <span className="text-[10px] text-white/20 capitalize">({m.media_type})</span>
                                                <button
                                                    onClick={() => handleDetachMedia(m.media_item_id)}
                                                    className="ml-0.5 text-white/20 hover:text-red-400 transition-colors"
                                                    title="Remove"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Landing Pages */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-white/30 font-medium">Landing Pages ({pageLinks.length})</span>
                                    <button
                                        onClick={() => setShowPagePicker(true)}
                                        className="flex items-center gap-1 text-[11px] text-flo-orange hover:text-flo-orange-light transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> Add Landing Page
                                    </button>
                                </div>
                                {pageLinks.length === 0 ? (
                                    <p className="text-xs text-white/20 italic">No landing pages attached</p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {pageLinks.map((p) => (
                                            <span
                                                key={p.id}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60"
                                            >
                                                <Globe className="w-3 h-3 text-white/30" />
                                                {p.page_name || 'Untitled'}
                                                {p.is_primary && (
                                                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                                        Primary
                                                    </span>
                                                )}
                                                {!p.is_primary && (
                                                    <button
                                                        onClick={() => handleSetPrimary(p.landing_page_id)}
                                                        className="text-white/15 hover:text-amber-400 transition-colors"
                                                        title="Set as primary"
                                                    >
                                                        <Star className="w-3 h-3" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDetachPage(p.landing_page_id)}
                                                    className="ml-0.5 text-white/20 hover:text-red-400 transition-colors"
                                                    title="Remove"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Picker modals */}
            {showMediaPicker && (
                <MediaPickerModal
                    clientId={clientId}
                    excludeIds={mediaLinks.map((m) => m.media_item_id)}
                    onClose={() => setShowMediaPicker(false)}
                    onConfirm={handleAttachMedia}
                />
            )}
            {showPagePicker && (
                <LandingPagePickerModal
                    clientId={clientId}
                    excludeIds={pageLinks.map((p) => p.landing_page_id)}
                    onClose={() => setShowPagePicker(false)}
                    onConfirm={handleAttachPages}
                />
            )}
        </>
    );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div>
            <span className="text-[11px] text-white/30 block mb-0.5">{label}</span>
            <p className="text-sm text-white/70">{value}</p>
        </div>
    );
}
