'use server';

import { supabaseAdmin as supabase } from './supabaseAdmin';
import { createSupabaseServerClient } from './supabaseServer';
import type { PortalUser, PortalUserRole, PortalUserStatus } from './portalTypes';

// Re-export types for convenience
export type { PortalUser, PortalUserRole, PortalUserStatus, PortalUserClient, PortalUserClientWithDetails } from './portalTypes';

// ─── Admin Server Actions ──────────────────────────────

/** Search portal users by email (admin) */
export async function searchPortalUsers(query: string): Promise<PortalUser[]> {
    const { data, error } = await supabase
        .from('portal_users')
        .select('*')
        .ilike('email', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data || [];
}

/** Get all portal users linked to a specific client (admin) */
export async function getLinkedUsersForClient(clientId: string) {
    // Step 1: fetch mappings
    const { data: mappings, error: mappingError } = await supabase
        .from('portal_user_clients')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (mappingError) throw mappingError;
    if (!mappings || mappings.length === 0) return [];

    // Step 2: fetch portal_users for each user_id
    const userIds = mappings.map((m) => m.user_id);
    const { data: users, error: usersError } = await supabase
        .from('portal_users')
        .select('id, email, full_name, status')
        .in('id', userIds);

    if (usersError) throw usersError;

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    // Combine mappings with portal_users data
    return mappings.map((m) => ({
        ...m,
        portal_users: userMap.get(m.user_id) || { id: m.user_id, email: 'unknown', full_name: null, status: 'pending' },
    }));
}

/** Grant a portal user access to a client (admin) */
export async function grantClientAccess(
    userId: string,
    clientId: string,
    role: PortalUserRole = 'viewer'
) {
    // Upsert mapping
    const { error: mappingError } = await supabase
        .from('portal_user_clients')
        .upsert(
            { user_id: userId, client_id: clientId, role, is_active: true },
            { onConflict: 'user_id,client_id' }
        );

    if (mappingError) throw mappingError;

    // Set user status to approved
    const { error: statusError } = await supabase
        .from('portal_users')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', userId);

    if (statusError) throw statusError;
}

/** Revoke (deactivate) a portal user's access to a client (admin) */
export async function revokeClientAccess(mappingId: string) {
    const { error } = await supabase
        .from('portal_user_clients')
        .update({ is_active: false })
        .eq('id', mappingId);

    if (error) throw error;
}

/** Reactivate a portal user's access (admin) */
export async function reactivateClientAccess(mappingId: string) {
    const { error } = await supabase
        .from('portal_user_clients')
        .update({ is_active: true })
        .eq('id', mappingId);

    if (error) throw error;
}

/** Update portal user status (admin) */
export async function setPortalUserStatus(userId: string, status: PortalUserStatus) {
    const { error } = await supabase
        .from('portal_users')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) throw error;
}

/** Verify if current user has access to client slug (server-side check) */
export async function verifyClientAccess(slug: string) {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) return null;

    // Use admin client for DB queries (RLS blocks anon-key reads)
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, business_name, logo_url')
        .eq('slug', slug)
        .single();

    if (clientError || !client) return null;

    // Check mapping using admin client
    const { data: mapping, error: mappingError } = await supabase
        .from('portal_user_clients')
        .select('role')
        .eq('user_id', user.id)
        .eq('client_id', client.id)
        .eq('is_active', true)
        .single();

    if (mappingError || !mapping) return null;

    return {
        user,
        client,
        role: mapping.role
    };
}
