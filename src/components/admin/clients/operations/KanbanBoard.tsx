'use client';

import { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Search } from 'lucide-react';
import { ProjectStage, ProjectTask } from '@/lib/operations';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';


interface KanbanBoardProps {
    stages: ProjectStage[];
    tasks: ProjectTask[];
    onTaskClick: (task: ProjectTask) => void;
    onAddTask: (stageId: string, title: string) => void;
    onMoveTask: (taskId: string, newStageId: string, newPosition: number) => void;
    onReorderTasks: (updatedTasks: ProjectTask[]) => void;
    onDeleteTask: (taskId: string) => void;
}

export default function KanbanBoard({
    stages,
    tasks,
    onTaskClick,
    onAddTask,
    onMoveTask,
    onReorderTasks,
    onDeleteTask,
}: KanbanBoardProps) {
    const [search, setSearch] = useState('');
    const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Filter tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [tasks, search]);

    // Group tasks by stage
    const tasksByStage = useMemo(() => {
        const map = new Map<string, ProjectTask[]>();
        for (const stage of stages) {
            map.set(stage.id, []);
        }
        for (const task of filteredTasks) {
            const arr = map.get(task.stage_id);
            if (arr) arr.push(task);
        }
        // Sort each group by position
        for (const arr of map.values()) {
            arr.sort((a, b) => a.position - b.position);
        }
        return map;
    }, [stages, filteredTasks]);

    const handleDragStart = (e: DragStartEvent) => {
        const task = tasks.find((t) => t.id === e.active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (e: DragOverEvent) => {
        const { active, over } = e;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find source and target stage
        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        let targetStageId: string | null = null;

        if (overId.startsWith('stage-')) {
            targetStageId = overId.replace('stage-', '');
        } else {
            const overTask = tasks.find((t) => t.id === overId);
            if (overTask) targetStageId = overTask.stage_id;
        }

        if (targetStageId && targetStageId !== activeTask.stage_id) {
            // Move task to new stage (temporary in-memory)
            const updatedTasks = tasks.map((t) =>
                t.id === activeId ? { ...t, stage_id: targetStageId! } : t
            );
            onReorderTasks(updatedTasks);
        }
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = e;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const draggedTask = tasks.find((t) => t.id === activeId);
        if (!draggedTask) return;

        let targetStageId = draggedTask.stage_id;

        if (overId.startsWith('stage-')) {
            targetStageId = overId.replace('stage-', '');
        } else {
            const overTask = tasks.find((t) => t.id === overId);
            if (overTask) targetStageId = overTask.stage_id;
        }

        // Calculate new position
        const stageTasks = tasks
            .filter((t) => t.stage_id === targetStageId && t.id !== activeId)
            .sort((a, b) => a.position - b.position);

        let newPosition = 0;
        if (overId.startsWith('stage-')) {
            newPosition = stageTasks.length;
        } else {
            const overIndex = stageTasks.findIndex((t) => t.id === overId);
            newPosition = overIndex >= 0 ? overIndex : stageTasks.length;
        }

        onMoveTask(activeId, targetStageId, newPosition);
    };


    return (
        <div className="flex flex-col gap-5">
            {/* Filters bar */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
                    />
                </div>
            </div>

            {/* Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {stages.map((stage) => (
                        <KanbanColumn
                            key={stage.id}
                            stage={stage}
                            tasks={tasksByStage.get(stage.id) || []}
                            onTaskClick={onTaskClick}
                            onAddTask={onAddTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask && (
                        <div className="opacity-90 scale-105">
                            <TaskCard task={activeTask} onClick={() => { }} />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
