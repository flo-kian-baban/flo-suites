'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { ProjectType } from '@/lib/operations';

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
    { value: 'content', label: 'Content' },
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'automation', label: 'Automation' },
    { value: 'website', label: 'Website' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'other', label: 'Other' },
];

interface ProjectCreateModalProps {
    onClose: () => void;
    onCreate: (
        name: string,
        projectType: ProjectType,
        startDate?: string,
        targetDate?: string
    ) => void;
}

export default function ProjectCreateModal({ onClose, onCreate }: ProjectCreateModalProps) {
    const [name, setName] = useState('');
    const [projectType, setProjectType] = useState<ProjectType>('content');
    const [startDate, setStartDate] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await onCreate(
                name.trim(),
                projectType,
                startDate || undefined,
                targetDate || undefined
            );
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                        <h2 className="text-base font-semibold text-white">New Project</h2>
                        <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Project Name *</label>
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                                placeholder="e.g. January Content Batch"
                            />
                        </div>

                        {/* Project Type */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Type</label>
                            <div className="flex flex-wrap gap-1.5">
                                {PROJECT_TYPES.map((pt) => (
                                    <button
                                        key={pt.value}
                                        type="button"
                                        onClick={() => setProjectType(pt.value)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${projectType === pt.value
                                            ? 'border-flo-orange/40 bg-flo-orange/10 text-flo-orange'
                                            : 'border-white/[0.06] text-white/30 hover:text-white/60'
                                            }`}
                                    >
                                        {pt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">
                                    <Calendar className="w-3 h-3 inline mr-1" />Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">
                                    <Calendar className="w-3 h-3 inline mr-1" />Target Date
                                </label>
                                <input
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!name.trim() || loading}
                            className="px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
