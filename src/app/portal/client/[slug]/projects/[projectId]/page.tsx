import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import ClientKanbanBoard from '@/components/portal/projects/ClientKanbanBoard';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';


export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ slug: string; projectId: string }>
}) {
    const { slug, projectId } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    // Fetch project, stages, and tasks in parallel
    const [{ data: project }, { data: stages }, { data: tasks }] = await Promise.all([
        supabaseAdmin
            .from('client_projects')
            .select('*')
            .eq('id', projectId)
            .eq('client_id', client.id)
            .single(),
        supabaseAdmin
            .from('project_stages')
            .select('*')
            .eq('project_id', projectId)
            .order('position'),
        supabaseAdmin
            .from('project_tasks')
            .select('*')
            .eq('project_id', projectId)
            .eq('visible_to_client', true)
            .order('position'),
    ]);

    if (!project) notFound();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Link
                    href={`/portal/client/${slug}/projects`}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Workflows
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white max-w-2xl">{project.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${project.status === 'active'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : project.status === 'completed'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-white/[0.05] text-white/40 border-white/[0.1]'
                                }`}>
                                {project.status}
                            </span>
                            {project.target_date && (
                                <span className="flex items-center gap-1.5 text-xs text-white/40">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Target: {new Date(project.target_date).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="h-[calc(100vh-250px)]">
                <ClientKanbanBoard stages={stages || []} tasks={tasks || []} />
            </div>
        </div>
    );
}
