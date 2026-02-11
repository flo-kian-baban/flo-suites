'use client';

import { useState } from 'react';
import { ChevronDown, Calendar, ArrowUpRight } from 'lucide-react';
import { ProjectStage, ProjectTask } from '@/lib/operations';
import ClientKanbanBoard from './ClientKanbanBoard';

interface ProjectAccordionProps {
    project: {
        id: string;
        name: string;
        status: string;
        target_date: string | null;
    };
    stages: ProjectStage[];
    tasks: ProjectTask[];
}

export default function ProjectAccordion({ project, stages, tasks }: ProjectAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate progress
    const taskCount = tasks.length;
    const completedCount = tasks.filter(t => {
        const stage = stages.find(s => s.id === t.stage_id);
        // Assuming last stage is "Done" equivalent, or we should look for "completed" status if we had it. 
        // For now, let's use the last stage as completed.
        return stage && stage.position === stages.length - 1;
    }).length;

    const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

    return (
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-flo-orange/10 text-flo-orange' : 'bg-white/[0.05] text-white/40 group-hover:text-white'}`}>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-flo-orange transition-colors">
                            {project.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5 text-sm text-white/40">
                            {project.target_date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Target: {new Date(project.target_date).toLocaleDateString()}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <span>•</span>
                                {taskCount} tasks
                                <span>•</span>
                                {progress}% complete
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-medium tracking-wider border ${project.status === 'active'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-white/[0.05] text-white/40 border-white/[0.1]'
                        }`}>
                        {project.status}
                    </span>
                </div>
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-white/[0.06]">
                        <div className="pt-6">
                            <ClientKanbanBoard
                                stages={stages}
                                tasks={tasks}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
