
import React, { useState } from 'react';
import { Upload, Film, Loader2, Check, Clapperboard } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { uploadContentAsset } from '@/lib/content-manager';

export default function ReelsContentEditor() {
    const { content, save, isSaving } = useSiteContent();
    const [uploadingId, setUploadingId] = useState<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, reelId: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(reelId);

        try {
            const path = `studio/reels/reel-${reelId}-${Date.now()}.mp4`;
            const publicUrl = await uploadContentAsset(file, path);

            if (publicUrl) {
                const newContent = { ...content };
                const reelIndex = newContent.studio.reels.findIndex(r => r.id === reelId);

                if (reelIndex !== -1) {
                    newContent.studio.reels[reelIndex].videoUrl = publicUrl;
                    await save(newContent);
                }
            }
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Clapperboard className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Studio Reels</h2>
                    <p className="text-sm text-white/40">Manage the 8 highlight reels</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {content.studio.reels.map((reel) => {
                    const isUploading = uploadingId === reel.id;

                    return (
                        <div key={reel.id} className="group relative rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 aspect-[9/16]">
                            {/* Background/Poster */}
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                style={{ background: reel.poster }}
                            />

                            {/* Video */}
                            {reel.videoUrl && (
                                <video
                                    src={reel.videoUrl}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    muted
                                    playsInline
                                    loop
                                />
                            )}

                            {/* Info Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                <h4 className="text-sm font-bold text-white truncate">{reel.title}</h4>
                                <span className="text-[10px] text-white/60">{reel.duration}</span>
                            </div>

                            {/* Edit Interaction */}
                            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${reel.videoUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <label className="cursor-pointer flex flex-col items-center group/btn">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, reel.id)}
                                        disabled={isUploading || isSaving}
                                    />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${reel.videoUrl
                                            ? 'bg-white/10 hover:bg-flo-orange text-white'
                                            : 'bg-flo-orange text-white shadow-lg'
                                        }`}>
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium text-white/80 mt-2">
                                        {isUploading ? '...' : reel.videoUrl ? 'Replace' : 'Upload'}
                                    </span>
                                </label>
                            </div>

                            {/* Success Check */}
                            {reel.videoUrl && !isUploading && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
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
