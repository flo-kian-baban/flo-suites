'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Loader2, Video, Film, Play, Check } from 'lucide-react';
import { suites } from '@/data/suites';
import { useSiteContent } from '@/hooks/useSiteContent';
import { uploadContentAsset } from '@/lib/content-manager';

// Studio showcase step definitions
const showcaseSteps = [
    { id: 'capture', step: '01', label: 'Capture', description: 'Production phase', poster: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
    { id: 'cut', step: '02', label: 'Cut', description: 'Post-production phase', poster: 'linear-gradient(135deg, #0f3460 0%, #533483 50%, #e94560 100%)' },
    { id: 'deploy', step: '03', label: 'Deploy', description: 'Delivery phase', poster: 'linear-gradient(135deg, #e94560 0%, #F1592D 50%, #ff7d55 100%)' }
] as const;

// Reel slot definitions for Studio
const reelSlots = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Define which media slots each suite has
const suiteMediaConfig: Record<string, {
    title: string,
    slots: Array<{ type: 'header' | 'walkthrough', label: string, hint: string }>,
    showcase?: boolean,
    reels?: boolean
}> = {
    'studio': {
        title: 'Studio',
        slots: [],
        showcase: true,
        reels: true
    },
    'flo-os': {
        title: 'Flo OS',
        slots: [{ type: 'header', label: 'Header Video', hint: 'Background video for the Flo OS offer tile.' }]
    },
    'Funnel Builder': {
        title: 'Funnel Builder',
        slots: [{ type: 'header', label: 'Header Video', hint: 'Background video for the Funnel Builder offer tile.' }]
    },
    'media-marketing': {
        title: 'Media Marketing',
        slots: [{ type: 'header', label: 'Header Video', hint: 'Background video for the Media Marketing offer tile.' }]
    },
};

export default function UnifiedMediaEditor() {
    const { content, save, isSaving } = useSiteContent();
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // Generic upload handler
    const handleUpload = async (file: File, path: string, updateFn: (url: string) => void) => {
        try {
            const publicUrl = await uploadContentAsset(file, path);
            if (publicUrl) {
                updateFn(publicUrl);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload. Please try again.");
        }
    };

    // Suite header/walkthrough upload
    const handleSuiteUpload = async (e: React.ChangeEvent<HTMLInputElement>, suiteId: string, type: 'header' | 'walkthrough') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadKey = `${suiteId}-${type}`;
        setUploadingId(uploadKey);

        const timestamp = Date.now();
        const ext = file.name.split('.').pop();
        const path = `content/suites/${suiteId}/${type}-${timestamp}.${ext}`;

        await handleUpload(file, path, async (publicUrl) => {
            const newContent = { ...content };
            if (!newContent.suites[suiteId]) {
                newContent.suites[suiteId] = { headerVideo: null };
            }
            if (type === 'header') {
                newContent.suites[suiteId].headerVideo = publicUrl;
            } else {
                newContent.suites[suiteId].walkthroughVideo = publicUrl;
            }
            await save(newContent);
        });

        setUploadingId(null);
    };

    // Showcase video upload (Studio)
    const handleShowcaseUpload = async (e: React.ChangeEvent<HTMLInputElement>, stepId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(`showcase-${stepId}`);
        const path = `studio/showcase/${stepId}-${Date.now()}.mp4`;

        await handleUpload(file, path, async (publicUrl) => {
            const newContent = { ...content };
            newContent.studio.showcase[stepId] = publicUrl;
            await save(newContent);
        });

        setUploadingId(null);
    };

    // Reel upload (Studio)
    const handleReelUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(`reel-${slotIndex}`);
        const path = `studio/reels/reel-${slotIndex}-${Date.now()}.mp4`;

        await handleUpload(file, path, async (publicUrl) => {
            const newContent = { ...content };
            newContent.studio.reels[slotIndex - 1].videoUrl = publicUrl;
            await save(newContent);
        });

        setUploadingId(null);
    };

    // Get active suites from config
    const activeSuiteIds = Object.keys(suiteMediaConfig);
    const activeSuites = suites.filter(s => activeSuiteIds.includes(s.id));

    return (
        <div className="space-y-8">
            {activeSuites.map((suite) => {
                const config = suiteMediaConfig[suite.id];
                if (!config) return null;

                const suiteContent = content.suites[suite.id] || {};

                return (
                    <div key={suite.id} className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6 hover:border-white/10 transition-colors">
                        {/* Suite Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">{suite.title}</h3>
                                <p className="text-sm text-white/50">{suite.tagline}</p>
                            </div>
                            <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/40">
                                {suite.id}
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* Standard Video Slots (Header/Walkthrough) */}
                        {config.slots.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {config.slots.map((slot, idx) => {
                                    const videoUrl = slot.type === 'header' ? suiteContent.headerVideo : suiteContent.walkthroughVideo;
                                    const uploadKey = `${suite.id}-${slot.type}`;
                                    const isUploading = uploadingId === uploadKey;

                                    return (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                                                    <Video className="w-3 h-3 text-flo-orange" />
                                                    {slot.label}
                                                </label>
                                                {videoUrl && (
                                                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>

                                            <div className="relative group">
                                                <div className={`relative h-32 w-full rounded-lg border-2 border-dashed transition-all overflow-hidden ${videoUrl ? 'border-white/20 bg-black' : 'border-white/10 bg-white/5 hover:border-flo-orange/50'}`}>
                                                    {videoUrl ? (
                                                        <video src={videoUrl} className="w-full h-full object-cover opacity-50" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                                            <Upload className="w-6 h-6 mb-2" />
                                                            <span className="text-xs">{isUploading ? 'Uploading...' : `Upload ${slot.label}`}</span>
                                                        </div>
                                                    )}
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                                                            <Loader2 className="w-6 h-6 text-flo-orange animate-spin" />
                                                        </div>
                                                    )}
                                                    <input type="file" accept="video/*" onChange={(e) => handleSuiteUpload(e, suite.id, slot.type)} disabled={!!uploadingId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-white/40">{slot.hint}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Studio Showcase (3 videos) */}
                        {config.showcase && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Film className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-white/80">Showcase Videos (3-Step Process)</span>
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
                                                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity ${currentUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
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
                        )}

                        {/* Studio Reels (6 vertical videos) */}
                        {config.reels && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4 text-pink-400" />
                                    <span className="text-sm font-medium text-white/80">Reels Grid (Vertical Videos)</span>
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
                        )}
                    </div>
                );
            })}
        </div>
    );
}
