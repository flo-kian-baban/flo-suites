'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, FolderKanban, Loader2 } from 'lucide-react';
import {
    ClientProject,
    ProjectStage,
    ProjectTask,
    ProjectType,
    getClientProjects,
    getProjectStages,
    getProjectTasks,
    createProject,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
} from '@/lib/operations';
import ProjectSidebar from './ProjectSidebar';
import ProjectCreateModal from './ProjectCreateModal';
import KanbanBoard from './KanbanBoard';
import TaskDetailModal from './TaskDetailModal';


interface OperationsTabProps {
    clientId: string;
}

export default function OperationsTab({ clientId }: OperationsTabProps) {
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [stages, setStages] = useState<ProjectStage[]>([]);
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [allTasksByProject, setAllTasksByProject] = useState<Map<string, ProjectTask[]>>(new Map());
    const [allStagesByProject, setAllStagesByProject] = useState<Map<string, ProjectStage[]>>(new Map());

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
    const [loading, setLoading] = useState(true);

    // Load all projects + their tasks/stages for sidebar stats
    const loadProjects = useCallback(async () => {
        setLoading(true);
        try {
            const projs = await getClientProjects(clientId);
            setProjects(projs);

            const taskMap = new Map<string, ProjectTask[]>();
            const stageMap = new Map<string, ProjectStage[]>();
            for (const p of projs) {
                const [pStages, pTasks] = await Promise.all([
                    getProjectStages(p.id),
                    getProjectTasks(p.id),
                ]);
                stageMap.set(p.id, pStages);
                taskMap.set(p.id, pTasks);
            }
            setAllTasksByProject(taskMap);
            setAllStagesByProject(stageMap);

            // Auto-select first project if none selected
            if (!selectedProjectId && projs.length > 0) {
                setSelectedProjectId(projs[0].id);
            }
        } catch (err) {
            console.error('Failed to load projects:', err);
        } finally {
            setLoading(false);
        }
    }, [clientId, selectedProjectId]);

    useEffect(() => { loadProjects(); }, [clientId]);

    // Load selected project's board
    useEffect(() => {
        if (!selectedProjectId) {
            setStages([]);
            setTasks([]);
            return;
        }
        const cachedStages = allStagesByProject.get(selectedProjectId);
        const cachedTasks = allTasksByProject.get(selectedProjectId);
        if (cachedStages) setStages(cachedStages);
        if (cachedTasks) setTasks(cachedTasks);

        // Refresh from DB
        Promise.all([
            getProjectStages(selectedProjectId),
            getProjectTasks(selectedProjectId),
        ]).then(([s, t]) => {
            setStages(s);
            setTasks(t);
        });
    }, [selectedProjectId]);

    // Handlers
    const handleCreateProject = async (
        name: string,
        projectType: ProjectType,
        startDate?: string,
        targetDate?: string
    ) => {
        const newId = await createProject(clientId, name, projectType, undefined, startDate, targetDate);
        setSelectedProjectId(newId);
        await loadProjects();
    };

    const handleAddTask = async (stageId: string, title: string) => {
        if (!selectedProjectId) return;
        const stageTasks = tasks.filter((t) => t.stage_id === stageId);
        const newTask = await createTask(selectedProjectId, stageId, title, stageTasks.length);
        setTasks((prev) => [...prev, newTask]);
        // Update sidebar cache
        setAllTasksByProject((prev) => {
            const updated = new Map(prev);
            updated.set(selectedProjectId, [...(updated.get(selectedProjectId) || []), newTask]);
            return updated;
        });
    };

    const handleMoveTask = async (taskId: string, newStageId: string, newPosition: number) => {
        await moveTask(taskId, newStageId, newPosition);
        // Refresh board
        if (selectedProjectId) {
            const updated = await getProjectTasks(selectedProjectId);
            setTasks(updated);
            setAllTasksByProject((prev) => {
                const m = new Map(prev);
                m.set(selectedProjectId, updated);
                return m;
            });
        }
    };

    const handleReorderTasks = (updatedTasks: ProjectTask[]) => {
        setTasks(updatedTasks);
    };

    const handleTaskSave = async (taskId: string, updates: Partial<ProjectTask>) => {
        await updateTask(taskId, updates);
        if (selectedProjectId) {
            const updated = await getProjectTasks(selectedProjectId);
            setTasks(updated);
            setAllTasksByProject((prev) => {
                const m = new Map(prev);
                m.set(selectedProjectId, updated);
                return m;
            });
        }
        setSelectedTask(null);
    };

    const handleTaskDelete = async (taskId: string) => {
        await deleteTask(taskId);
        setSelectedTask(null);
        if (selectedProjectId) {
            const updated = await getProjectTasks(selectedProjectId);
            setTasks(updated);
            setAllTasksByProject((prev) => {
                const m = new Map(prev);
                m.set(selectedProjectId, updated);
                return m;
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 text-flo-orange animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-flo-orange" />
                <h2 className="text-lg font-semibold text-white">Operations</h2>
                <span className="text-xs text-white/25 bg-white/[0.04] px-2.5 py-1 rounded-lg">
                    {projects.length} project{projects.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Main layout */}
            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                        <FolderKanban className="w-7 h-7 text-white/15" />
                    </div>
                    <h3 className="text-base font-semibold text-white/50 mb-2">No projects yet</h3>
                    <p className="text-sm text-white/25 max-w-sm mb-5">
                        Create your first project to start tracking operations for this client.
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            ) : (
                <div className="flex gap-8">
                    {/* Left rail */}
                    <div className="w-72 shrink-0 space-y-4">
                        <ProjectSidebar
                            projects={projects}
                            tasksByProject={allTasksByProject}
                            stagesByProject={allStagesByProject}
                            selectedProjectId={selectedProjectId}
                            onSelect={setSelectedProjectId}
                        />
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-semibold bg-flo-orange hover:bg-flo-orange-dark text-white rounded-xl transition-all shadow-lg shadow-flo-orange/20"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Project
                        </button>
                    </div>

                    {/* Kanban board */}
                    <div className="flex-1 min-w-0">
                        {selectedProjectId ? (
                            <KanbanBoard
                                stages={stages}
                                tasks={tasks}
                                onTaskClick={setSelectedTask}
                                onAddTask={handleAddTask}
                                onMoveTask={handleMoveTask}
                                onReorderTasks={handleReorderTasks}
                                onDeleteTask={handleTaskDelete}
                            />
                        ) : (
                            <div className="flex items-center justify-center py-20 text-sm text-white/25">
                                Select a project from the sidebar
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals / Drawers */}
            {showCreateModal && (
                <ProjectCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateProject}
                />
            )}


            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    stages={stages}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleTaskSave}
                    onDelete={handleTaskDelete}
                />
            )}
        </div>
    );
}
