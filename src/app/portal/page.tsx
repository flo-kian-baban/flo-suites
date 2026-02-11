import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function PortalEntryPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/portal/login');
    }

    // Fetch active client mappings
    const { data: mappings } = await supabase
        .from('portal_user_clients')
        .select('client_id, clients:client_id (slug)')
        .eq('user_id', user.id)
        .eq('is_active', true);

    const activeMappings = mappings || [];

    if (activeMappings.length === 0) {
        redirect('/portal/pending');
    }

    if (activeMappings.length === 1) {
        // Handle Supabase join which might return array or object
        const clientRaw = (activeMappings[0] as any).clients;
        const client = Array.isArray(clientRaw) ? clientRaw[0] : clientRaw;

        if (client?.slug) {
            redirect(`/portal/client/${client.slug}`);
        }
        redirect('/portal/pending');
    }

    // Multiple clients — go to selector
    redirect('/portal/select-client');
}
