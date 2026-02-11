import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import Link from 'next/link';
import ProjectAccordion from '@/components/portal/projects/ProjectAccordion';
import PortalPageHeader from '@/components/portal/PortalPageHeader';


export default async function PortalProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const clientId = client.id;

    // Fetch projects
    const { data: projects, error } = await supabaseAdmin
        .from('client_projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return <div>Error loading projects.</div>;
    }

    const safeProjects = projects || [];
    const projectIds = safeProjects.map(p => p.id);

    // ── Batch-fetch all tasks + stages for ALL projects (eliminates N+1) ──
    let tasksMap = new Map<string, any[]>();
    let stagesMap = new Map<string, any[]>();

    if (projectIds.length > 0) {
        const [{ data: tasks }, { data: stages }] = await Promise.all([
            supabaseAdmin
                .from('project_tasks')
                .select('*')
                .eq('visible_to_client', true)
                .in('project_id', projectIds),
            supabaseAdmin
                .from('project_stages')
                .select('*')
                .in('project_id', projectIds)
                .order('position'),
        ]);

        for (const t of (tasks || [])) {
            if (!tasksMap.has(t.project_id)) tasksMap.set(t.project_id, []);
            tasksMap.get(t.project_id)!.push(t);
        }
        for (const s of (stages || [])) {
            if (!stagesMap.has(s.project_id)) stagesMap.set(s.project_id, []);
            stagesMap.get(s.project_id)!.push(s);
        }
    }

    // Map data for rendering
    const projectsWithBoardData = safeProjects.map(p => {
        const pTasks = tasksMap.get(p.id) || [];
        const pStages = stagesMap.get(p.id) || [];

        return {
            ...p,
            stages: pStages,
            tasks: pTasks
        };
    });

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <PortalPageHeader
                title="Workflows"
                description="Track progress on your deliverables."
            />

            {projectsWithBoardData.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-white/40">No active workflows found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {projectsWithBoardData.map((project) => (
                        <ProjectAccordion
                            key={project.id}
                            project={project}
                            stages={project.stages}
                            tasks={project.tasks}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
