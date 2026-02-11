'use client';

import { ProjectStage, ProjectTask } from '@/lib/operations';
import ClientTaskCard from './ClientTaskCard';

interface ClientKanbanColumnProps {
    stage: ProjectStage;
    tasks: ProjectTask[];
}

export default function ClientKanbanColumn({ stage, tasks }: ClientKanbanColumnProps) {
    return (
        <div
            className="flex flex-col flex-1 min-w-[300px] rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-200"
        >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-white/70">{stage.name}</h3>
                    <span className="text-[11px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-md font-medium">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-2 min-h-[100px] overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                {tasks.map((task) => (
                    <ClientTaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-white/20 italic">
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
}
