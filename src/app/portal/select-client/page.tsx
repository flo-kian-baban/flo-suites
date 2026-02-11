import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import SelectClientContent from './SelectClientContent';

export default async function PortalSelectClientPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/portal/login');
    }

    // Fetch active client mappings with client details
    const { data: mappings } = await supabase
        .from('portal_user_clients')
        .select(`
            id,
            role,
            clients:client_id (
                id,
                slug,
                business_name,
                logo_url,
                vertical
            )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

    const activeMappings = mappings || [];

    if (activeMappings.length === 0) {
        redirect('/portal/pending');
    }

    if (activeMappings.length === 1) {
        const clientRaw = (activeMappings[0] as any).clients;
        const client = Array.isArray(clientRaw) ? clientRaw[0] : clientRaw;

        if (client?.slug) {
            redirect(`/portal/client/${client.slug}`);
        }
    }

    // Supabase types FK relations as arrays, but single FK yields a single object at runtime
    return <SelectClientContent mappings={activeMappings as any} />;
}
