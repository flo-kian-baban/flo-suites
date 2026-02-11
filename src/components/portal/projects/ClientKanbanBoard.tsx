'use client';

import { useMemo } from 'react';
import { ProjectStage, ProjectTask } from '@/lib/operations';
import ClientKanbanColumn from './ClientKanbanColumn';

interface ClientKanbanBoardProps {
    stages: ProjectStage[];
    tasks: ProjectTask[];
}

export default function ClientKanbanBoard({ stages, tasks }: ClientKanbanBoardProps) {
    // Group tasks by stage
    const tasksByStage = useMemo(() => {
        const map = new Map<string, ProjectTask[]>();
        for (const stage of stages) {
            map.set(stage.id, []);
        }
        for (const task of tasks) {
            const arr = map.get(task.stage_id);
            if (arr) arr.push(task);
        }
        // Sort each group by position
        for (const arr of map.values()) {
            arr.sort((a, b) => a.position - b.position);
        }
        return map;
    }, [stages, tasks]);

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex gap-6 w-full overflow-x-auto pb-4 custom-scrollbar">
                {stages.map((stage) => (
                    <ClientKanbanColumn
                        key={stage.id}
                        stage={stage}
                        tasks={tasksByStage.get(stage.id) || []}
                    />
                ))}
            </div>
        </div>
    );
}
