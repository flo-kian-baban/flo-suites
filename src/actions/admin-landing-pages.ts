'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { LandingPagePayload } from '@/lib/client-landing-pages';

export async function getAdminLandingPages(clientId: string) {
    const { data, error } = await supabaseAdmin
        .from('client_landing_pages')
        .select('*')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch landing pages: ${error.message}`);
    return data;
}

export async function createAdminLandingPage(clientId: string, payload: LandingPagePayload) {
    const { data, error } = await supabaseAdmin
        .from('client_landing_pages')
        .insert({ client_id: clientId, ...payload })
        .select('*')
        .single();

    if (error || !data) throw new Error(`Failed to create landing page: ${error?.message}`);
    revalidatePath(`/admin/clients/${clientId}`);
    return data;
}

export async function updateAdminLandingPage(id: string, payload: LandingPagePayload) {
    const { error } = await supabaseAdmin
        .from('client_landing_pages')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update landing page: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function deleteAdminLandingPage(id: string) {
    const { error } = await supabaseAdmin
        .from('client_landing_pages')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete landing page: ${error.message}`);
    revalidatePath(`/admin/clients`);
}
