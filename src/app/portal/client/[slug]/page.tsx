import { Layers, Megaphone, FolderKanban, Image as ImageIcon, CheckCircle2, AlertCircle, FileText, ArrowRight, Clock, LayoutGrid } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import PortalPageHeader from '@/components/portal/PortalPageHeader';
import SummaryChip from '@/components/portal/overview/SummaryChip';
import ActionRow from '@/components/portal/overview/ActionRow';
import ModuleCard from '@/components/portal/overview/ModuleCard';
import EmptyState from '@/components/portal/overview/EmptyState';
import Link from 'next/link';

export default async function PortalOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const clientId = client.id;

    // Fetch data for the new layout
    const [
        { count: pendingMediaCount, data: pendingMediaItems },
        { count: activeProjectsCount, data: activeProjects },
        { count: activeCampaignsCount, data: activeCampaigns },
        { count: landingPagesCount },
        { data: latestMedia },
    ] = await Promise.all([
        // 1. Pending media (for count + action queue)
        supabaseAdmin
            .from('client_media')
            .select('*', { count: 'exact' })
            .eq('client_id', clientId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5), // Fetch up to 5 for action queue

        // 2. Active projects (for count)
        supabaseAdmin
            .from('client_projects')
            .select('*', { count: 'exact' })
            .eq('client_id', clientId)
            .eq('status', 'active'),

        // 3. Active campaigns (for count)
        supabaseAdmin
            .from('client_campaigns')
            .select('*', { count: 'exact' })
            .eq('client_id', clientId)
            .eq('status', 'active'),

        // 4. Client Landing Pages (for count)
        supabaseAdmin
            .from('client_landing_pages')
            .select('*', { count: 'exact' })
            .eq('client_id', clientId),

        // 5. Latest delivery (most recent media item)
        supabaseAdmin
            .from('client_media')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
    ]);

    // Fetch upcoming milestones (project tasks due soon)
    const projectIds = (activeProjects || []).map(p => p.id);
    let upcomingMilestones: any[] = [];

    if (projectIds.length > 0) {
        const { data: tasks } = await supabaseAdmin
            .from('project_tasks')
            .select('*, project:client_projects(name)')
            .in('project_id', projectIds)
            .eq('visible_to_client', true)
            .not('due_date', 'is', null)
            .gte('due_date', new Date().toISOString()) // Future tasks
            .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()) // Due within 7 days
            .order('due_date', { ascending: true })
            .limit(3);

        if (tasks) upcomingMilestones = tasks;
    }

    // Prepare Action Queue Items
    const actionQueue = [];

    // Add pending media to action queue
    (pendingMediaItems || []).slice(0, 3).forEach(media => {
        actionQueue.push({
            id: `media-${media.id}`,
            type: 'media',
            title: 'Review Content',
            subtitle: `${media.title || 'Untitled Media'} requires your approval`,
            href: `/portal/client/${slug}/media`,
            icon: <ImageIcon className="w-5 h-5" />,
            priority: 1
        });
    });

    // Add upcoming milestones to action queue
    upcomingMilestones.forEach(task => {
        actionQueue.push({
            id: `task-${task.id}`,
            type: 'milestone',
            title: 'Upcoming Milestone',
            subtitle: `${task.title} due on ${new Date(task.due_date).toLocaleDateString()}`,
            href: `/portal/client/${slug}/projects/${task.project_id}`,
            icon: <Clock className="w-5 h-5" />,
            priority: 2
        });
    });

    // Sort action queue by priority
    actionQueue.sort((a, b) => a.priority - b.priority);
    const displayedActions = actionQueue.slice(0, 5);

    // Format latest delivery date
    const latestDeliveryDate = latestMedia
        ? new Date(latestMedia.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'N/A';

    return (
        <div className="pb-20 bg-[#0A0A0A] text-white">

            <div className="space-y-10">
                {/* Assets Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-flo-orange/10 border border-flo-orange/20 text-flo-orange">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Assets</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Media Module */}
                        <ModuleCard
                            title="Media Library"
                            status="Access all your deliverables including images, videos, and infographics."
                            icon={<ImageIcon className="w-6 h-6" />}
                            href={`/portal/client/${slug}/media`}
                            badgeCount={pendingMediaCount || 0}
                        />

                        {/* Landing Pages Module */}
                        <ModuleCard
                            title="Landing Pages"
                            status="Manage and monitor performance of your published landing pages."
                            icon={<Layers className="w-6 h-6" />}
                            href={`/portal/client/${slug}/landing-pages`}
                            badgeCount={landingPagesCount || 0}
                        />

                        {/* Campaigns Module */}
                        <ModuleCard
                            title="Campaigns"
                            status="Track online marketing campaigns and view associated assets."
                            icon={<Megaphone className="w-6 h-6" />}
                            href={`/portal/client/${slug}/campaigns`}
                            badgeCount={activeCampaignsCount || 0}
                        />
                    </div>
                </section>

                {/* Operations Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-flo-orange/10 border border-flo-orange/20 text-flo-orange">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Operations</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Workflows Module */}
                        <ModuleCard
                            title="Workflows"
                            status="Manage websites, landing pages, and video production sessions."
                            icon={<FolderKanban className="w-6 h-6" />}
                            href={`/portal/client/${slug}/projects`}
                            badgeCount={activeProjectsCount || 0}
                        />

                        {/* Resources Module */}
                        <ModuleCard
                            title="Resources"
                            status="Access brand guidelines, shared assets, and project documentation."
                            icon={<FileText className="w-6 h-6" />}
                            href={`/portal/client/${slug}/resources`}
                        />
                    </div>
                </section>

                {/* Action Queue Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-flo-orange/10 border border-flo-orange/20 text-flo-orange">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold text-white tracking-tight">Needs Your Attention</h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {displayedActions.length > 0 ? (
                            displayedActions.map((action) => (
                                <ActionRow
                                    key={action.id}
                                    icon={action.icon}
                                    title={action.title}
                                    subtitle={action.subtitle}
                                    href={action.href}
                                    ctaText="Open"
                                />
                            ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

