import { supabase, BUCKET_NAME } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────

export type MediaItemType = 'reel' | 'infographic' | 'photo' | 'ad' | 'other';
export type MediaItemStatus = 'pending' | 'approved' | 'declined';

export interface MediaAsset {
    storage_bucket: string;
    storage_path: string;
    mime_type: string | null;
    created_at: string;
}

export interface MediaComment {
    comment: string;
    created_at: string;
}

export interface MediaItem {
    id: string;
    client_id: string;
    title: string;
    type: MediaItemType;
    status: MediaItemStatus;
    assets: MediaAsset[];
    comments: MediaComment[];
    created_at: string;
    updated_at: string;
}

// MediaItemFull is now identical to MediaItem (everything is on one row)
export type MediaItemFull = MediaItem;

// ─── List Media Items ────────────────────────────────────

export async function getMediaItems(
    clientId: string,
    search?: string,
    status?: MediaItemStatus | 'all'
): Promise<MediaItem[]> {
    let query = supabase
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
    if (error) throw error;
    return (data || []) as MediaItem[];
}

// ─── Get Single Media Item ──────────────────────────────

export async function getMediaItemById(id: string): Promise<MediaItemFull | null> {
    const { data, error } = await supabase
        .from('client_media')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data as MediaItemFull;
}

// ─── Create Media Item ───────────────────────────────────

export async function createMediaItem(
    clientId: string,
    title: string,
    type: MediaItemType
): Promise<string> {
    const { data, error } = await supabase
        .from('client_media')
        .insert({ client_id: clientId, title, type })
        .select('id')
        .single();

    if (error || !data) throw new Error(`Failed to create media item: ${error?.message}`);
    return data.id;
}

// ─── Upload Media Files & Append to Assets JSONB ─────────

export async function uploadMediaFiles(
    mediaItemId: string,
    clientSlug: string,
    files: File[],
    onProgress?: (index: number, pct: number) => void
): Promise<MediaAsset[]> {
    // Get current assets
    const { data: item } = await supabase
        .from('client_media')
        .select('assets')
        .eq('id', mediaItemId)
        .single();

    const existingAssets: MediaAsset[] = (item?.assets as MediaAsset[]) || [];
    const newAssets: MediaAsset[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `clients/${clientSlug}/media/${mediaItemId}/${sanitizedName}`;

        onProgress?.(i, 30);

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, { upsert: true, contentType: file.type });

        if (uploadError) throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);

        onProgress?.(i, 70);

        newAssets.push({
            storage_bucket: BUCKET_NAME,
            storage_path: storagePath,
            mime_type: file.type || null,
            created_at: new Date().toISOString(),
        });

        onProgress?.(i, 100);
    }

    // Update the assets JSONB array
    const { error: updateError } = await supabase
        .from('client_media')
        .update({ assets: [...existingAssets, ...newAssets] })
        .eq('id', mediaItemId);

    if (updateError) throw new Error(`Failed to update assets: ${updateError.message}`);

    return newAssets;
}

// ─── Update Media Item Status ────────────────────────────

export async function updateMediaStatus(
    id: string,
    status: MediaItemStatus
): Promise<void> {
    const { error } = await supabase
        .from('client_media')
        .update({ status })
        .eq('id', id);

    if (error) throw new Error(`Failed to update status: ${error.message}`);
}

// ─── Add Comment ─────────────────────────────────────────

export async function addMediaComment(
    mediaItemId: string,
    comment: string
): Promise<MediaComment> {
    // Get current comments
    const { data: item } = await supabase
        .from('client_media')
        .select('comments')
        .eq('id', mediaItemId)
        .single();

    const existingComments: MediaComment[] = (item?.comments as MediaComment[]) || [];

    const newComment: MediaComment = {
        comment,
        created_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('client_media')
        .update({ comments: [...existingComments, newComment] })
        .eq('id', mediaItemId);

    if (error) throw new Error(`Failed to add comment: ${error.message}`);
    return newComment;
}

// ─── Delete Media Item (+ storage files) ─────────────────

export async function deleteMediaItem(id: string): Promise<void> {
    // Get assets to delete from storage
    const { data: item } = await supabase
        .from('client_media')
        .select('assets')
        .eq('id', id)
        .single();

    // Delete storage files
    const assets = (item?.assets as MediaAsset[]) || [];
    if (assets.length > 0) {
        const paths = assets.map((a) => a.storage_path);
        await supabase.storage.from(BUCKET_NAME).remove(paths);
    }

    // Delete DB record
    const { error } = await supabase
        .from('client_media')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete media item: ${error.message}`);
}

// ─── Get Public URL for asset ────────────────────────────

export function getAssetUrl(storagePath: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
    return data.publicUrl;
}
