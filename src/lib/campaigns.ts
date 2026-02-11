import { supabase } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignObjective = 'leads' | 'bookings' | 'awareness' | 'other';

export interface Campaign {
    id: string;
    client_id: string;
    name: string;
    status: CampaignStatus;
    objective: string | null;
    offer: string | null;
    targeting_summary: string;
    targeting_reason: string | null;
    targeting_location: string | null;
    messaging_pillars: string | null;
    exclusions: string | null;
    start_date: string | null;
    end_date: string | null;
    internal_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CampaignPayload {
    name: string;
    status?: CampaignStatus;
    objective?: string | null;
    offer?: string | null;
    targeting_summary: string;
    targeting_reason?: string | null;
    targeting_location?: string | null;
    messaging_pillars?: string | null;
    exclusions?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    internal_notes?: string | null;
}

export interface CampaignMediaLink {
    id: string;
    campaign_id: string;
    media_item_id: string;
    created_at: string;
    // joined fields
    media_title?: string;
    media_type?: string;
    media_status?: string;
}

export interface CampaignLandingPageLink {
    id: string;
    campaign_id: string;
    landing_page_id: string;
    is_primary: boolean;
    created_at: string;
    // joined fields
    page_name?: string;
    page_url?: string;
}

// ─── List Campaigns ──────────────────────────────────────

export async function getCampaigns(
    clientId: string,
    search?: string,
    status?: CampaignStatus | 'all'
): Promise<Campaign[]> {
    let query = supabase
        .from('client_campaigns')
        .select('*')
        .eq('client_id', clientId)
        .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Campaign[];
}

// ─── Create Campaign ─────────────────────────────────────

export async function createCampaign(
    clientId: string,
    payload: CampaignPayload
): Promise<Campaign> {
    const { data, error } = await supabase
        .from('client_campaigns')
        .insert({ client_id: clientId, ...payload })
        .select('*')
        .single();

    if (error || !data) throw new Error(`Failed to create campaign: ${error?.message}`);
    return data as Campaign;
}

// ─── Update Campaign ─────────────────────────────────────

export async function updateCampaign(
    id: string,
    payload: Partial<CampaignPayload>
): Promise<void> {
    const { error } = await supabase
        .from('client_campaigns')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update campaign: ${error.message}`);
}

// ─── Delete Campaign ─────────────────────────────────────

export async function deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
        .from('client_campaigns')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete campaign: ${error.message}`);
}

// ═══════════════════════════════════════════════════════════
// MEDIA ATTACHMENTS
// ═══════════════════════════════════════════════════════════

export async function getCampaignMedia(campaignId: string): Promise<CampaignMediaLink[]> {
    const { data, error } = await supabase
        .from('campaign_media_items')
        .select('id, campaign_id, media_item_id, created_at, client_media(title, type, status)')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
        id: row.id,
        campaign_id: row.campaign_id,
        media_item_id: row.media_item_id,
        created_at: row.created_at,
        media_title: row.client_media?.title,
        media_type: row.client_media?.type,
        media_status: row.client_media?.status,
    }));
}

export async function attachMedia(
    campaignId: string,
    mediaItemIds: string[]
): Promise<void> {
    const rows = mediaItemIds.map((mid) => ({
        campaign_id: campaignId,
        media_item_id: mid,
    }));

    const { error } = await supabase
        .from('campaign_media_items')
        .upsert(rows, { onConflict: 'campaign_id,media_item_id', ignoreDuplicates: true });

    if (error) throw new Error(`Failed to attach media: ${error.message}`);
}

export async function detachMedia(
    campaignId: string,
    mediaItemId: string
): Promise<void> {
    const { error } = await supabase
        .from('campaign_media_items')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('media_item_id', mediaItemId);

    if (error) throw new Error(`Failed to detach media: ${error.message}`);
}

// ═══════════════════════════════════════════════════════════
// LANDING PAGE ATTACHMENTS
// ═══════════════════════════════════════════════════════════

export async function getCampaignLandingPages(campaignId: string): Promise<CampaignLandingPageLink[]> {
    const { data, error } = await supabase
        .from('campaign_landing_pages')
        .select('id, campaign_id, landing_page_id, is_primary, created_at, client_landing_pages(name, url)')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
        id: row.id,
        campaign_id: row.campaign_id,
        landing_page_id: row.landing_page_id,
        is_primary: row.is_primary,
        created_at: row.created_at,
        page_name: row.client_landing_pages?.name,
        page_url: row.client_landing_pages?.url,
    }));
}

export async function attachLandingPages(
    campaignId: string,
    landingPageIds: string[]
): Promise<void> {
    const rows = landingPageIds.map((lpid) => ({
        campaign_id: campaignId,
        landing_page_id: lpid,
    }));

    const { error } = await supabase
        .from('campaign_landing_pages')
        .upsert(rows, { onConflict: 'campaign_id,landing_page_id', ignoreDuplicates: true });

    if (error) throw new Error(`Failed to attach landing pages: ${error.message}`);
}

export async function detachLandingPage(
    campaignId: string,
    landingPageId: string
): Promise<void> {
    const { error } = await supabase
        .from('campaign_landing_pages')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('landing_page_id', landingPageId);

    if (error) throw new Error(`Failed to detach landing page: ${error.message}`);
}

export async function setPrimaryLandingPage(
    campaignId: string,
    landingPageId: string
): Promise<void> {
    // Unset all primary flags for this campaign
    const { error: unsetError } = await supabase
        .from('campaign_landing_pages')
        .update({ is_primary: false })
        .eq('campaign_id', campaignId);

    if (unsetError) throw new Error(`Failed to unset primary: ${unsetError.message}`);

    // Set the chosen one as primary
    const { error: setError } = await supabase
        .from('campaign_landing_pages')
        .update({ is_primary: true })
        .eq('campaign_id', campaignId)
        .eq('landing_page_id', landingPageId);

    if (setError) throw new Error(`Failed to set primary: ${setError.message}`);
}
