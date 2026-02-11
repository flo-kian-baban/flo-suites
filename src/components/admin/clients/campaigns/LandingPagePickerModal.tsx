'use client';

import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { getAdminLandingPages } from '@/actions/admin-landing-pages';
import { LandingPage } from '@/lib/client-landing-pages';

interface LandingPagePickerModalProps {
    clientId: string;
    excludeIds: string[];
    onClose: () => void;
    onConfirm: (landingPageIds: string[]) => void;
}

export default function LandingPagePickerModal({ clientId, excludeIds, onClose, onConfirm }: LandingPagePickerModalProps) {
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getAdminLandingPages(clientId);
                setPages(data.filter((p) => !excludeIds.includes(p.id)));
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, [clientId, excludeIds]);

    const filtered = search
        ? pages.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.url.toLowerCase().includes(search.toLowerCase())
        )
        : pages;

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <>
            <div className="fixed -inset-10 z-[120] bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-lg bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[80vh] pointer-events-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
                        <h2 className="text-base font-semibold text-white">Attach Landing Pages</h2>
                        <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-white/[0.06] shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or URL..."
                                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                        {loading ? (
                            <p className="text-sm text-white/30 text-center py-8">Loading...</p>
                        ) : filtered.length === 0 ? (
                            <p className="text-sm text-white/30 text-center py-8">No landing pages found</p>
                        ) : (
                            filtered.map((page) => {
                                const isSelected = selected.has(page.id);
                                return (
                                    <button
                                        key={page.id}
                                        onClick={() => toggle(page.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected
                                            ? 'border-flo-orange/30 bg-flo-orange/[0.06]'
                                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-flo-orange bg-flo-orange' : 'border-white/20'
                                            }`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/80 truncate">{page.name}</p>
                                            <p className="text-[11px] text-white/30 truncate">{page.url}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/[0.06] p-5 flex items-center justify-between shrink-0 bg-[#111] rounded-b-2xl">
                        <span className="text-xs text-white/30">{selected.size} selected</span>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(Array.from(selected))}
                                disabled={selected.size === 0}
                                className="px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Attach ({selected.size})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
