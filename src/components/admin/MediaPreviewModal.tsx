'use client';

import { StorageFile, getPublicUrl } from '@/lib/storage';
import { X, ExternalLink, Copy, Trash2, Download } from 'lucide-react';

interface MediaPreviewModalProps {
    file: StorageFile;
    onClose: () => void;
    onDelete: () => void;
    onCopyUrl: () => void;
}

export default function MediaPreviewModal({
    file,
    onClose,
    onDelete,
    onCopyUrl,
}: MediaPreviewModalProps) {
    const publicUrl = getPublicUrl(file.path);

    const isVideo =
        file.mimeType?.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|avi)$/i);

    const isImage =
        file.mimeType?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop - Stronger Blur */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-[#111111]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
                    <div className="min-w-0">
                        <h3 className="text-white font-medium truncate text-lg">{file.name}</h3>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-medium">
                            {(file.size / 1024).toFixed(1)} KB • {file.mimeType || 'Unknown type'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Preview Area */}
                <div className="aspect-video bg-black/50 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                    {isVideo ? (
                        <video
                            src={publicUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-full shadow-lg relative z-10"
                        />
                    ) : isImage ? (
                        <img
                            src={publicUrl}
                            alt={file.name}
                            className="max-w-full max-h-full object-contain shadow-lg relative z-10"
                        />
                    ) : (
                        <div className="text-white/40 text-center p-8 relative z-10">
                            <p className="text-xl font-medium mb-2">Preview not available</p>
                            <p className="text-sm">This file type cannot be previewed directly</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-5 border-t border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCopyUrl}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5
                       text-white/80 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-medium"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Copy URL
                        </button>
                        <button
                            onClick={() => navigator.clipboard.writeText(file.path)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5
                       text-white/80 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-medium"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Path
                        </button>
                        <a
                            href={publicUrl}
                            download
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5
                       text-white/80 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-4 hidden sm:block" />

                    <button
                        onClick={() => {
                            if (confirm('Delete this file?')) {
                                onDelete();
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10
                     text-red-400 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-medium ml-auto"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete File
                    </button>
                </div>

                {/* File Info */}
                <div className="px-5 pb-5 bg-white/[0.02]">
                    <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer"
                        onClick={onCopyUrl}
                        title="Click to copy"
                    >
                        <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Public URL</span>
                        <code className="text-xs text-flo-orange/80 font-mono flex-1 text-right truncate ml-4 group-hover:text-flo-orange transition-colors">
                            {publicUrl}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
