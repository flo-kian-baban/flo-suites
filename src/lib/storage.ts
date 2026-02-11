import { supabase, BUCKET_NAME } from './supabaseClient';
import { generateUniqueFilename } from './paths';

export interface StorageFile {
    id: string;
    name: string;
    path: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    mimeType: string | null;
}

export interface ListFilesOptions {
    limit?: number;
    offset?: number;
    sortBy?: { column: 'name' | 'created_at' | 'updated_at'; order: 'asc' | 'desc' };
    search?: string;
}

export interface UploadOptions {
    upsert?: boolean;
    contentType?: string;
    onProgress?: (progress: number) => void;
}

/**
 * List files in a storage path
 */
export async function listFiles(
    path: string,
    options: ListFilesOptions = {}
): Promise<{ files: StorageFile[]; hasMore: boolean }> {
    const { limit = 100, offset = 0, sortBy, search } = options;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(path, {
            limit,
            offset,
            sortBy: sortBy ? { column: sortBy.column, order: sortBy.order } : undefined,
            search,
        });

    if (error) {
        throw new Error(`Failed to list files: ${error.message}`);
    }

    // Filter out .emptyFolderPlaceholder files
    const files: StorageFile[] = (data || [])
        .filter((file) => file.name !== '.emptyFolderPlaceholder')
        .map((file) => ({
            id: file.id || file.name,
            name: file.name,
            path: `${path}/${file.name}`,
            size: file.metadata?.size || 0,
            createdAt: file.created_at || new Date().toISOString(),
            updatedAt: file.updated_at || file.created_at || new Date().toISOString(),
            mimeType: file.metadata?.mimetype || null,
        }));

    return {
        files,
        hasMore: files.length === limit,
    };
}

/**
 * Upload a file to storage
 */
export async function uploadFile(
    path: string,
    file: File,
    options: UploadOptions = {}
): Promise<{ path: string; publicUrl: string }> {
    const { upsert = true, contentType } = options;

    const uniqueFilename = generateUniqueFilename(file.name);
    const fullPath = `${path}/${uniqueFilename}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fullPath, file, {
            upsert,
            contentType: contentType || file.type,
        });

    if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
    }

    const publicUrl = getPublicUrl(fullPath);

    return { path: fullPath, publicUrl };
}

/**
 * Upload multiple files with progress tracking
 */
export async function uploadFiles(
    path: string,
    files: File[],
    options: {
        onFileProgress?: (fileIndex: number, progress: number) => void;
        onFileComplete?: (fileIndex: number, result: { path: string; publicUrl: string }) => void;
        onFileError?: (fileIndex: number, error: Error) => void;
    } = {}
): Promise<Array<{ path: string; publicUrl: string } | { error: string }>> {
    const results: Array<{ path: string; publicUrl: string } | { error: string }> = [];

    for (let i = 0; i < files.length; i++) {
        try {
            // Simulate progress (Supabase JS doesn't provide upload progress natively)
            options.onFileProgress?.(i, 50);

            const result = await uploadFile(path, files[i]);
            results.push(result);

            options.onFileProgress?.(i, 100);
            options.onFileComplete?.(i, result);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            results.push({ error: error.message });
            options.onFileError?.(i, error);
        }
    }

    return results;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(paths: string[]): Promise<void> {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(paths);

    if (error) {
        throw new Error(`Failed to delete files: ${error.message}`);
    }
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(path: string): string {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Rename a file (copy + delete workaround)
 */
export async function renameFile(
    oldPath: string,
    newPath: string
): Promise<{ path: string; publicUrl: string }> {
    // Download the file
    const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(oldPath);

    if (downloadError) {
        throw new Error(`Failed to download file for rename: ${downloadError.message}`);
    }

    // Upload to new path
    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(newPath, fileData, { upsert: true });

    if (uploadError) {
        throw new Error(`Failed to upload renamed file: ${uploadError.message}`);
    }

    // Delete old file
    await deleteFile(oldPath);

    const publicUrl = getPublicUrl(newPath);

    return { path: newPath, publicUrl };
}

/**
 * Copy a file to a new path
 */
export async function copyFile(
    sourcePath: string,
    destPath: string
): Promise<{ path: string; publicUrl: string }> {
    const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(sourcePath);

    if (downloadError) {
        throw new Error(`Failed to download file for copy: ${downloadError.message}`);
    }

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(destPath, fileData, { upsert: true });

    if (uploadError) {
        throw new Error(`Failed to upload copied file: ${uploadError.message}`);
    }

    const publicUrl = getPublicUrl(destPath);

    return { path: destPath, publicUrl };
}

/**
 * Check if a file exists
 */
export async function fileExists(path: string): Promise<boolean> {
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(parentPath, { search: fileName });

    if (error) {
        return false;
    }

    return data?.some((file) => file.name === fileName) || false;
}
