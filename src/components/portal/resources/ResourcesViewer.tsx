'use client';

import { useState } from 'react';
import { FileText, BookOpen, Shield } from 'lucide-react';
import showdown from 'showdown';

interface ResourceDocument {
    id: string;
    type: string;
    content: string;
    updatedAt: string;
}

interface ResourcesViewerProps {
    documents: ResourceDocument[];
}

export default function ResourcesViewer({ documents }: ResourcesViewerProps) {
    const [activeTab, setActiveTab] = useState<string>(documents[0]?.type || 'cop');

    const converter = new showdown.Converter();

    const activeDoc = documents.find(d => d.type === activeTab);
    const htmlContent = activeDoc ? converter.makeHtml(activeDoc.content) : '';

    const tabs = [
        { id: 'cop', label: 'Client Operating Profile', icon: BookOpen },
        { id: 'mci', label: 'Market & Competitive Intelligence', icon: FileText },
        { id: 'sb', label: 'System Blueprint', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl self-start overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const exists = documents.some(d => d.type === tab.id);

                    if (!exists) return null;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                ? 'bg-flo-orange text-white shadow-sm'
                                : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-8 min-h-[400px]">
                {activeDoc ? (
                    <article
                        className="prose prose-invert prose-orange max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <p className="text-white/40">Select a document to view.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
