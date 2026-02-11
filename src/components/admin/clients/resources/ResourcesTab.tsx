'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, FileText, BarChart3, Cpu } from 'lucide-react';
import {
    DocType,
    DOC_TYPE_LABELS,
    DOC_TYPE_FULL_NAMES,
    ClientDocument,
} from '@/lib/client-documents';
import {
    ensureAdminAllDocuments,
    upsertAdminDocument,
} from '@/actions/admin-documents';
import ResourceEditor from './ResourceEditor';

const DOC_TYPES: { key: DocType; icon: typeof FileText }[] = [
    { key: 'cop', icon: FileText },
    { key: 'mci', icon: BarChart3 },
    { key: 'sb', icon: Cpu },
];

interface ResourcesTabProps {
    clientId: string;
}

export default function ResourcesTab({ clientId }: ResourcesTabProps) {
    const [docs, setDocs] = useState<ClientDocument[]>([]);
    const [activeType, setActiveType] = useState<DocType>('cop');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load / seed all docs on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const all = await ensureAdminAllDocuments(clientId);
                if (!cancelled) setDocs(all);
            } catch (err: any) {
                if (!cancelled) setError(err.message || 'Failed to load documents');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [clientId]);

    const activeDoc = docs.find((d) => d.doc_type === activeType);

    const handleSave = useCallback(
        async (md: string) => {
            setSaving(true);
            try {
                const updated = await upsertAdminDocument(clientId, activeType, md);
                setDocs((prev) =>
                    prev.map((d) => (d.doc_type === activeType ? updated : d))
                );
                setLastSaved(updated.updated_at);
            } catch (err: any) {
                console.error('Save failed:', err);
            } finally {
                setSaving(false);
            }
        },
        [clientId, activeType]
    );

    // Reset lastSaved when switching doc types
    useEffect(() => {
        const doc = docs.find((d) => d.doc_type === activeType);
        setLastSaved(doc?.updated_at || null);
    }, [activeType, docs]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-white/30">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-flo-orange" />
                <p className="text-sm">Loading resources…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-red-400 text-sm mb-2">Failed to load resources</p>
                <p className="text-white/25 text-xs max-w-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Top — Doc Type selector */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Resources</h2>
                        <p className="text-white/40 text-sm">Manage client documentation and strategy.</p>
                    </div>
                    {activeDoc && (
                        <div className="flex items-center gap-2 text-xs text-white/30 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            {saving ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-flo-orange" />
                                    <span>Saving…</span>
                                </>
                            ) : lastSaved ? (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span>Last saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </>
                            ) : (
                                <span>No changes yet</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto">
                    {DOC_TYPES.map(({ key, icon: Icon }) => {
                        const isActive = activeType === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveType(key)}
                                className={`
                                    flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                    ${isActive
                                        ? 'bg-flo-orange text-white shadow-lg shadow-flo-orange/20'
                                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`} />
                                <span>{DOC_TYPE_LABELS[key]}</span>
                                <span className={`text-[10px] uppercase tracking-wider opacity-60 hidden sm:inline-block ml-1 ${isActive ? 'text-white' : ''}`}>
                                    {isActive ? '— ' + DOC_TYPE_FULL_NAMES[key] : ''}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 min-w-0 animate-fade-in">
                {activeDoc ? (
                    <ResourceEditor
                        key={activeType}
                        markdown={activeDoc.markdown}
                        onSave={handleSave}
                        saving={saving}
                        lastSaved={lastSaved}
                    />
                ) : (
                    <div className="text-white/25 text-sm py-12 text-center border border-dashed border-white/10 rounded-xl">
                        No document found.
                    </div>
                )}
            </div>
        </div>
    );
}
