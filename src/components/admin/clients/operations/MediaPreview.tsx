'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, CheckCircle2, XCircle, Clock, Send, Loader2, Trash2,
} from 'lucide-react';
import {
    MediaItemFull, MediaItemStatus, getAssetUrl,
} from '@/lib/client-media';
import {
    getAdminMediaItemById, updateAdminMediaStatus, addAdminMediaComment,
} from '@/actions/admin-media';

const STATUS_CONFIG: Record<MediaItemStatus, { label: string; color: string }> = {
    pending: { label: 'Pending Review', color: 'text-amber-400' },
    approved: { label: 'Approved', color: 'text-emerald-400' },
    declined: { label: 'Declined', color: 'text-red-400' },
};

interface MediaPreviewProps {
    mediaItemId: string;
    onClose: () => void;
}

export default function MediaPreview({ mediaItemId, onClose }: MediaPreviewProps) {
    const [item, setItem] = useState<MediaItemFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAdminMediaItemById(mediaItemId);
            setItem(data);
        } catch (err) {
            console.error('Failed to load media item:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [mediaItemId]);

    const handleStatusChange = async (status: MediaItemStatus) => {
        try {
            await updateAdminMediaStatus(mediaItemId, status);
            load();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            await addAdminMediaComment(mediaItemId, commentText.trim());
            setCommentText('');
            load();
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const isVideo = (mimeType: string | null) =>
        mimeType?.startsWith('video/');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl h-full bg-[#111] border-l border-white/[0.08] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                    <h2 className="text-lg font-semibold text-white truncate">
                        {loading ? 'Loading…' : item?.title || 'Media Preview'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-flo-orange" />
                    </div>
                ) : item ? (
                    <div className="flex-1 overflow-y-auto">
                        {/* Status + Actions */}
                        <div className="px-6 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-white/30 mb-1">Status</p>
                                    <p className={`text-sm font-semibold ${STATUS_CONFIG[item.status].color}`}>
                                        {STATUS_CONFIG[item.status].label}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs text-white/25 mr-2 capitalize">{item.type}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {item.status !== 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange('approved')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                    </button>
                                )}
                                {item.status !== 'declined' && (
                                    <button
                                        onClick={() => handleStatusChange('declined')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                                    >
                                        <XCircle className="w-3.5 h-3.5" /> Decline
                                    </button>
                                )}
                                {item.status !== 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange('pending')}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                                    >
                                        <Clock className="w-3.5 h-3.5" /> Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Assets / Media Player */}
                        <div className="px-6 py-4 border-b border-white/[0.06]">
                            <p className="text-xs font-medium text-white/40 mb-3">
                                Files ({item.assets.length})
                            </p>
                            {item.assets.length === 0 ? (
                                <p className="text-xs text-white/20">No files uploaded</p>
                            ) : (
                                <div className="space-y-3">
                                    {item.assets.map((asset, idx) => {
                                        const url = getAssetUrl(asset.storage_path);
                                        return isVideo(asset.mime_type) ? (
                                            <video
                                                key={asset.storage_path}
                                                src={url}
                                                controls
                                                className="w-full rounded-xl bg-black"
                                            />
                                        ) : (
                                            <img
                                                key={asset.storage_path}
                                                src={url}
                                                alt="Media asset"
                                                className="w-full rounded-xl object-cover"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="px-6 py-4">
                            <p className="text-xs font-medium text-white/40 mb-3">
                                Comments ({item.comments.length})
                            </p>

                            {item.comments.length === 0 ? (
                                <p className="text-xs text-white/20 mb-4">No comments yet</p>
                            ) : (
                                <div className="space-y-3 mb-4">
                                    {item.comments.map((c, idx) => (
                                        <div key={idx} className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                            <p className="text-sm text-white/70">{c.comment}</p>
                                            <p className="text-[10px] text-white/20 mt-1.5">
                                                {new Date(c.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Comment */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                    placeholder="Add a comment…"
                                    className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim() || submittingComment}
                                    className="px-3 py-2.5 bg-flo-orange/15 text-flo-orange rounded-xl hover:bg-flo-orange/25 disabled:opacity-30 transition-all"
                                >
                                    {submittingComment ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                        Media item not found
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
