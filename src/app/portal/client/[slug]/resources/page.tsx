import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getClientBySlug } from '@/lib/portalAccess';
import ResourcesViewer from '@/components/portal/resources/ResourcesViewer';
import PortalPageHeader from '@/components/portal/PortalPageHeader';


export default async function PortalResourcesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = await getClientBySlug(slug);
    if (!client) return null;

    const { data: docs } = await supabaseAdmin
        .from('client_documents')
        .select('*')
        .eq('client_id', client.id);

    const documents = (docs || []).map(d => ({
        id: d.id,
        type: d.doc_type,
        content: d.markdown,
        updatedAt: d.updated_at
    }));

    // If no docs, show empty state
    if (documents.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Resources</h2>
                    <p className="text-white/60">Core operating documents and strategies.</p>
                </div>
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-white/40">No documents available yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <PortalPageHeader
                title="Resources"
                description="Core operating documents and strategies."
            />

            <ResourcesViewer documents={documents} />
        </div>
    );
}
