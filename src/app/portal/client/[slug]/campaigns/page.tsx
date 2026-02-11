import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import CampaignAccordion from '@/components/portal/campaigns/CampaignAccordion';
import PortalPageHeader from '@/components/portal/PortalPageHeader';


export default async function PortalCampaignsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const { data: campaigns } = await supabaseAdmin
        .from('client_campaigns')
        .select('*')
        .eq('client_id', client.id)
        .order('status', { ascending: true })
        .order('created_at', { ascending: false });

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <PortalPageHeader
                title="Marketing Campaigns"
                description="View strategy, targeting, and active offers."
            />

            {!campaigns || campaigns.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-white/40">No campaigns found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {campaigns.map((c) => (
                        <CampaignAccordion
                            key={c.id}
                            campaign={{
                                id: c.id,
                                name: c.name,
                                status: c.status,
                                objective: c.objective,
                                offer: c.offer,
                                targetingSummary: c.targeting_summary,
                                targetingLocation: c.targeting_location,
                                messagingPillars: c.messaging_pillars,
                                startDate: c.start_date,
                                endDate: c.end_date
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
