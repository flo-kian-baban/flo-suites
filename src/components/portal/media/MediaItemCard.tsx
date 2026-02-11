'use client';

import { Play, Download, MessageSquare, Clock, CheckCircle2, XCircle, FileIcon } from 'lucide-react';
import { MediaItem, MediaAsset } from '@/lib/client-media';
import { getAssetUrl } from '@/lib/client-media';
import { useState } from 'react';

// We need a client-side wrapper to handle asset URL resolution or we pass it down
// Actually getAssetUrl is just a string formatter if the bucket is public.
// Let's assume we pass the full resolved URL for the preview asset.

interface MediaItemCardProps {
    item: MediaItem;
    previewUrl: string | null;
}

export default function MediaItemCard({ item, previewUrl }: MediaItemCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const firstAsset = item.assets?.[0];
    const isVideo = firstAsset?.mime_type?.startsWith('video');
    const isImage = firstAsset?.mime_type?.startsWith('image');

    const statusColor = {
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        approved: 'bg-green-500/10 text-green-500 border-green-500/20',
        declined: 'bg-red-500/10 text-red-500 border-red-500/20',
    }[item.status];

    const StatusIcon = {
        pending: Clock,
        approved: CheckCircle2,
        declined: XCircle,
    }[item.status];

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/10 transition-all group">
            {/* Preview Area */}
            <div className="aspect-video bg-black/40 relative group-hover:bg-black/30 transition-colors">
                {previewUrl ? (
                    isVideo ? (
                        <div className="w-full h-full relative">
                            <video
                                src={previewUrl}
                                className="w-full h-full object-cover"
                                controls={isPlaying}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <Play className="w-5 h-5 text-white fill-current" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : isImage ? (
                        <img src={previewUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                            <FileIcon className="w-12 h-12" />
                        </div>
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        <span className="text-xs">No preview</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md ${statusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    {item.status}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-white/90 line-clamp-1" title={item.title}>
                        {item.title}
                    </h3>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider border border-white/10 px-1.5 py-0.5 rounded">
                        {item.type}
                    </span>
                </div>

                <p className="text-[10px] text-white/40 mb-4">
                    Posted {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Actions / Info */}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <div className="flex items-center gap-3">
                        {(item.comments?.length ?? 0) > 0 && (
                            <div className="flex items-center gap-1 text-white/40 text-xs">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{item.comments.length}</span>
                            </div>
                        )}
                    </div>

                    {previewUrl && (
                        <a
                            href={previewUrl}
                            download
                            className="text-white/40 hover:text-white transition-colors"
                            title="Download Asset"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
