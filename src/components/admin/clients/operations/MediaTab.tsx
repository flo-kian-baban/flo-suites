'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, Plus, Video, Image, Camera, Megaphone, FileText,
    CheckCircle2, XCircle, Clock, Trash2, Eye, MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MediaItem, MediaItemStatus, MediaItemType, getMediaItems,
    updateMediaStatus, deleteMediaItem,
} from '@/lib/client-media';
import MediaPostModal from './MediaPostModal';
import MediaPreview from './MediaPreview';

const TYPE_ICONS: Record<MediaItemType, React.ElementType> = {
    reel: Video,
    infographic: FileText,
    photo: Camera,
    ad: Megaphone,
    other: Image,
};

const STATUS_CONFIG: Record<MediaItemStatus, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: Clock },
    approved: { label: 'Approved', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    declined: { label: 'Declined', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: XCircle },
};

const STATUS_FILTERS: { value: MediaItemStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },
];

interface MediaTabProps {
    clientId: string;
    clientSlug: string;
}

export default function MediaTab({ clientId, clientSlug }: MediaTabProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<MediaItemStatus | 'all'>('all');
    const [showPostModal, setShowPostModal] = useState(false);
    const [previewItemId, setPreviewItemId] = useState<string | null>(null);
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMediaItems(clientId, search || undefined, statusFilter);
            setItems(data);
        } catch (err) {
            console.error('Failed to load media:', err);
        } finally {
            setLoading(false);
        }
    }, [clientId, search, statusFilter]);

    useEffect(() => { load(); }, [load]);

    const handleStatusChange = async (id: string, status: MediaItemStatus) => {
        try {
            await updateMediaStatus(id, status);
            load();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
        setActionMenuId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this media item and all its files?')) return;
        try {
            await deleteMediaItem(id);
            load();
        } catch (err) {
            console.error('Failed to delete:', err);
        }
        setActionMenuId(null);
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search media…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-flo-orange/50"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <Filter className="w-4 h-4 text-white/30 hidden sm:block" />
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${statusFilter === f.value
                                    ? 'bg-flo-orange/20 text-flo-orange border border-flo-orange/30'
                                    : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/60'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowPostModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-flo-orange to-flo-orange-light text-white text-sm font-semibold rounded-xl shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Post New Content
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-white/30">
                    <div className="w-6 h-6 border-2 border-flo-orange/30 border-t-flo-orange rounded-full animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <Video className="w-7 h-7 text-white/15" />
                    </div>
                    <h3 className="text-lg font-semibold text-white/50 mb-2">No media yet</h3>
                    <p className="text-sm text-white/25 max-w-sm mb-6">
                        Upload content for this client to start the revision workflow.
                    </p>
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-flo-orange/15 text-flo-orange text-sm font-semibold rounded-xl border border-flo-orange/20 hover:bg-flo-orange/25 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Post New Content
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => {
                        const TypeIcon = TYPE_ICONS[item.type] || Image;
                        const sc = STATUS_CONFIG[item.status];
                        const StatusIcon = sc.icon;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group flex items-center gap-4 px-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <TypeIcon className="w-5 h-5 text-white/40" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white/80 truncate">{item.title}</p>
                                    <p className="text-xs text-white/30 mt-0.5 capitalize">{item.type}</p>
                                </div>

                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${sc.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {sc.label}
                                </div>

                                <p className="text-xs text-white/25 hidden md:block w-28 text-right">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setPreviewItemId(item.id)}
                                        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all"
                                        title="Preview"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                                            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <AnimatePresence>
                                            {actionMenuId === item.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-1 w-44 bg-[#1a1a1a] border border-white/[0.08] rounded-xl shadow-2xl z-30 overflow-hidden"
                                                >
                                                    {item.status !== 'approved' && (
                                                        <button onClick={() => handleStatusChange(item.id, 'approved')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/[0.04]">
                                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                                        </button>
                                                    )}
                                                    {item.status !== 'declined' && (
                                                        <button onClick={() => handleStatusChange(item.id, 'declined')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.04]">
                                                            <XCircle className="w-4 h-4" /> Decline
                                                        </button>
                                                    )}
                                                    {item.status !== 'pending' && (
                                                        <button onClick={() => handleStatusChange(item.id, 'pending')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-amber-400 hover:bg-white/[0.04]">
                                                            <Clock className="w-4 h-4" /> Reset to Pending
                                                        </button>
                                                    )}
                                                    <div className="border-t border-white/[0.06]" />
                                                    <button onClick={() => handleDelete(item.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.04]">
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <MediaPostModal
                        clientId={clientId}
                        clientSlug={clientSlug}
                        onClose={() => setShowPostModal(false)}
                        onCreated={() => { setShowPostModal(false); load(); }}
                    />
                )}
            </AnimatePresence>

            {/* Preview Drawer */}
            <AnimatePresence>
                {previewItemId && (
                    <MediaPreview
                        mediaItemId={previewItemId}
                        onClose={() => { setPreviewItemId(null); load(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
