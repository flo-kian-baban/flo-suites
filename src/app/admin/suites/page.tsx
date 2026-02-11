'use client';

import { useState } from 'react';
import MediaUploadPanel from '@/components/admin/MediaUploadPanel';
import MediaFileBrowser from '@/components/admin/MediaFileBrowser';
import { Layers } from 'lucide-react';
import { SUITE_SLUGS } from '@/lib/paths';

export default function SuitesPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedSuite, setSelectedSuite] = useState('');

    const handleUploadComplete = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Layers className="w-7 h-7 text-flo-orange" />
                    Suite Portfolios
                </h1>
                <p className="text-white/50 mt-1">
                    Manage portfolio photos and videos for each suite
                </p>
            </div>

            {/* Suite Quick Select */}
            <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm text-white/60 mb-3">Quick Select Suite</h3>
                <div className="flex flex-wrap gap-2">
                    {SUITE_SLUGS.map((slug) => (
                        <button
                            key={slug}
                            onClick={() => setSelectedSuite(slug)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSuite === slug
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
                    defaultCategory="suites"
                    defaultTarget={selectedSuite}
                    onUploadComplete={handleUploadComplete}
                />
                <MediaFileBrowser
                    defaultCategory="suites"
                    defaultTarget={selectedSuite}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}
