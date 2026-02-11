'use client';

import { Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { ProjectTask } from '@/lib/operations';

const PRIORITY_CARD: Record<string, string> = {
    high: 'bg-red-500/[0.06] border-red-500/20 hover:border-red-500/30 hover:bg-red-500/[0.08]',
    medium: 'bg-amber-500/[0.06] border-amber-500/20 hover:border-amber-500/30 hover:bg-amber-500/[0.08]',
    low: 'bg-emerald-500/[0.06] border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]',
};

interface TaskCardProps {
    task: ProjectTask;
    onClick: () => void;
    onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.due_date && task.due_date < today;

    // Calculate days remaining
    const daysLeft = task.due_date
        ? Math.ceil((new Date(task.due_date + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const daysColor = daysLeft === null
        ? ''
        : daysLeft < 0
            ? 'text-red-400 bg-red-500/10 border-red-500/20'
            : daysLeft <= 2
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-white/40 bg-white/[0.04] border-white/[0.06]';

    const daysLabel = daysLeft === null
        ? ''
        : daysLeft < 0
            ? `${Math.abs(daysLeft)}d late`
            : daysLeft === 0
                ? 'Today'
                : `${daysLeft}d`;

    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group cursor-grab active:cursor-grabbing relative ${PRIORITY_CARD[task.priority]}`}
        >
            {/* Top-right actions */}
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1">
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete this task?')) onDelete(task.id); }}
                        className="p-1 text-white/10 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                        title="Delete task"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </span>

            {/* Title row with days badge */}
            <div className="flex items-center gap-2 pr-12">
                {daysLeft !== null && (
                    <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${daysColor}`}>
                        {daysLabel}
                    </span>
                )}
                <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
                    {task.title}
                </p>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-xs text-white/35 mt-1.5 leading-relaxed line-clamp-1 pr-12">
                    {task.description}
                </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">

                {/* Due date */}
                {task.due_date && (
                    <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-red-400' : 'text-white/30'}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                )}

                {/* Blocked */}
                {task.is_blocked && (
                    <span className="flex items-center gap-1 text-[11px] text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        Blocked
                    </span>
                )}
            </div>

        </div>
    );
}
