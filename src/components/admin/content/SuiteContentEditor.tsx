import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2, Video } from 'lucide-react';
import { suites } from '@/data/suites';
import { useSiteContent } from '@/hooks/useSiteContent';
import { uploadContentAsset } from '@/lib/content-manager';

const SuiteContentEditor = () => {
    const { content, save, isSaving } = useSiteContent();
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, suiteId: string, type: 'header' | 'walkthrough' = 'header') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadKey = `${suiteId}-${type}`;
        setUploadingId(uploadKey);

        try {
            const timestamp = Date.now();
            const ext = file.name.split('.').pop();
            const path = `content/suites/${suiteId}/${type}-${timestamp}.${ext}`;

            const publicUrl = await uploadContentAsset(file, path);

            if (publicUrl) {
                const newContent = { ...content };

                if (!newContent.suites[suiteId]) {
                    newContent.suites[suiteId] = { headerVideo: null };
                }

                if (type === 'header') {
                    newContent.suites[suiteId].headerVideo = publicUrl;
                } else if (type === 'walkthrough') {
                    newContent.suites[suiteId].walkthroughVideo = publicUrl;
                }

                await save(newContent);
            }
        } catch (error) {
            console.error("Error uploading suite asset:", error);
            alert("Failed to upload video. Please try again.");
        } finally {
            setUploadingId(null);
        }
    };

    // Define media configurations per suite
    const suiteMediaConfig: Record<string, { slots: Array<{ type: 'header' | 'walkthrough', label: string, hint: string, color: string }> }> = {
        'flo-os': {
            slots: [
                { type: 'walkthrough', label: 'Walkthrough Video', hint: 'Displayed in the Flo OS expanded view modal.', color: 'blue-400' }
            ]
        },
        'studio': {
            slots: [
                { type: 'header', label: 'Header Video', hint: 'Background video at the top of the Studio page.', color: 'flo-orange' }
            ]
        },
        'marketing': {
            slots: [
                { type: 'header', label: 'Header Video', hint: 'Background video at the top of the Marketing page.', color: 'flo-orange' }
            ]
        },
        'dev': {
            slots: [
                { type: 'header', label: 'Header Video', hint: 'Background video at the top of the Dev page.', color: 'flo-orange' }
            ]
        },
        'connex': {
            slots: [
                { type: 'header', label: 'Header Video', hint: 'Background video at the top of the Connex page.', color: 'flo-orange' }
            ]
        },
    };

    // Only show suites that have defined media slots
    const activeSuites = suites.filter(s => Object.keys(suiteMediaConfig).includes(s.id));

    const VideoUploadSlot = ({ suiteId, slot }: { suiteId: string, slot: { type: 'header' | 'walkthrough', label: string, hint: string, color: string } }) => {
        const suiteContent = content.suites[suiteId] || {};
        const videoUrl = slot.type === 'header' ? suiteContent.headerVideo : suiteContent.walkthroughVideo;
        const uploadKey = `${suiteId}-${slot.type}`;
        const isUploading = uploadingId === uploadKey;

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Video className={`w-3 h-3 text-${slot.color}`} />
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
                    <div className={`
                        relative h-32 w-full rounded-lg border-2 border-dashed transition-all overflow-hidden
                        ${videoUrl
                            ? 'border-white/20 bg-black'
                            : `border-white/10 bg-white/5 hover:border-${slot.color}/50 hover:bg-${slot.color}/5`
                        }
                    `}>
                        {videoUrl ? (
                            <video
                                src={videoUrl}
                                className="w-full h-full object-cover opacity-50"
                                muted
                                loop
                                onMouseOver={e => e.currentTarget.play()}
                                onMouseOut={e => e.currentTarget.pause()}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                <Upload className="w-6 h-6 mb-2" />
                                <span className="text-xs">
                                    {isUploading ? 'Uploading...' : `Upload ${slot.label}`}
                                </span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                                <Loader2 className="w-6 h-6 text-flo-orange animate-spin" />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, suiteId, slot.type)}
                            disabled={!!uploadingId}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </div>
                </div>

                <p className="text-xs text-white/40">{slot.hint}</p>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Suite Media Assets</h2>
                    <p className="text-sm text-white/60">Manage videos displayed on each tile's expanded view</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {activeSuites.map((suite) => {
                    const config = suiteMediaConfig[suite.id];
                    if (!config) return null;

                    return (
                        <div key={suite.id} className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6 hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{suite.title}</h3>
                                    <p className="text-sm text-white/50">{suite.tagline}</p>
                                </div>
                                <div className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/40">
                                    ID: {suite.id}
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            <div className={`grid grid-cols-1 ${config.slots.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                                {config.slots.map((slot, idx) => (
                                    <VideoUploadSlot key={idx} suiteId={suite.id} slot={slot} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuiteContentEditor;

