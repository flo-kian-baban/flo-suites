'use client';

import { FolderKanban, AlertTriangle, Ban, CheckCircle2, Archive } from 'lucide-react';
import { ClientProject, ProjectTask, ProjectStage, getProjectProgress, getOverdueCount, getBlockedCount } from '@/lib/operations';

interface ProjectSidebarProps {
    projects: ClientProject[];
    tasksByProject: Map<string, ProjectTask[]>;
    stagesByProject: Map<string, ProjectStage[]>;
    selectedProjectId: string | null;
    onSelect: (projectId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    active: { label: 'Active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
    completed: { label: 'Done', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
    archived: { label: 'Archived', color: 'text-white/30 bg-white/5 border-white/10', icon: <Archive className="w-3 h-3" /> },
};

export default function ProjectSidebar({
    projects,
    tasksByProject,
    stagesByProject,
    selectedProjectId,
    onSelect,
}: ProjectSidebarProps) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderKanban className="w-10 h-10 text-white/10 mb-3" />
                <p className="text-sm text-white/25">No projects yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {projects.map((project) => {
                const tasks = tasksByProject.get(project.id) || [];
                const stages = stagesByProject.get(project.id) || [];
                const progress = getProjectProgress(tasks, stages);
                const overdue = getOverdueCount(tasks);
                const blocked = getBlockedCount(tasks);
                const isSelected = selectedProjectId === project.id;
                const statusCfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;

                return (
                    <button
                        key={project.id}
                        onClick={() => onSelect(project.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${isSelected
                            ? 'border-flo-orange/30 bg-flo-orange/[0.05]'
                            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                            }`}
                    >
                        {/* Name + Status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className={`text-sm font-medium leading-snug ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                {project.name}
                            </h4>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${statusCfg.color}`}>
                                {statusCfg.label}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-flo-orange rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[11px] text-white/30 font-medium w-8 text-right">{progress}%</span>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-white/25">{tasks.length} tasks</span>
                            {overdue > 0 && (
                                <span className="flex items-center gap-1 text-red-400">
                                    <AlertTriangle className="w-3 h-3" />{overdue} overdue
                                </span>
                            )}
                            {blocked > 0 && (
                                <span className="flex items-center gap-1 text-amber-400">
                                    <Ban className="w-3 h-3" />{blocked} blocked
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
