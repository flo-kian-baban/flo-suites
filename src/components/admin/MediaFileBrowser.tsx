'use client';

import { useState, useEffect, useCallback } from 'react';
import { listFiles, deleteFile, getPublicUrl, StorageFile } from '@/lib/storage';
import { getStoragePath, TILE_SLUGS, SUITE_SLUGS, StorageCategory, MediaType } from '@/lib/paths';
import {
    FolderOpen,
    Search,
    Grid3X3,
    List,
    Trash2,
    Copy,
    ExternalLink,
    Play,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    ChevronDown,
    Check,
} from 'lucide-react';
import MediaPreviewModal from './MediaPreviewModal';

interface MediaFileBrowserProps {
    defaultCategory?: StorageCategory;
    defaultTarget?: string;
    refreshTrigger?: number;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date';

export default function MediaFileBrowser({
    defaultCategory,
    defaultTarget,
    refreshTrigger = 0,
}: MediaFileBrowserProps) {
    const [category, setCategory] = useState<StorageCategory>(defaultCategory || 'tiles');
    const [target, setTarget] = useState(defaultTarget || '');
    const [mediaType, setMediaType] = useState<MediaType>('videos');
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('date');
    const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);
    const [copiedPath, setCopiedPath] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        if (!target) {
            setFiles([]);
            return;
        }

        setIsLoading(true);
        try {
            const path = getStoragePath(category, target, { mediaType });
            const result = await listFiles(path, {
                limit: 100,
                sortBy: { column: sortBy === 'date' ? 'created_at' : 'name', order: 'desc' },
            });
            setFiles(result.files);
        } catch (error) {
            console.error('Failed to fetch files:', error);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    }, [category, target, mediaType, sortBy]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles, refreshTrigger]);

    const handleDelete = async (file: StorageFile) => {
        if (!confirm(`Delete ${file.name}?`)) return;

        try {
            await deleteFile(file.path);
            setFiles((prev) => prev.filter((f) => f.path !== file.path));
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('Failed to delete file');
        }
    };

    const handleCopyUrl = async (file: StorageFile) => {
        const url = getPublicUrl(file.path);
        await navigator.clipboard.writeText(url);
        setCopiedPath(file.path);
        setTimeout(() => setCopiedPath(null), 2000);
    };

    const handleCopyPath = async (file: StorageFile) => {
        await navigator.clipboard.writeText(file.path);
        setCopiedPath(file.path);
        setTimeout(() => setCopiedPath(null), 2000);
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isVideo = (file: StorageFile) =>
        file.mimeType?.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|avi)$/i);

    const isImage = (file: StorageFile) =>
        file.mimeType?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

    const getTargetOptions = () => {
        switch (category) {
            case 'tiles':
                return TILE_SLUGS.map((slug) => ({ value: slug, label: slug }));
            case 'suites':
                return SUITE_SLUGS.map((slug) => ({ value: slug, label: slug }));
            case 'offers':
                return null;
            default:
                return [];
        }
    };

    const targetOptions = getTargetOptions();

    return (
        <div className="glass-effect rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-flo-orange" />
                    Browse Files
                </h2>
                <button
                    onClick={fetchFiles}
                    disabled={isLoading}
                    className="p-2 text-white/40 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                {/* Category Filter */}
                <div className="flex-1 min-w-[150px]">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">Category</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value as StorageCategory);
                                setTarget('');
                            }}
                            className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl appearance-none
                                     text-sm text-white focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.07]
                                     transition-all cursor-pointer hover:border-white/20"
                        >
                            <option value="tiles" className="bg-[#1a1a1a]">Tile Media</option>
                            <option value="offers" className="bg-[#1a1a1a]">Offer Headers</option>
                            <option value="suites" className="bg-[#1a1a1a]">Suite Portfolios</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Target Filter */}
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">
                        {category === 'tiles' ? 'Tile' : category === 'offers' ? 'Offer Slug' : 'Suite'}
                    </label>
                    <div className="relative">
                        {targetOptions ? (
                            <>
                                <select
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl appearance-none
                                             text-sm text-white focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.07]
                                             transition-all cursor-pointer hover:border-white/20"
                                >
                                    <option value="" className="bg-[#1a1a1a]">Select target...</option>
                                    {targetOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            </>
                        ) : (
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="Enter offer slug (e.g. spring-sale)"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                                         text-sm text-white placeholder-white/20 
                                         focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.07]
                                         transition-all"
                            />
                        )}
                    </div>
                </div>

                {/* Media Type (for suites) */}
                {category === 'suites' && (
                    <div className="flex-1 min-w-[120px]">
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 block">Type</label>
                        <div className="relative">
                            <select
                                value={mediaType}
                                onChange={(e) => setMediaType(e.target.value as MediaType)}
                                className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl appearance-none
                                         text-sm text-white focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.07]
                                         transition-all cursor-pointer hover:border-white/20"
                            >
                                <option value="videos" className="bg-[#1a1a1a]">Videos</option>
                                <option value="photos" className="bg-[#1a1a1a]">Photos</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {/* Search & View Controls */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-flo-orange transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by filename..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl
                                 text-sm text-white placeholder-white/30
                                 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
                    />
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'
                            }`}
                        title="Grid View"
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'
                            }`}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 transition-all hover:text-white"
                >
                    <span>Sort by: <span className="text-white font-medium">{sortBy === 'date' ? 'Date' : 'Name'}</span></span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>
            </div>

            {/* File Grid/List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-flo-orange/20 blur-xl rounded-full"></div>
                        <Loader2 className="relative w-10 h-10 text-flo-orange animate-spin" />
                    </div>
                    <p className="text-white/40 text-sm animate-pulse">Loading files...</p>
                </div>
            ) : !target ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 rounded-xl border-2 border-dashed border-white/5 bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <FolderOpen className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40">Select a category and target to browse files</p>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 rounded-xl border-2 border-dashed border-white/5 bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Search className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40">No files found used this criteria</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    {filteredFiles.map((file) => (
                        <div
                            key={file.path}
                            className="group relative bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden
                                     hover:ring-2 hover:ring-flo-orange/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 
                                     transition-all duration-300 cursor-pointer"
                            onClick={() => setPreviewFile(file)}
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-[#0a0a0a] relative group-hover:opacity-90 transition-opacity">
                                {isVideo(file) ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <Play className="w-5 h-5 text-white ml-0.5" />
                                        </div>
                                        {/* Video pattern/placeholder if needed */}
                                        <video src={getPublicUrl(file.path)} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                                    </div>
                                ) : isImage(file) ? (
                                    <div className="w-full h-full relative">
                                        <img
                                            src={getPublicUrl(file.path)}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="w-10 h-10 text-white/10" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="text-sm font-medium text-white/90 truncate group-hover:text-flo-orange transition-colors">
                                    {file.name}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    <span className="text-[10px] text-white/20">
                                        {new Date(file.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Actions Overlay - Slide Up */}
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyUrl(file);
                                    }}
                                    className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 hover:scale-110 hover:text-white transition-all text-white/70"
                                    title="Copy Public URL"
                                >
                                    {copiedPath === file.path ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <ExternalLink className="w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyPath(file);
                                    }}
                                    className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 hover:scale-110 hover:text-white transition-all text-white/70"
                                    title="Copy Path"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(file);
                                    }}
                                    className="p-2.5 bg-red-500/10 rounded-xl hover:bg-red-500/20 hover:scale-110 hover:text-red-400 transition-all text-red-500/70"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2 animate-in fade-in duration-500">
                    {filteredFiles.map((file) => (
                        <div
                            key={file.path}
                            className="group flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl
                                     hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
                            onClick={() => setPreviewFile(file)}
                        >
                            <div className="w-12 h-12 bg-[#0a0a0a] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                {isVideo(file) ? (
                                    <>
                                        <Play className="w-5 h-5 text-white/40 relative z-10" />
                                        <video src={getPublicUrl(file.path)} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                                    </>
                                ) : isImage(file) ? (
                                    <img
                                        src={getPublicUrl(file.path)}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-5 h-5 text-white/40" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                                    {file.name}
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Hover Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyUrl(file);
                                    }}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    title="Copy Public URL"
                                >
                                    {copiedPath === file.path ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <ExternalLink className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(file);
                                    }}
                                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewFile && (
                <MediaPreviewModal
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                    onDelete={() => {
                        handleDelete(previewFile);
                        setPreviewFile(null);
                    }}
                    onCopyUrl={() => handleCopyUrl(previewFile)}
                />
            )}
        </div>
    );
}
