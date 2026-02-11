
import React, { useRef, useState } from 'react';
import { Upload, Play, Film, Loader2, Check } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { uploadContentAsset } from '@/lib/content-manager';

// Reusing the structure from StudioShowcase
const showcaseSteps = [
    {
        id: 'capture',
        step: '01',
        label: 'Capture',
        title: 'Production',
        description: 'From concept to camera. We capture the raw material that becomes your brand story.',
        poster: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        id: 'cut',
        step: '02',
        label: 'Cut',
        title: 'Post-Production',
        description: 'Precision editing, color grading, and motion design that elevates every frame.',
        poster: 'linear-gradient(135deg, #0f3460 0%, #533483 50%, #e94560 100%)',
    },
    {
        id: 'deploy',
        step: '03',
        label: 'Deploy',
        title: 'Delivery',
        description: 'Multi-format export and seamless handoff across all platforms and channels.',
        poster: 'linear-gradient(135deg, #e94560 0%, #F1592D 50%, #ff7d55 100%)',
    }
] as const;

export default function StudioContentEditor() {
    const { content, save, isSaving } = useSiteContent();
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, stepId: 'capture' | 'cut' | 'deploy') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(stepId);

        try {
            // Upload to a dedicated path
            const path = `studio/showcase/${stepId}-${Date.now()}.mp4`;
            const publicUrl = await uploadContentAsset(file, path);

            if (publicUrl) {
                // Update content
                const newContent = { ...content };
                newContent.studio.showcase[stepId] = publicUrl;
                await save(newContent);
            }
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Studio Showcase</h2>
                    <p className="text-sm text-white/40">Manage the 3-step process videos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {showcaseSteps.map((step) => {
                    const currentUrl = content.studio.showcase[step.id];
                    const isUploading = uploadingId === step.id;

                    return (
                        <div key={step.id} className="group relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 aspect-[9/16] md:aspect-[3/4]">
                            {/* Background Preview */}
                            <div
                                className="absolute inset-0 transition-all duration-500"
                                style={{ background: step.poster }}
                            />

                            {/* Video Preview if exists */}
                            {currentUrl && (
                                <video
                                    src={currentUrl}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    muted
                                    playsInline
                                    loop
                                />
                            )}

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                                <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-white mb-2 self-start">
                                    Step {step.step}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-1">{step.label}</h3>
                                <p className="text-xs text-white/60 line-clamp-2">{step.description}</p>
                            </div>

                            {/* Edit Overlay (Always visible on hover or if empty) */}
                            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${currentUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer group/btn">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, step.id)}
                                        disabled={isUploading || isSaving}
                                    />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${currentUrl
                                            ? 'bg-white/10 hover:bg-flo-orange text-white'
                                            : 'bg-flo-orange text-white shadow-[0_0_20px_rgba(241,89,45,0.4)] hover:scale-110'
                                        }`}>
                                        {isUploading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : currentUrl ? (
                                            <Upload className="w-6 h-6" />
                                        ) : (
                                            <Upload className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className="block text-center text-xs font-medium text-white/80 mt-3 group-hover/btn:text-white transition-colors">
                                        {isUploading ? 'Uploading...' : currentUrl ? 'Replace Video' : 'Upload Video'}
                                    </span>
                                </label>
                            </div>

                            {/* Success Indicator */}
                            {currentUrl && !isUploading && (
                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
