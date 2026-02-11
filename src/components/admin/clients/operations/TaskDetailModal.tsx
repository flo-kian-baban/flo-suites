'use client';

import { useState, useEffect } from 'react';
import {
    X, Trash2,
    AlertTriangle, Calendar,
} from 'lucide-react';
import { ProjectTask, TaskPriority, TaskLink, ProjectStage } from '@/lib/operations';

interface TaskDetailDrawerProps {
    task: ProjectTask | null;
    stages: ProjectStage[];
    onClose: () => void;
    onSave: (taskId: string, updates: Partial<ProjectTask>) => void;
    onDelete: (taskId: string) => void;
}

export default function TaskDetailModal({ task, onClose, onSave, onDelete }: TaskDetailDrawerProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedReason, setBlockedReason] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDueDate(task.due_date || '');
            setPriority(task.priority);
            setIsBlocked(task.is_blocked);
            setBlockedReason(task.blocked_reason || '');
        }
    }, [task]);

    if (!task) return null;

    const handleSave = () => {
        onSave(task.id, {
            title,
            description: description || null,
            due_date: dueDate || null,
            priority,
            is_blocked: isBlocked,
            blocked_reason: isBlocked ? blockedReason || null : null,
        });
        onClose();
    };


    const priorities: TaskPriority[] = ['low', 'medium', 'high'];
    const priorityColors: Record<string, string> = {
        high: 'border-red-500/30 bg-red-500/10 text-red-400',
        medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed -inset-10 z-[100] bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-lg bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto transform transition-all scale-100 opacity-100">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/[0.06] shrink-0">
                        <h2 className="text-base font-semibold text-white">Task Details</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { if (confirm('Delete this task?')) onDelete(task.id); }}
                                className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors resize-none"
                                placeholder="Add a description..."
                            />
                        </div>

                        {/* Row: Priority + Due Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">Priority</label>
                                <div className="flex gap-1.5">
                                    {priorities.map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg border transition-all capitalize ${priority === p ? priorityColors[p] : 'border-white/[0.06] text-white/25 hover:text-white/50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/40 mb-1.5">
                                    <Calendar className="w-3 h-3 inline mr-1" />Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-flo-orange/40 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Blocked */}
                        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isBlocked}
                                    onChange={(e) => setIsBlocked(e.target.checked)}
                                    className="accent-red-500 w-4 h-4"
                                />
                                <span className="flex items-center gap-1.5 text-sm text-white/60">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                    Blocked
                                </span>
                            </label>
                            {isBlocked && (
                                <input
                                    value={blockedReason}
                                    onChange={(e) => setBlockedReason(e.target.value)}
                                    placeholder="Reason..."
                                    className="w-full px-3 py-2 text-sm bg-white/[0.04] border border-red-500/20 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-colors"
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/[0.06] p-5 flex justify-end gap-3 shrink-0 bg-[#111] rounded-b-2xl">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
