'use client';

/**
 * Media & Content Manager - Admin page for managing site assets
 * 
 * Tiles:
 * - Offers (Flo OS, Funnel Builder, Media Marketing): Header/walkthrough videos
 * - Studio: Showcase videos and reel clips
 * - Marketing: Blog posts with inline editing
 * - Development: Case studies with inline editing
 */

import { useState } from 'react';
import { ChevronDown, Video, Film, Play, FileText, LayoutTemplate, Upload, Loader2, Check, CheckCircle2 } from 'lucide-react';
import { suites } from '@/data/suites';
import { useSiteContent } from '@/hooks/useSiteContent';
import { uploadContentAsset } from '@/lib/content-manager';
import PostList from '@/components/admin/cms/PostList';

// Studio showcase step definitions
const showcaseSteps = [
    { id: 'capture', step: '01', label: 'Capture', poster: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
    { id: 'cut', step: '02', label: 'Cut', poster: 'linear-gradient(135deg, #0f3460 0%, #533483 50%, #e94560 100%)' },
    { id: 'deploy', step: '03', label: 'Deploy', poster: 'linear-gradient(135deg, #e94560 0%, #F1592D 50%, #ff7d55 100%)' }
] as const;

const reelSlots = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Tile configuration - what each tile manages
type TileType = 'offer' | 'studio' | 'blog' | 'case-study';

interface TileConfig {
    id: string;
    title: string;
    tagline: string;
    type: TileType;
    icon: typeof Video;
    color: string;
}

const tiles: TileConfig[] = [
    { id: 'flo-os', title: 'Flo OS', tagline: 'Operating system for agencies', type: 'offer', icon: Video, color: 'text-flo-orange' },
    { id: 'Funnel Builder', title: 'Funnel Builder', tagline: 'Conversion-focused funnels', type: 'offer', icon: Video, color: 'text-flo-orange' },
    { id: 'media-marketing', title: 'Media Marketing', tagline: 'Full-service media campaigns', type: 'offer', icon: Video, color: 'text-flo-orange' },
    { id: 'studio', title: 'Studio', tagline: 'Video production & content', type: 'studio', icon: Film, color: 'text-purple-400' },
    { id: 'marketing', title: 'Marketing', tagline: 'Strategic marketing content', type: 'blog', icon: FileText, color: 'text-blue-400' },
    { id: 'dev', title: 'Development', tagline: 'Technical case studies', type: 'case-study', icon: LayoutTemplate, color: 'text-emerald-400' },
];

export default function AssetManagerPage() {
    const [openTile, setOpenTile] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);


    const { content, save, isSaving } = useSiteContent();

    const toggleTile = (tileId: string) => {
        setOpenTile(openTile === tileId ? null : tileId);
    };

    // Upload handlers
    const handleHeaderVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tileId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(`${tileId}-header`);
        const path = `content/suites/${tileId}/header-${Date.now()}.mp4`;

        try {
            const publicUrl = await uploadContentAsset(file, path);
            if (publicUrl) {
                const newContent = { ...content };
                if (!newContent.suites[tileId]) newContent.suites[tileId] = {};
                newContent.suites[tileId].headerVideo = publicUrl;
                await save(newContent);
            }
        } finally {
            setUploadingId(null);
        }
    };

    const handleShowcaseUpload = async (e: React.ChangeEvent<HTMLInputElement>, stepId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(`showcase-${stepId}`);
        const path = `studio/showcase/${stepId}-${Date.now()}.mp4`;

        try {
            const publicUrl = await uploadContentAsset(file, path);
            if (publicUrl) {
                const newContent = { ...content };
                newContent.studio.showcase[stepId] = publicUrl;
                await save(newContent);
            }
        } finally {
            setUploadingId(null);
        }
    };

    const handleReelUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(`reel-${slotIndex}`);
        const path = `studio/reels/reel-${slotIndex}-${Date.now()}.mp4`;

        try {
            const publicUrl = await uploadContentAsset(file, path);
            if (publicUrl) {
                const newContent = { ...content };
                newContent.studio.reels[slotIndex - 1].videoUrl = publicUrl;
                await save(newContent);
            }
        } finally {
            setUploadingId(null);
        }
    };



    // Render content based on tile type
    const renderTileContent = (tile: TileConfig) => {
        switch (tile.type) {
            case 'offer':
                const videoUrl = content.suites[tile.id]?.headerVideo;
                const isUploading = uploadingId === `${tile.id}-header`;
                return (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Video className="w-4 h-4 text-flo-orange" />
                            Header Video
                        </div>
                        <div className="relative group">
                            <div className={`relative h-40 w-full max-w-md rounded-xl border-2 border-dashed transition-all overflow-hidden ${videoUrl ? 'border-white/20 bg-black' : 'border-white/10 bg-white/5 hover:border-flo-orange/50'}`}>
                                {videoUrl ? (
                                    <video src={videoUrl} className="w-full h-full object-cover opacity-60" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Click to upload header video</span>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-flo-orange animate-spin" />
                                    </div>
                                )}
                                <input type="file" accept="video/*" onChange={(e) => handleHeaderVideoUpload(e, tile.id)} disabled={!!uploadingId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                            {videoUrl && (
                                <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                            )}
                        </div>
                    </div>
                );

            case 'studio':
                return (
                    <div className="p-6 space-y-8">
                        {/* Showcase Videos */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Film className="w-4 h-4 text-purple-400" />
                                Showcase Videos (3-Step Process)
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {showcaseSteps.map((step) => {
                                    const currentUrl = content.studio.showcase[step.id];
                                    const isUploading = uploadingId === `showcase-${step.id}`;
                                    return (
                                        <div key={step.id} className="relative rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 aspect-[3/4] group">
                                            <div className="absolute inset-0" style={{ background: step.poster }} />
                                            {currentUrl && <video src={currentUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" muted playsInline loop />}
                                            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Step {step.step}</span>
                                                <h4 className="text-sm font-bold text-white">{step.label}</h4>
                                            </div>
                                            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity ${currentUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                                <label className="cursor-pointer">
                                                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleShowcaseUpload(e, step.id)} disabled={isUploading} />
                                                    <div className="w-10 h-10 rounded-full bg-flo-orange flex items-center justify-center">
                                                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Upload className="w-5 h-5 text-white" />}
                                                    </div>
                                                </label>
                                            </div>
                                            {currentUrl && !isUploading && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reels */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Play className="w-4 h-4 text-pink-400" />
                                Reels Grid (Vertical Videos)
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {reelSlots.map((slotNum) => {
                                    const reel = content.studio.reels[slotNum - 1];
                                    const currentUrl = reel?.videoUrl;
                                    const isUploading = uploadingId === `reel-${slotNum}`;
                                    return (
                                        <div key={slotNum} className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/5 aspect-[9/16] group">
                                            {currentUrl ? (
                                                <video src={currentUrl} className="absolute inset-0 w-full h-full object-cover" muted playsInline loop />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                                    <span className="text-xs font-bold">{slotNum}</span>
                                                </div>
                                            )}
                                            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity ${currentUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                                <label className="cursor-pointer">
                                                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleReelUpload(e, slotNum)} disabled={isUploading} />
                                                    <div className="w-8 h-8 rounded-full bg-flo-orange/80 flex items-center justify-center">
                                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Upload className="w-4 h-4 text-white" />}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            case 'blog':
                return (
                    <div className="p-6">
                        <PostList type="blog" />
                    </div>
                );

            case 'case-study':
                return (
                    <div className="p-6">
                        <PostList type="case_study" />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
                <p className="text-white/50 mt-1">Manage all media assets and content for each tile</p>
            </div>

            {/* Tile Accordions */}
            <div className="space-y-3">
                {tiles.map((tile) => {
                    const isOpen = openTile === tile.id;
                    const Icon = tile.icon;

                    return (
                        <div key={tile.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleTile(tile.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${tile.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-white">{tile.title}</h3>
                                        <p className="text-sm text-white/40">{tile.tagline}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Accordion Content */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-white/5">
                                    {renderTileContent(tile)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
