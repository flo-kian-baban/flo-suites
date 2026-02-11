'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Video, FileText, Camera, Megaphone, Image, Loader2, CheckCircle2 } from 'lucide-react';
import { MediaItemType } from '@/lib/client-media';
import { createAdminMediaItem, addAdminMediaAssets } from '@/actions/admin-media';
import { supabase, BUCKET_NAME } from '@/lib/supabaseClient';

const MEDIA_TYPES: { value: MediaItemType; label: string; icon: React.ElementType }[] = [
    { value: 'reel', label: 'Reel', icon: Video },
    { value: 'infographic', label: 'Infographic', icon: FileText },
    { value: 'photo', label: 'Photo', icon: Camera },
    { value: 'ad', label: 'Ad', icon: Megaphone },
    { value: 'other', label: 'Other', icon: Image },
];

interface MediaPostModalProps {
    clientId: string;
    clientSlug: string;
    onClose: () => void;
    onCreated: () => void;
}

export default function MediaPostModal({ clientId, clientSlug, onClose, onCreated }: MediaPostModalProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<MediaItemType>('reel');
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<Record<number, number>>({});
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async () => {
        if (!title.trim()) { setError('Title is required'); return; }
        if (files.length === 0) { setError('Upload at least one file'); return; }

        setError('');
        setUploading(true);

        try {
            // Create media item
            const mediaItemId = await createAdminMediaItem(clientId, title.trim(), type);

            // Upload files
            const newAssets: any[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const storagePath = `clients/${clientSlug}/media/${mediaItemId}/${sanitizedName}`;

                setProgress((prev) => ({ ...prev, [i]: 30 }));

                // Upload to storage (using client for now, assuming storage policies allow)
                const { error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(storagePath, file, { upsert: true, contentType: file.type });

                if (uploadError) throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);

                setProgress((prev) => ({ ...prev, [i]: 70 }));

                newAssets.push({
                    storage_bucket: BUCKET_NAME,
                    storage_path: storagePath,
                    mime_type: file.type || null,
                    created_at: new Date().toISOString(),
                });

                setProgress((prev) => ({ ...prev, [i]: 100 }));
            }

            // Update DB with assets using secure action
            await addAdminMediaAssets(mediaItemId, newAssets);

            onCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setUploading(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-lg font-semibold text-white">Post New Content</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-white/40 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. February Promo Reel"
                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs font-medium text-white/40 mb-2">Type</label>
                        <div className="flex flex-wrap gap-2">
                            {MEDIA_TYPES.map((t) => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.value}
                                        onClick={() => setType(t.value)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${type === t.value
                                            ? 'bg-flo-orange/15 text-flo-orange border-flo-orange/30'
                                            : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/60'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="block text-xs font-medium text-white/40 mb-2">Files</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="video/*,image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {files.length === 0 ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center gap-2 py-10 border-2 border-dashed border-white/[0.08] rounded-xl text-white/30 hover:text-white/50 hover:border-white/15 transition-all"
                            >
                                <Upload className="w-8 h-8" />
                                <span className="text-sm font-medium">Click to choose files</span>
                                <span className="text-xs">Videos and images accepted</span>
                            </button>
                        ) : (
                            <div className="space-y-2">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                        <Video className="w-4 h-4 text-white/30 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white/60 truncate">{file.name}</p>
                                            <p className="text-[10px] text-white/25">{formatSize(file.size)}</p>
                                        </div>
                                        {uploading && progress[idx] !== undefined ? (
                                            progress[idx] >= 100 ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Loader2 className="w-4 h-4 text-flo-orange animate-spin" />
                                            )
                                        ) : (
                                            <button onClick={() => removeFile(idx)} className="p-1 text-white/20 hover:text-white/50">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!uploading && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full text-center py-2 text-xs text-white/30 hover:text-white/50 transition-all"
                                    >
                                        + Add more files
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-flo-orange to-flo-orange-light text-white text-sm font-semibold rounded-xl shadow-lg shadow-flo-orange/20 disabled:opacity-50 transition-all"
                    >
                        {uploading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                        ) : (
                            <><Upload className="w-4 h-4" /> Post Content</>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
