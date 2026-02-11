'use client';

import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { getAdminMediaItems } from '@/actions/admin-media';
import { MediaItem, MediaItemStatus } from '@/lib/client-media';

interface MediaPickerModalProps {
    clientId: string;
    excludeIds: string[];
    onClose: () => void;
    onConfirm: (mediaItemIds: string[]) => void;
}

const STATUS_FILTERS: (MediaItemStatus | 'all')[] = ['all', 'pending', 'approved', 'declined'];

export default function MediaPickerModal({ clientId, excludeIds, onClose, onConfirm }: MediaPickerModalProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<MediaItemStatus | 'all'>('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getAdminMediaItems(clientId, search || undefined, statusFilter);
                setItems(data.filter((m) => !excludeIds.includes(m.id)));
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, [clientId, search, statusFilter, excludeIds]);

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
                        <h2 className="text-base font-semibold text-white">Attach Media</h2>
                        <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search + filter */}
                    <div className="p-4 space-y-3 border-b border-white/[0.06] shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search media by title..."
                                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>
                        <div className="flex gap-1.5">
                            {STATUS_FILTERS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all capitalize ${statusFilter === s
                                        ? 'border-flo-orange/30 bg-flo-orange/10 text-flo-orange'
                                        : 'border-white/[0.06] text-white/30 hover:text-white/50'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                        {loading ? (
                            <p className="text-sm text-white/30 text-center py-8">Loading...</p>
                        ) : items.length === 0 ? (
                            <p className="text-sm text-white/30 text-center py-8">No media items found</p>
                        ) : (
                            items.map((item) => {
                                const isSelected = selected.has(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => toggle(item.id)}
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
                                            <p className="text-sm text-white/80 truncate">{item.title}</p>
                                            <p className="text-[11px] text-white/30 capitalize">{item.type} · {item.status}</p>
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
