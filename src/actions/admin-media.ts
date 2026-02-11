'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { MediaItemStatus, MediaItemType } from '@/lib/client-media';

// NOTE: File uploads still need client-side or separate handling for storage?
// storage.ts uses supabaseClient.
// Bucket RLS: If we disable anon access to buckets, we need signed URLs or server-side upload.
// For now, we are focusing on TABLE security. We can leave storage as is.

export async function addAdminMediaAssets(mediaItemId: string, newAssets: any[]) {
    // Get current assets
    const { data: item } = await supabaseAdmin
        .from('client_media')
        .select('assets')
        .eq('id', mediaItemId)
        .single();

    const existingAssets = (item?.assets as any[]) || [];

    // Update the assets JSONB array
    const { error } = await supabaseAdmin
        .from('client_media')
        .update({ assets: [...existingAssets, ...newAssets] })
        .eq('id', mediaItemId);

    if (error) throw new Error(`Failed to add assets: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function getAdminMediaItems(clientId: string, search?: string, status?: string) {
    let query = supabaseAdmin
        .from('client_media')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch media items: ${error.message}`);
    return data;
}

export async function getAdminMediaItemById(id: string) {
    const { data, error } = await supabaseAdmin
        .from('client_media')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) throw new Error(`Failed to fetch media item: ${error?.message}`);
    return data;
}

export async function createAdminMediaItem(clientId: string, title: string, type: MediaItemType) {
    const { data, error } = await supabaseAdmin
        .from('client_media')
        .insert({ client_id: clientId, title, type })
        .select('id')
        .single();

    if (error || !data) throw new Error(`Failed to create media item: ${error?.message}`);
    revalidatePath(`/admin/clients/${clientId}`);
    return data.id;
}

export async function updateAdminMediaStatus(id: string, status: MediaItemStatus) {
    const { error } = await supabaseAdmin
        .from('client_media')
        .update({ status })
        .eq('id', id);

    if (error) throw new Error(`Failed to update media status: ${error.message}`);
    revalidatePath(`/admin/clients`);
}

export async function addAdminMediaComment(mediaItemId: string, comment: string) {
    // Get current
    const { data: item } = await supabaseAdmin
        .from('client_media')
        .select('comments')
        .eq('id', mediaItemId)
        .single();

    const existingComments = (item?.comments as any[]) || [];
    const newComment = {
        comment,
        created_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
        .from('client_media')
        .update({ comments: [...existingComments, newComment] })
        .eq('id', mediaItemId);

    if (error) throw new Error(`Failed to add comment: ${error.message}`);
    revalidatePath(`/admin/clients`);
    return newComment;
}

export async function deleteAdminMediaItem(id: string) {
    // DB deletion (Storage deletion might fail if we don't use admin for storage too, but supabaseAdmin has storage access)
    // We should delete storage files using admin too.

    const { data: item } = await supabaseAdmin
        .from('client_media')
        .select('assets')
        .eq('id', id)
        .single();

    const assets = (item?.assets as any[]) || [];
    if (assets.length > 0) {
        const paths = assets.map((a: any) => a.storage_path);
        await supabaseAdmin.storage.from('flo-assets').remove(paths); // Assuming bucket name 'flo-assets' or imported const
    }

    const { error } = await supabaseAdmin
        .from('client_media')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete media item: ${error.message}`);
    revalidatePath(`/admin/clients`);
}
