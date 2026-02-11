'use client';

import { useState } from 'react';
import MediaUploadPanel from '@/components/admin/MediaUploadPanel';
import MediaFileBrowser from '@/components/admin/MediaFileBrowser';
import { Grid3X3 } from 'lucide-react';
import { TILE_SLUGS } from '@/lib/paths';

export default function TilesPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedTile, setSelectedTile] = useState('');

    const handleUploadComplete = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Grid3X3 className="w-7 h-7 text-flo-orange" />
                    Tile Media
                </h1>
                <p className="text-white/50 mt-1">
                    Manage expanded video content for each tile
                </p>
            </div>

            {/* Tile Quick Select */}
            <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm text-white/60 mb-3">Quick Select Tile</h3>
                <div className="flex flex-wrap gap-2">
                    {TILE_SLUGS.map((slug) => (
                        <button
                            key={slug}
                            onClick={() => setSelectedTile(slug)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedTile === slug
                                    ? 'bg-flo-orange text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {slug}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MediaUploadPanel
                    defaultCategory="tiles"
                    defaultTarget={selectedTile}
                    onUploadComplete={handleUploadComplete}
                />
                <MediaFileBrowser
                    defaultCategory="tiles"
                    defaultTarget={selectedTile}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}
