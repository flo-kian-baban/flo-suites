import { redirect } from 'next/navigation';
import { getClientBySlug, verifyClientAccess } from '@/lib/portalAccess';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import PortalShell from '@/components/portal/PortalShell';

export default async function ClientPortalLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Verify access and get user info
    const access = await verifyClientAccess(slug);

    if (!access) {
        redirect('/portal/select-client');
    }

    // Fetch user's full_name from portal_users
    const { data: portalUser } = await supabaseAdmin
        .from('portal_users')
        .select('full_name')
        .eq('id', access.user.id)
        .single();

    const userName = portalUser?.full_name || access.user.email || '';

    return (
        <PortalShell
            clientSlug={slug}
            clientName={access.client.business_name}
            clientLogo={access.client.logo_url}
            clientId={access.client.id}
            userEmail={access.user.email || ''}
            userName={userName}
            role={access.role}
        >
            {children}
        </PortalShell>
    );
}
