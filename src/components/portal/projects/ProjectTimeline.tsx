import { CheckCircle2, Circle, Clock, CheckSquare } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description: string | null;
    dueDate: string | null;
    isBlocked: boolean;
    stageId: string;
    position: number;
}

interface Stage {
    id: string;
    name: string;
    position: number;
    tasks: Task[];
}

interface ProjectTimelineProps {
    stages: Stage[];
}

export default function ProjectTimeline({ stages }: ProjectTimelineProps) {
    return (
        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-white/[0.06] before:-z-10">
            {stages.map((stage, index) => {
                const isLastStage = index === stages.length - 1;
                const hasTasks = stage.tasks.length > 0;

                return (
                    <div key={stage.id} className="relative pl-10">
                        {/* Stage Marker */}
                        <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 bg-[#0a0a0a] ${isLastStage
                                ? 'border-green-500/50 text-green-500'
                                : 'border-flo-orange/50 text-flo-orange'
                            }`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${isLastStage ? 'bg-green-500' : 'bg-flo-orange'
                                }`} />
                        </div>

                        {/* Stage Header */}
                        <h3 className="text-lg font-semibold text-white mb-4">{stage.name}</h3>

                        {/* Tasks */}
                        {!hasTasks ? (
                            <p className="text-sm text-white/30 italic mb-6">No visible tasks in this stage.</p>
                        ) : (
                            <div className="space-y-3 mb-8">
                                {stage.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 rounded-xl border flex items-start justify-between group ${isLastStage
                                                ? 'bg-green-500/[0.02] border-green-500/10'
                                                : task.isBlocked
                                                    ? 'bg-red-500/[0.02] border-red-500/10'
                                                    : 'bg-white/[0.03] border-white/[0.06]'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 ${isLastStage ? 'text-green-500/60' : 'text-white/20'
                                                }`}>
                                                {isLastStage ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium ${isLastStage ? 'text-white/60 line-through' : 'text-white'
                                                    }`}>
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-xs text-white/40 mt-1 line-clamp-2">{task.description}</p>
                                                )}
                                                {task.isBlocked && (
                                                    <span className="inline-block mt-2 text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">
                                                        Blocked
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {task.dueDate && (
                                            <div className="flex items-center gap-1.5 text-xs text-white/30 px-2 py-1 bg-white/[0.02] rounded">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
