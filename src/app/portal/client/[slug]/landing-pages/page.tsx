import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import { ExternalLink, Globe } from 'lucide-react';
import PortalPageHeader from '@/components/portal/PortalPageHeader';


export default async function PortalLandingPagesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const { data: pages } = await supabaseAdmin
        .from('client_landing_pages')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <PortalPageHeader
                title="Landing Pages"
                description="Access all live landing pages and funnels."
            />

            <div className="bg-black/20 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Page Name</th>
                                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Goal</th>
                                <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {!pages || pages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/30 text-sm">
                                        No landing pages found.
                                    </td>
                                </tr>
                            ) : (
                                pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{page.name}</p>
                                                    <p className="text-xs text-white/30 font-mono mt-0.5">{(() => { try { return new URL(page.url).hostname; } catch { return page.url; } })()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            {page.goal || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            {page.campaign_name ? (
                                                <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.05] text-xs">
                                                    {page.campaign_name}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={page.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 hover:text-white text-xs font-medium text-white/60 transition-all border border-transparent hover:border-white/[0.1]"
                                            >
                                                Open <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
