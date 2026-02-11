'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Play,
    FileIcon,
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    Loader2,
    ArrowUpRight
} from 'lucide-react';
import { MediaItem, updateMediaStatus, addMediaComment } from '@/lib/client-media';

interface MediaRowProps {
    item: MediaItem;
    previewUrl: string | null;
}

export default function MediaRow({ item, previewUrl }: MediaRowProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Decline logic
    const [showDeclineInput, setShowDeclineInput] = useState(false);
    const [declineComment, setDeclineComment] = useState('');

    const firstAsset = item.assets?.[0];
    const isImage = firstAsset?.mime_type?.startsWith('image');
    const isVideo = firstAsset?.mime_type?.startsWith('video');

    // Taller preview for Reels
    const isReel = item.type === 'reel';
    const maxHeightClass = isReel ? 'max-h-[500px]' : 'max-h-60';


    const handleApprove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to approve this item?')) {
            setIsUpdating(true);
            try {
                await updateMediaStatus(item.id, 'approved');
                router.refresh();
            } catch (error) {
                alert('Failed to approve item');
                console.error(error);
                setIsUpdating(false);
            }
        }
    };

    const handleDeclineClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(true); // Ensure row is expanded to show input
        setShowDeclineInput(true);
    };

    const submitDecline = async () => {
        if (!declineComment.trim()) {
            alert('Please provide a reason for declining.');
            return;
        }
        setIsUpdating(true);
        try {
            await addMediaComment(item.id, declineComment);
            await updateMediaStatus(item.id, 'declined');
            setShowDeclineInput(false);
            setDeclineComment('');
            router.refresh();
        } catch (error) {
            alert('Failed to decline item');
            console.error(error);
            setIsUpdating(false);
        }
    };

    const StatusIcon = {
        pending: Clock,
        approved: CheckCircle2,
        declined: XCircle,
    }[item.status];

    const statusColors = {
        pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        approved: 'text-green-500 bg-green-500/10 border-green-500/20',
        declined: 'text-red-500 bg-red-500/10 border-red-500/20',
    }[item.status];

    return (
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-xl overflow-hidden transition-all duration-200 hover:border-white/10 group">
            {/* Main Row */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center p-4 cursor-pointer hover:bg-white/[0.02] transition-colors gap-4"
            >
                {/* Expand Icon */}
                <div className={`p-1.5 rounded-md transition-all duration-300 ${isExpanded ? 'bg-white/10 rotate-180' : 'text-white/40 group-hover:text-white'}`}>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Title & Type */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-medium text-white truncate max-w-[300px] md:max-w-[500px]">
                            {item.title}
                        </h3>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider border border-white/10 px-1.5 py-0.5 rounded">
                            {item.type}
                        </span>
                    </div>
                    <p className="text-xs text-white/40">
                        Uploaded {new Date(item.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Status Badge */}
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider ${statusColors}`}>
                    <StatusIcon className="w-3 h-3" />
                    {item.status}
                </div>

                {/* Comment Count */}
                {(item.comments?.length ?? 0) > 0 && (
                    <div className="hidden sm:flex items-center gap-1 text-white/40 text-xs px-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.comments.length}</span>
                    </div>
                )}

                {/* Actions (Only show if pending) */}
                {
                    item.status === 'pending' && (
                        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                            <button
                                onClick={handleApprove}
                                disabled={isUpdating}
                                className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleDeclineClick}
                                disabled={isUpdating}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>
                    )
                }
            </div >

            {/* Expanded Content */}
            < div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-white/[0.06] bg-black/20">

                        {/* Decline Input Section */}
                        <AnimatePresence>
                            {showDeclineInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mb-6 bg-[#1A1A1A] border border-white/10 rounded-xl p-5 relative">
                                        {/* Dropdown arrow pointer */}
                                        <div className="absolute -top-1.5 right-[80px] w-3 h-3 bg-[#1A1A1A] border-t border-l border-white/10 rotate-45 transform" />

                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-medium text-white">Reason for declining</h4>
                                            <button
                                                onClick={() => setShowDeclineInput(false)}
                                                className="text-white/40 hover:text-white transition-colors p-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <textarea
                                            value={declineComment}
                                            onChange={(e) => setDeclineComment(e.target.value)}
                                            placeholder="Please explain why this content is being declined..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 min-h-[100px] focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all resize-none"
                                        />

                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                onClick={() => setShowDeclineInput(false)}
                                                className="px-4 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={submitDecline}
                                                disabled={isUpdating || !declineComment.trim()}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-red-500/20"
                                            >
                                                {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Confirm Decline
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Preview */}
                        <div className="rounded-lg overflow-hidden border border-white/10 ml-12 bg-black/40 relative group/preview inline-block">

                            {/* Open New Tab Button */}
                            {previewUrl && (
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/preview:opacity-100 transition-opacity z-10"
                                    title="Open content in a separate page"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            )}

                            {previewUrl ? (
                                isVideo ? (
                                    <div className={`relative group ${maxHeightClass} flex justify-center`}>
                                        <video
                                            src={previewUrl}
                                            className={`${maxHeightClass} w-auto object-contain`}
                                            controls={true}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                    </div>
                                ) : isImage ? (
                                    <div className={`flex justify-center ${maxHeightClass}`}>
                                        <img src={previewUrl} alt={item.title} className={`${maxHeightClass} w-auto object-contain`} />
                                    </div>
                                ) : (
                                    <div className="aspect-video flex flex-col items-center justify-center text-white/40 gap-3">
                                        <FileIcon className="w-12 h-12" />
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm">Preview not available for this file type</span>
                                            <span className="text-xs opacity-50">{firstAsset?.mime_type}</span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="aspect-video flex items-center justify-center text-white/20">
                                    <span className="text-xs">No preview available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
