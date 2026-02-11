import { supabase } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────

export interface LandingPage {
    id: string;
    client_id: string;
    name: string;
    url: string;
    campaign_name: string | null;
    goal: string | null;
    created_at: string;
    updated_at: string;
}

export interface LandingPagePayload {
    name: string;
    url: string;
    campaign_name?: string;
    goal?: string;
}

// ─── List ────────────────────────────────────────────────

export async function getLandingPages(clientId: string): Promise<LandingPage[]> {
    const { data, error } = await supabase
        .from('client_landing_pages')
        .select('*')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as LandingPage[];
}

// ─── Create ──────────────────────────────────────────────

export async function createLandingPage(
    clientId: string,
    payload: LandingPagePayload
): Promise<LandingPage> {
    const { data, error } = await supabase
        .from('client_landing_pages')
        .insert({ client_id: clientId, ...payload })
        .select('*')
        .single();

    if (error || !data) throw new Error(`Failed to create landing page: ${error?.message}`);
    return data as LandingPage;
}

// ─── Update ──────────────────────────────────────────────

export async function updateLandingPage(
    id: string,
    payload: LandingPagePayload
): Promise<void> {
    const { error } = await supabase
        .from('client_landing_pages')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update landing page: ${error.message}`);
}

// ─── Delete ──────────────────────────────────────────────

export async function deleteLandingPage(id: string): Promise<void> {
    const { error } = await supabase
        .from('client_landing_pages')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete landing page: ${error.message}`);
}
