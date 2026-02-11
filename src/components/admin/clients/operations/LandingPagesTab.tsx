'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Pencil, Trash2, Copy, ExternalLink, Globe, X, Loader2, Check,
} from 'lucide-react';
import {
    LandingPage, LandingPagePayload,
    getLandingPages, createLandingPage, updateLandingPage, deleteLandingPage,
} from '@/lib/client-landing-pages';

interface LandingPagesTabProps {
    clientId: string;
}

export default function LandingPagesTab({ clientId }: LandingPagesTabProps) {
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<LandingPagePayload>({ name: '', url: '', campaign_name: '', goal: '' });
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getLandingPages(clientId);
            setPages(data);
        } catch (err) {
            console.error('Failed to load landing pages:', err);
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => { load(); }, [load]);

    const openCreateForm = () => {
        setEditingId(null);
        setForm({ name: '', url: '', campaign_name: '', goal: '' });
        setFormOpen(true);
    };

    const openEditForm = (page: LandingPage) => {
        setEditingId(page.id);
        setForm({
            name: page.name,
            url: page.url,
            campaign_name: page.campaign_name || '',
            goal: page.goal || '',
        });
        setFormOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.url.trim()) return;
        setSaving(true);
        try {
            if (editingId) {
                await updateLandingPage(editingId, form);
            } else {
                await createLandingPage(clientId, form);
            }
            setFormOpen(false);
            setEditingId(null);
            load();
        } catch (err) {
            console.error('Failed to save:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this landing page?')) return;
        try {
            await deleteLandingPage(id);
            load();
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const copyUrl = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/40">
                    {pages.length} landing page{pages.length !== 1 ? 's' : ''}
                </p>
                <button
                    onClick={openCreateForm}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-flo-orange to-flo-orange-light text-white text-sm font-semibold rounded-xl shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Landing Page
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-white/30">
                    <div className="w-6 h-6 border-2 border-flo-orange/30 border-t-flo-orange rounded-full animate-spin" />
                </div>
            ) : pages.length === 0 && !formOpen ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <Globe className="w-7 h-7 text-white/15" />
                    </div>
                    <h3 className="text-lg font-semibold text-white/50 mb-2">No landing pages</h3>
                    <p className="text-sm text-white/25 max-w-sm mb-6">
                        Track landing pages, funnels, and booking links for this client.
                    </p>
                    <button
                        onClick={openCreateForm}
                        className="flex items-center gap-2 px-5 py-2.5 bg-flo-orange/15 text-flo-orange text-sm font-semibold rounded-xl border border-flo-orange/20 hover:bg-flo-orange/25 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Landing Page
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {pages.map((page) => (
                        <motion.div
                            key={page.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group flex items-center gap-4 px-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-all"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                                <Globe className="w-5 h-5 text-white/40" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white/80 truncate">{page.name}</p>
                                <p className="text-xs text-white/30 truncate">{page.url}</p>
                            </div>

                            {page.campaign_name && (
                                <span className="hidden md:inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-white/40 border border-white/[0.06]">
                                    {page.campaign_name}
                                </span>
                            )}

                            {page.goal && (
                                <span className="hidden lg:inline-block text-xs text-white/25 max-w-[120px] truncate">
                                    {page.goal}
                                </span>
                            )}

                            <p className="text-xs text-white/25 hidden md:block w-24 text-right">
                                {new Date(page.updated_at).toLocaleDateString()}
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => copyUrl(page.id, page.url)}
                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all"
                                    title="Copy URL"
                                >
                                    {copied === page.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <a
                                    href={page.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all"
                                    title="Open URL"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => openEditForm(page)}
                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-all"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(page.id)}
                                    className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-red-400 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Inline Form Modal */}
            <AnimatePresence>
                {formOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setFormOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <h2 className="text-lg font-semibold text-white">
                                    {editingId ? 'Edit Landing Page' : 'Add Landing Page'}
                                </h2>
                                <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Spring Promo LP"
                                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">URL *</label>
                                    <input
                                        type="url"
                                        value={form.url}
                                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                                        placeholder="https://…"
                                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Campaign</label>
                                    <input
                                        type="text"
                                        value={form.campaign_name}
                                        onChange={(e) => setForm({ ...form, campaign_name: e.target.value })}
                                        placeholder="Optional"
                                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/40 mb-1.5">Goal</label>
                                    <input
                                        type="text"
                                        value={form.goal}
                                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                                        placeholder="e.g. Bookings, Leads"
                                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-flo-orange/50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
                                <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-all">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !form.name.trim() || !form.url.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-flo-orange to-flo-orange-light text-white text-sm font-semibold rounded-xl shadow-lg shadow-flo-orange/20 disabled:opacity-50 transition-all"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {editingId ? 'Save Changes' : 'Add Page'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
