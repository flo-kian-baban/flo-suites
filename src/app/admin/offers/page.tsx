'use client';

import { useState } from 'react';
import MediaUploadPanel from '@/components/admin/MediaUploadPanel';
import MediaFileBrowser from '@/components/admin/MediaFileBrowser';
import { Tag } from 'lucide-react';

export default function OffersPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedOffer, setSelectedOffer] = useState('');

    const handleUploadComplete = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Tag className="w-7 h-7 text-flo-orange" />
                    Offer Headers
                </h1>
                <p className="text-white/50 mt-1">
                    Manage header media (videos and images) for offers
                </p>
            </div>

            {/* Info Card */}
            <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm text-white/60 mb-2">About Offer Media</h3>
                <p className="text-sm text-white/40">
                    Offers use dynamic slugs. Enter the offer slug (e.g., "spring-sale-2024")
                    to upload or browse header media for that specific offer. New folders are
                    created automatically on first upload.
                </p>
            </div>

            {/* Quick Access - Recent Offers (placeholder for future) */}
            <div className="glass-effect rounded-2xl p-4">
                <h3 className="text-sm text-white/60 mb-3">Browse by Offer</h3>
                <input
                    type="text"
                    value={selectedOffer}
                    onChange={(e) => setSelectedOffer(e.target.value)}
                    placeholder="Enter offer slug to browse..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl
                   text-white placeholder-white/30 
                   focus:outline-none focus:border-flo-orange/50 transition-colors"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MediaUploadPanel
                    defaultCategory="offers"
                    defaultTarget={selectedOffer}
                    onUploadComplete={handleUploadComplete}
                />
                <MediaFileBrowser
                    defaultCategory="offers"
                    defaultTarget={selectedOffer}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
}
