'use client';

/**
 * InlinePostForm - Inline editor for Blog and Case Study posts
 * 
 * Features:
 * - Core fields: title (auto-generates slug), category, description
 * - Cover image upload with Supabase storage or gradient/URL input
 * - Advanced content: Intro, content paragraphs (title + description), key takeaways (blogs only)
 * - Published/Draft toggle
 * 
 * Used within PostList for inline expand/collapse editing
 */

import React, { useState, useRef } from 'react';
import { Post } from '@/hooks/usePosts';
import { Save, X, Plus, Trash2, Upload, Loader2, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { uploadContentAsset } from '@/lib/content-manager';

interface InlinePostFormProps {
    type: 'blog' | 'case_study';
    initialPost?: Post;
    onSave: (data: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    onCancel: () => void;
    isNew?: boolean;
}

export default function InlinePostForm({ type, initialPost, onSave, onCancel, isNew = false }: InlinePostFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Post>>({
        type,
        title: initialPost?.title || '',
        slug: initialPost?.slug || '',
        category: initialPost?.category || '',
        description: initialPost?.description || '',
        reading_time: initialPost?.reading_time || '5 min read',
        cover_image: initialPost?.cover_image || '',
        published: initialPost?.published ?? true,
        content: initialPost?.content || {
            intro: '',
            sections: [],
            keyTakeaways: [],
            floApplication: ''
        }
    });

    const handleSave = async () => {
        if (!formData.title || !formData.slug) {
            alert('Title and Slug are required');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData as Omit<Post, 'id' | 'created_at' | 'updated_at'>);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save content');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingCover(true);
        const path = `content/${type}/${formData.slug || 'untitled'}/cover-${Date.now()}.${file.name.split('.').pop()}`;

        try {
            const publicUrl = await uploadContentAsset(file, path);
            if (publicUrl) {
                setFormData(d => ({ ...d, cover_image: publicUrl }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload cover image');
        } finally {
            setIsUploadingCover(false);
        }
    };

    // Paragraph helpers
    const addParagraph = () => {
        const newParagraph = { title: '', description: '' };
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                sections: [...(prev.content?.sections || []), newParagraph]
            }
        }));
    };

    const removeParagraph = (idx: number) => {
        const newParagraphs = formData.content?.sections?.filter((_: any, i: number) => i !== idx) || [];
        setFormData(d => ({ ...d, content: { ...d.content, sections: newParagraphs } }));
    };

    const updateParagraph = (idx: number, field: 'title' | 'description', value: string) => {
        const newParagraphs = [...(formData.content?.sections || [])];
        newParagraphs[idx] = { ...newParagraphs[idx], [field]: value };
        setFormData(d => ({ ...d, content: { ...d.content, sections: newParagraphs } }));
    };

    // Key Takeaways helpers (for blogs)
    const updateKeyTakeaway = (idx: number, value: string) => {
        const newTakeaways = [...(formData.content?.keyTakeaways || ['', '', ''])];
        newTakeaways[idx] = value;
        setFormData(d => ({ ...d, content: { ...d.content, keyTakeaways: newTakeaways } }));
    };

    const coverImageStyle = formData.cover_image?.includes('gradient')
        ? { background: formData.cover_image }
        : formData.cover_image
            ? { backgroundImage: `url(${formData.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {};

    return (
        <div className="bg-black/20 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
            <div className="p-6 space-y-6">
                {/* Top Row: Title, Slug, Category + Cover Image */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Core Fields */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-2">Title *</label>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-flo-orange/50 text-lg font-semibold"
                                placeholder={type === 'blog' ? 'Article title...' : 'Case study title...'}
                                value={formData.title}
                                onChange={e => setFormData(d => ({
                                    ...d,
                                    title: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                                }))}
                            />
                        </div>

                        {/* Slug + Category Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-flo-orange/50"
                                    value={formData.slug}
                                    onChange={e => setFormData(d => ({ ...d, slug: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-2">Category</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-flo-orange/50"
                                    placeholder="e.g. Growth, Strategy"
                                    value={formData.category}
                                    onChange={e => setFormData(d => ({ ...d, category: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-2">Short Description</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-flo-orange/50 min-h-[80px] resize-none"
                                placeholder="Brief summary for previews..."
                                value={formData.description}
                                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Right: Cover Image Upload */}
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-2">Cover Image</label>
                        <div
                            className={`relative h-48 w-full rounded-xl border-2 border-dashed transition-all overflow-hidden cursor-pointer group ${formData.cover_image ? 'border-white/20' : 'border-white/10 hover:border-flo-orange/50 bg-white/5'
                                }`}
                            style={coverImageStyle}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {!formData.cover_image && !isUploadingCover && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                    <ImageIcon className="w-10 h-10 mb-2" />
                                    <span className="text-sm">Click to upload cover</span>
                                    <span className="text-xs text-white/30 mt-1">or paste a gradient string</span>
                                </div>
                            )}

                            {formData.cover_image && !isUploadingCover && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex flex-col items-center text-white">
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-xs">Replace image</span>
                                    </div>
                                </div>
                            )}

                            {isUploadingCover && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-8 h-8 text-flo-orange animate-spin" />
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverUpload}
                            />
                        </div>

                        {/* Manual URL/Gradient Input */}
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/60 text-xs mt-2 focus:outline-none focus:border-flo-orange/50"
                            placeholder="Or paste URL/gradient..."
                            value={formData.cover_image}
                            onChange={e => setFormData(d => ({ ...d, cover_image: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Advanced Section Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Content
                </button>

                {/* Advanced Content Section */}
                {showAdvanced && (
                    <div className="space-y-6 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                        {/* Intro Paragraph */}
                        <div>
                            <label className="block text-xs font-medium text-white/60 mb-2">Intro Paragraph</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-flo-orange/50 min-h-[100px] resize-y"
                                placeholder="Opening paragraph..."
                                value={formData.content?.intro || ''}
                                onChange={e => setFormData(d => ({ ...d, content: { ...d.content, intro: e.target.value } }))}
                            />
                        </div>

                        {/* Content Paragraphs */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-white">Content Paragraphs</label>
                                    <p className="text-xs text-white/40 mt-0.5">Add paragraphs with titles and descriptions</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addParagraph}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-flo-orange/10 text-flo-orange hover:bg-flo-orange/20 rounded-lg transition-colors text-xs font-medium"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Paragraph
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.content?.sections?.map((paragraph: any, idx: number) => (
                                    <div key={idx} className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 space-y-3 group">
                                        <div className="flex items-start gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-flo-orange/20 text-flo-orange text-xs font-bold shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Paragraph Title"
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-flo-orange/50 placeholder-white/30"
                                                    value={paragraph.title || paragraph.heading || ''}
                                                    onChange={e => updateParagraph(idx, 'title', e.target.value)}
                                                />
                                                <textarea
                                                    placeholder="Write the paragraph description here..."
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white/90 focus:outline-none focus:border-flo-orange/50 min-h-[100px] resize-y placeholder-white/30 text-sm leading-relaxed"
                                                    value={paragraph.description || paragraph.content || ''}
                                                    onChange={e => updateParagraph(idx, 'description', e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeParagraph(idx)}
                                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove paragraph"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {(!formData.content?.sections || formData.content.sections.length === 0) && (
                                    <div className="text-center py-10 text-white/30 text-sm border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                                        <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                        No paragraphs yet. Click "Add Paragraph" to start writing.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Takeaways - Only for blogs */}
                        {type === 'blog' && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div>
                                    <label className="text-sm font-semibold text-white">Key Takeaways</label>
                                    <p className="text-xs text-white/40 mt-0.5">Highlight the 3 main points readers should remember</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[0, 1, 2].map((idx) => (
                                        <div key={idx} className="relative">
                                            <span className="absolute left-3 top-3 text-flo-orange font-bold text-sm">{idx + 1}.</span>
                                            <textarea
                                                placeholder={`Takeaway ${idx + 1}...`}
                                                className="w-full bg-flo-orange/5 border border-flo-orange/20 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-flo-orange/50 min-h-[80px] resize-none text-sm"
                                                value={formData.content?.keyTakeaways?.[idx] || ''}
                                                onChange={e => updateKeyTakeaway(idx, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flo Application / Conclusion */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="block text-sm font-semibold text-flo-orange mb-2">Flo Application / Conclusion</label>
                            <textarea
                                className="w-full bg-flo-orange/5 border border-flo-orange/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-flo-orange/50 min-h-[100px] resize-y"
                                placeholder="How this applies to Flo and final thoughts..."
                                value={formData.content?.floApplication || ''}
                                onChange={e => setFormData(d => ({ ...d, content: { ...d.content, floApplication: e.target.value } }))}
                            />
                        </div>
                    </div>
                )}

                {/* Footer: Published Toggle + Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div
                            className={`relative w-10 h-5 rounded-full transition-colors ${formData.published ? 'bg-emerald-500' : 'bg-white/20'}`}
                            onClick={() => setFormData(d => ({ ...d, published: !d.published }))}
                        >
                            <div
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.published ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}
                            />
                        </div>
                        <span className="text-sm text-white/60">
                            {formData.published ? 'Published' : 'Draft'}
                        </span>
                    </label>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || !formData.title || !formData.slug}
                            className="flex items-center gap-2 px-5 py-2 bg-flo-orange text-white rounded-lg hover:bg-flo-orange/90 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
