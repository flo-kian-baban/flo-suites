import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        status: string;
        progress: number;
        startDate: string | null;
        targetDate: string | null;
        taskCount: number;
        completedTaskCount: number;
    };
    clientSlug: string;
}

export default function ProjectCard({ project, clientSlug }: ProjectCardProps) {
    return (
        <Link
            href={`/portal/client/${clientSlug}/projects/${project.id}`}
            className="block bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-flo-orange transition-colors">
                        {project.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-white/40">
                        {project.targetDate && (
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Target: {new Date(project.targetDate).toLocaleDateString()}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {project.completedTaskCount} / {project.taskCount} tasks
                        </span>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-medium tracking-wider border ${project.status === 'active'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : project.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-white/[0.05] text-white/40 border-white/[0.1]'
                    }`}>
                    {project.status}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                <div
                    className="absolute top-0 left-0 h-full bg-flo-orange rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                />
            </div>
            <div className="flex justify-between items-center text-xs text-white/30">
                <span>{project.progress}% Complete</span>
                <div className="group-hover:text-white transition-colors flex items-center gap-1">
                    View Details <ArrowRight className="w-3 h-3" />
                </div>
            </div>
        </Link>
    );
}
