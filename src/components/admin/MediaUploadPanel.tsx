'use client';

import { useState, useCallback, useRef } from 'react';
import { uploadFiles } from '@/lib/storage';
import { getStoragePath, TILE_SLUGS, SUITE_SLUGS, StorageCategory, MediaType } from '@/lib/paths';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadingFile {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    result?: { path: string; publicUrl: string };
}

interface MediaUploadPanelProps {
    defaultCategory?: StorageCategory;
    defaultTarget?: string;
    onUploadComplete?: () => void;
}

export default function MediaUploadPanel({
    defaultCategory,
    defaultTarget,
    onUploadComplete,
}: MediaUploadPanelProps) {
    const [category, setCategory] = useState<StorageCategory>(defaultCategory || 'tiles');
    const [target, setTarget] = useState(defaultTarget || '');
    const [mediaType, setMediaType] = useState<MediaType>('videos');
    const [offerTitle, setOfferTitle] = useState('');
    const [files, setFiles] = useState<UploadingFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Metadata fields (UI only)
    const [metadata, setMetadata] = useState({ title: '', tags: '', notes: '' });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    }, []);

    const addFiles = (newFiles: File[]) => {
        const uploadingFiles: UploadingFile[] = newFiles.map((file) => ({
            file,
            progress: 0,
            status: 'pending' as const,
        }));
        setFiles((prev) => [...prev, ...uploadingFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!target || files.length === 0) return;

        setIsUploading(true);

        const storagePath = getStoragePath(category, target, { mediaType });
        const pendingFiles = files.filter((f) => f.status === 'pending');

        // Update all pending files to uploading
        setFiles((prev) =>
            prev.map((f) =>
                f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
            )
        );

        await uploadFiles(
            storagePath,
            pendingFiles.map((f) => f.file),
            {
                onFileProgress: (fileIndex, progress) => {
                    setFiles((prev) => {
                        const newFiles = [...prev];
                        const globalIndex = prev.findIndex(
                            (f) => f.file === pendingFiles[fileIndex].file
                        );
                        if (globalIndex !== -1) {
                            newFiles[globalIndex] = { ...newFiles[globalIndex], progress };
                        }
                        return newFiles;
                    });
                },
                onFileComplete: (fileIndex, result) => {
                    setFiles((prev) => {
                        const newFiles = [...prev];
                        const globalIndex = prev.findIndex(
                            (f) => f.file === pendingFiles[fileIndex].file
                        );
                        if (globalIndex !== -1) {
                            newFiles[globalIndex] = {
                                ...newFiles[globalIndex],
                                status: 'success',
                                progress: 100,
                                result,
                            };
                        }
                        return newFiles;
                    });
                },
                onFileError: (fileIndex, error) => {
                    setFiles((prev) => {
                        const newFiles = [...prev];
                        const globalIndex = prev.findIndex(
                            (f) => f.file === pendingFiles[fileIndex].file
                        );
                        if (globalIndex !== -1) {
                            newFiles[globalIndex] = {
                                ...newFiles[globalIndex],
                                status: 'error',
                                error: error.message,
                            };
                        }
                        return newFiles;
                    });
                },
            }
        );

        setIsUploading(false);
        onUploadComplete?.();
    };

    const clearCompleted = () => {
        setFiles((prev) => prev.filter((f) => f.status !== 'success'));
    };

    const getTargetOptions = () => {
        switch (category) {
            case 'tiles':
                return TILE_SLUGS.map((slug) => ({ value: slug, label: slug }));
            case 'suites':
                return SUITE_SLUGS.map((slug) => ({ value: slug, label: slug }));
            case 'offers':
                return null; // Free text input
            default:
                return [];
        }
    };

    const targetOptions = getTargetOptions();

    return (
        <div className="glass-effect rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-flo-orange" />
                Upload Media
            </h2>

            {/* Category Selector */}
            <div className="space-y-2">
                <label className="text-sm text-white/60">Category</label>
                <div className="flex gap-2">
                    {(['tiles', 'offers', 'suites'] as StorageCategory[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                setTarget('');
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat
                                ? 'bg-flo-orange text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {cat === 'tiles' ? 'Tile Media' : cat === 'offers' ? 'Offer Headers' : 'Suite Portfolios'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Target Selector */}
            <div className="space-y-2">
                <label className="text-sm text-white/60">
                    {category === 'tiles' ? 'Tile' : category === 'offers' ? 'Offer Slug' : 'Suite'}
                </label>
                {targetOptions ? (
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                     text-white focus:outline-none focus:border-flo-orange/50
                     transition-colors cursor-pointer"
                    >
                        <option value="" className="bg-dark-panel">Select {category === 'tiles' ? 'tile' : 'suite'}...</option>
                        {targetOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-dark-panel">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Enter offer slug (e.g., spring-sale-2024)"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                     text-white placeholder-white/30 
                     focus:outline-none focus:border-flo-orange/50 transition-colors"
                    />
                )}
            </div>

            {/* Offer Title (UI only) */}
            {category === 'offers' && (
                <div className="space-y-2">
                    <label className="text-sm text-white/60">Offer Title (optional)</label>
                    <input
                        type="text"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        placeholder="Display name for this offer"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                     text-white placeholder-white/30 
                     focus:outline-none focus:border-flo-orange/50 transition-colors"
                    />
                </div>
            )}

            {/* Media Type (for suites) */}
            {category === 'suites' && (
                <div className="space-y-2">
                    <label className="text-sm text-white/60">Media Type</label>
                    <div className="flex gap-2">
                        {(['photos', 'videos'] as MediaType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setMediaType(type)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mediaType === type
                                    ? 'bg-flo-orange text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Optional Metadata */}
            <details className="group">
                <summary className="text-sm text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                    Optional metadata
                </summary>
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        value={metadata.title}
                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl
                     text-sm text-white placeholder-white/30 
                     focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <input
                        type="text"
                        value={metadata.tags}
                        onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                        placeholder="Tags (comma separated)"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl
                     text-sm text-white placeholder-white/30 
                     focus:outline-none focus:border-white/20 transition-colors"
                    />
                    <textarea
                        value={metadata.notes}
                        onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
                        placeholder="Notes"
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl
                     text-sm text-white placeholder-white/30 
                     focus:outline-none focus:border-white/20 transition-colors resize-none"
                    />
                </div>
            </details>

            {/* Drop Zone - Premium Redesign */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative overflow-hidden group
          border border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-500 ease-out
          ${isDragging
                        ? 'border-flo-orange bg-flo-orange/[0.03] scale-[1.01]'
                        : 'border-white/10 hover:border-flo-orange/40 hover:bg-white/[0.02]'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Animated Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-flo-orange/[0.05] to-transparent opacity-0 transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'group-hover:opacity-100'}`} />

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500
                ${isDragging ? 'bg-flo-orange shadow-[0_0_30px_rgba(241,89,45,0.3)]' : 'bg-white/5 group-hover:bg-white/10 group-hover:shadow-lg'}
            `}>
                        <Upload className={`w-7 h-7 transition-colors duration-300 ${isDragging ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
                    </div>

                    <p className="text-white font-medium text-lg mb-2">
                        Draft or Drop Media
                    </p>
                    <p className="text-white/40 text-sm max-w-xs mx-auto">
                        Support for high-res images and videos. <br />
                        <span className="text-flo-orange/80 group-hover:text-flo-orange transition-colors">Browse files</span>
                    </p>
                </div>
            </div>

            {/* File List - Refined */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Queue ({files.length})</span>
                        {files.some((f) => f.status === 'success') && (
                            <button
                                onClick={clearCompleted}
                                className="text-xs text-flo-orange hover:text-white transition-colors flex items-center gap-1"
                            >
                                Clear completed
                            </button>
                        )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {files.map((f, i) => (
                            <div
                                key={i}
                                className="group flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all"
                            >
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {f.status === 'success' ? (
                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        </div>
                                    ) : f.status === 'error' ? (
                                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                        </div>
                                    ) : f.status === 'uploading' ? (
                                        <div className="w-8 h-8 rounded-full bg-flo-orange/10 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-flo-orange animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white/20" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white/90 truncate">{f.file.name}</p>

                                    {/* Progress Bar / Size */}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {f.status === 'uploading' ? (
                                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-flo-orange transition-all duration-300 ease-out"
                                                    style={{ width: `${f.progress}%` }}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-white/30">{(f.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        )}
                                        {f.status === 'error' && (
                                            <span className="text-xs text-red-400">{f.error}</span>
                                        )}
                                    </div>
                                </div>

                                {f.status === 'pending' && (
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button - Refined */}
            <button
                onClick={handleUpload}
                disabled={!target || files.filter((f) => f.status === 'pending').length === 0 || isUploading}
                className="w-full py-4 px-6 bg-flo-orange text-white font-bold tracking-wide rounded-xl
                 hover:bg-flo-orange-light hover:shadow-[0_0_20px_rgba(241,89,45,0.4)]
                 active:scale-[0.99]
                 transition-all duration-300
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
                 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                    {isUploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Upload...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload {files.filter((f) => f.status === 'pending').length} Items
                        </>
                    )}
                </span>
            </button>
        </div>
    );
}
