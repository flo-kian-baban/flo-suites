'use client';

import { ArrowRight, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import DashboardCard from '../DashboardCard';

interface ProjectSummary {
    id: string;
    name: string;
    status: string;
    progress: number; // 0-100
    stage: string;
    dueDate?: string | null;
}

interface ActiveProjectsWidgetProps {
    projects: ProjectSummary[];
    clientSlug: string;
}

export default function ActiveProjectsWidget({ projects, clientSlug }: ActiveProjectsWidgetProps) {
    return (
        <DashboardCard delay={0.1} className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-flo-orange/10 border border-flo-orange/20">
                        <FolderKanban className="w-4 h-4 text-flo-orange" />
                    </div>
                    <h3 className="text-base font-bold text-white">Active Projects</h3>
                </div>
                <Link
                    href={`/portal/client/${clientSlug}/projects`}
                    className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                >
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="flex-1 space-y-5">
                {projects.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6">
                        <p className="text-xs text-white/30">No active projects currently.</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/portal/client/${clientSlug}/projects`}
                            className="block group/item"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-semibold text-white group-hover/item:text-flo-orange transition-colors duration-200">
                                    {project.name}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 font-medium">
                                    {project.stage}
                                </span>
                            </div>

                            <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-flo-orange to-flo-orange-light rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(241,89,45,0.4)]"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-white/40 font-medium">
                                <span>{project.progress}% Complete</span>
                                {project.dueDate && <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </DashboardCard>
    );
}

