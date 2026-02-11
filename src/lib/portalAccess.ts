import { cache } from 'react';
import { supabaseAdmin } from './supabaseAdmin';
import { createSupabaseServerClient } from './supabaseServer';

/**
 * Lightweight helper to resolve a client slug → client record.
 * Cached per-request via React.cache — multiple server components
 * calling this with the same slug share the result (zero extra queries).
 */
export const getClientBySlug = cache(async (slug: string) => {
    const { data, error } = await supabaseAdmin
        .from('clients')
        .select('id, business_name, logo_url')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;
    return data;
});

/**
 * Full access verification: auth + client lookup + role mapping.
 * Cached per-request — safe to call from layout + page without overhead.
 * 
 * This is NOT in the 'use server' file, so it runs as a direct function
 * call with zero RPC overhead. React.cache deduplicates within a request.
 */
export const verifyClientAccess = cache(async (slug: string) => {
    const supabaseServer = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) return null;

    const client = await getClientBySlug(slug);
    if (!client) return null;

    // Check mapping using admin client
    const { data: mapping, error: mappingError } = await supabaseAdmin
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
});
