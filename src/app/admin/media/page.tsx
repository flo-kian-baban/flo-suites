'use client';

/**
 * Content Manager - Admin page for managing written site assets
 * 
 * Tiles:
 * - Marketing: Blog posts with inline editing
 * - Development: Case studies with inline editing
 */

import { useState } from 'react';
import { ChevronDown, FileText, LayoutTemplate } from 'lucide-react';
import PostList from '@/components/admin/cms/PostList';

// Tile configuration - what each tile manages
type TileType = 'blog' | 'case-study';

interface TileConfig {
    id: string;
    title: string;
    tagline: string;
    type: TileType;
    icon: typeof FileText;
    color: string;
}

const tiles: TileConfig[] = [
    { id: 'marketing', title: 'Marketing', tagline: 'Strategic marketing content', type: 'blog', icon: FileText, color: 'text-blue-400' },
    { id: 'dev', title: 'Development', tagline: 'Technical case studies', type: 'case-study', icon: LayoutTemplate, color: 'text-emerald-400' },
];

export default function AssetManagerPage() {
    const [openTile, setOpenTile] = useState<string | null>(null);

    const toggleTile = (tileId: string) => {
        setOpenTile(openTile === tileId ? null : tileId);
    };

    // Render content based on tile type
    const renderTileContent = (tile: TileConfig) => {
        switch (tile.type) {
            case 'blog':
                return (
                    <div className="p-6">
                        <PostList type="blog" />
                    </div>
                );
            case 'case-study':
                return (
                    <div className="p-6">
                        <PostList type="case_study" />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Content Manager</h1>
                <p className="text-white/50 mt-1">Manage marketing and development post publications</p>
            </div>

            {/* Tile Accordions */}
            <div className="space-y-3">
                {tiles.map((tile) => {
                    const isOpen = openTile === tile.id;
                    const Icon = tile.icon;

                    return (
                        <div key={tile.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleTile(tile.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${tile.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-white">{tile.title}</h3>
                                        <p className="text-sm text-white/40">{tile.tagline}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Accordion Content */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-white/5">
                                    {renderTileContent(tile)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
