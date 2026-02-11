import MediaRow from '@/components/portal/media/MediaRow';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import { getAssetUrl } from '@/lib/client-media';
import Link from 'next/link';
import PortalPageHeader from '@/components/portal/PortalPageHeader';


export default async function PortalMediaPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ status?: string }>
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const clientId = client.id;
    const status = resolvedSearchParams.status || 'all';

    // Fetch media items
    let query = supabaseAdmin
        .from('client_media')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data: mediaItems, error } = await query;

    if (error) {
        console.error('Error fetching media:', error);
    }

    const items = mediaItems || [];
    const tabs = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
    ];

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <PortalPageHeader
                    title="Media Library"
                    description="Review and approve content for your campaigns."
                />

                {/* Tabs */}
                <div className="flex p-1 bg-white/[0.05] rounded-lg self-start sm:self-auto backdrop-blur-sm border border-white/[0.05]">
                    {tabs.map((tab) => {
                        const isActive = status === tab.value;
                        return (
                            <Link
                                key={tab.value}
                                href={`/portal/client/${slug}/media?status=${tab.value}`}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive
                                    ? 'bg-flo-orange text-white shadow-lg shadow-flo-orange/20'
                                    : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            {items.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-white/40">No media items found for this filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => {
                        const firstAsset = item.assets?.[0];
                        const previewUrl = firstAsset ? getAssetUrl(firstAsset.storage_path) : null;

                        return (
                            <MediaRow
                                key={item.id}
                                item={item as any}
                                previewUrl={previewUrl}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
