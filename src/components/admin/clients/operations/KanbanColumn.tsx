'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { ProjectStage, ProjectTask } from '@/lib/operations';
import TaskCard from './TaskCard';

interface SortableTaskProps {
    task: ProjectTask;
    onClick: () => void;
    onDelete: (taskId: string) => void;
}

function SortableTask({ task, onClick, onDelete }: SortableTaskProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: 'task', task },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} onClick={onClick} onDelete={onDelete} />
        </div>
    );
}

interface KanbanColumnProps {
    stage: ProjectStage;
    tasks: ProjectTask[];
    onTaskClick: (task: ProjectTask) => void;
    onAddTask: (stageId: string, title: string) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function KanbanColumn({ stage, tasks, onTaskClick, onAddTask, onDeleteTask }: KanbanColumnProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const { setNodeRef, isOver } = useDroppable({
        id: `stage-${stage.id}`,
        data: { type: 'stage', stageId: stage.id },
    });

    const handleAdd = () => {
        if (newTitle.trim()) {
            onAddTask(stage.id, newTitle.trim());
            setNewTitle('');
            setIsAdding(false);
        }
    };

    return (
        <div
            className={`flex flex-col min-w-[300px] max-w-[300px] rounded-2xl border transition-colors duration-200 ${isOver
                ? 'border-flo-orange/30 bg-flo-orange/[0.03]'
                : 'border-white/[0.06] bg-white/[0.02]'
                }`}
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
            <div ref={setNodeRef} className="flex-1 p-3 space-y-2 min-h-[100px] overflow-y-auto max-h-[calc(100vh-320px)]">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <SortableTask key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={onDeleteTask} />
                    ))}
                </SortableContext>
            </div>

            {/* Add task */}
            <div className="p-3 border-t border-white/[0.04]">
                {isAdding ? (
                    <div className="space-y-2">
                        <input
                            autoFocus
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAdd();
                                if (e.key === 'Escape') { setIsAdding(false); setNewTitle(''); }
                            }}
                            placeholder="Task title..."
                            className="w-full px-3 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="px-3 py-1.5 text-xs font-medium bg-flo-orange text-white rounded-lg hover:bg-flo-orange-dark transition-colors"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => { setIsAdding(false); setNewTitle(''); }}
                                className="px-3 py-1.5 text-xs text-white/40 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1.5 text-xs text-white/25 hover:text-flo-orange transition-colors w-full py-1"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add task
                    </button>
                )}
            </div>
        </div>
    );
}
