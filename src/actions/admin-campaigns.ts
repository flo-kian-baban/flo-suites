'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { CampaignPayload, CampaignStatus } from '@/lib/campaigns';

// Re-export types if needed by components, or components can keep using lib types
// We just need the functions to change.

export async function getAdminCampaigns(clientId: string, search?: string, status?: string) {
    let query = supabaseAdmin
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
    if (error) throw new Error(`Failed to fetch campaigns: ${error.message}`);
    return data;
}

export async function createAdminCampaign(clientId: string, payload: CampaignPayload) {
    const { data, error } = await supabaseAdmin
        .from('client_campaigns')
        .insert({ client_id: clientId, ...payload })
        .select('*')
        .single();

    if (error || !data) throw new Error(`Failed to create campaign: ${error?.message}`);
    revalidatePath(`/admin/clients/${clientId}`);
    return data;
}

export async function updateAdminCampaign(id: string, payload: Partial<CampaignPayload>) {
    const { error } = await supabaseAdmin
        .from('client_campaigns')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update campaign: ${error.message}`);
    revalidatePath(`/admin/clients`); // broad revalidate
}

export async function deleteAdminCampaign(id: string) {
    const { error } = await supabaseAdmin
        .from('client_campaigns')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete campaign: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

// Media Attachments
export async function getAdminCampaignMedia(campaignId: string) {
    const { data, error } = await supabaseAdmin
        .from('campaign_media_items')
        .select('id, campaign_id, media_item_id, created_at, client_media(title, type, status)')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch campaign media: ${error.message}`);

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

export async function attachAdminMedia(campaignId: string, mediaItemIds: string[]) {
    const rows = mediaItemIds.map((mid) => ({
        campaign_id: campaignId,
        media_item_id: mid,
    }));

    const { error } = await supabaseAdmin
        .from('campaign_media_items')
        .upsert(rows, { onConflict: 'campaign_id,media_item_id', ignoreDuplicates: true });

    if (error) throw new Error(`Failed to attach media: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function detachAdminMedia(campaignId: string, mediaItemId: string) {
    const { error } = await supabaseAdmin
        .from('campaign_media_items')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('media_item_id', mediaItemId);

    if (error) throw new Error(`Failed to detach media: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

// Landing Pages
export async function getAdminCampaignLandingPages(campaignId: string) {
    const { data, error } = await supabaseAdmin
        .from('campaign_landing_pages')
        .select('id, campaign_id, landing_page_id, is_primary, created_at, client_landing_pages(name, url)')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch campaign landing pages: ${error.message}`);

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

export async function attachAdminLandingPages(campaignId: string, landingPageIds: string[]) {
    const rows = landingPageIds.map((lpid) => ({
        campaign_id: campaignId,
        landing_page_id: lpid,
    }));

    const { error } = await supabaseAdmin
        .from('campaign_landing_pages')
        .upsert(rows, { onConflict: 'campaign_id,landing_page_id', ignoreDuplicates: true });

    if (error) throw new Error(`Failed to attach landing pages: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function detachAdminLandingPage(campaignId: string, landingPageId: string) {
    const { error } = await supabaseAdmin
        .from('campaign_landing_pages')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('landing_page_id', landingPageId);

    if (error) throw new Error(`Failed to detach landing page: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function setAdminPrimaryLandingPage(campaignId: string, landingPageId: string) {
    // Unset all
    await supabaseAdmin
        .from('campaign_landing_pages')
        .update({ is_primary: false })
        .eq('campaign_id', campaignId);

    // Set one
    const { error } = await supabaseAdmin
        .from('campaign_landing_pages')
        .update({ is_primary: true })
        .eq('campaign_id', campaignId)
        .eq('landing_page_id', landingPageId);

    if (error) throw new Error(`Failed to set primary landing page: ${error.message}`);
    revalidatePath(`/admin/clients`);
}
