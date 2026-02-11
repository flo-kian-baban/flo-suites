/**
 * Storage Path Builder
 * Single source of truth for all Supabase Storage paths
 * 
 * Folder Structure:
 * flo-content/
 * ├── tiles/{tileSlug}/              # Tile expanded media (videos)
 * ├── offers/{offerSlug}/            # Offer header media (video/image)
 * ├── suites/{suiteSlug}/
 * │   ├── photos/                    # Suite portfolio photos
 * │   └── videos/                    # Suite portfolio videos
 * └── {future-category}/             # Extensible for new categories
 */

// Known tile slugs (from suites.js)
export const TILE_SLUGS = [
    'flo-os',
    'media-marketing',
    'studio-suite',
    'funnel-builder',
    'marketing-suite',
    'connex',
    'about-flo',
    'development-suite',
] as const;

// Known suite slugs
export const SUITE_SLUGS = [
    'studio-suite',
    'marketing-suite',
    'development-suite',
] as const;

export type TileSlug = typeof TILE_SLUGS[number];
export type SuiteSlug = typeof SUITE_SLUGS[number];
export type MediaType = 'photos' | 'videos';

export type StorageCategory = 'tiles' | 'offers' | 'suites';

/**
 * Get the storage path for tile media
 */
export function getTilePath(tileSlug: string, filename?: string): string {
    const basePath = `tiles/${sanitizeSlug(tileSlug)}`;
    return filename ? `${basePath}/${filename}` : basePath;
}

/**
 * Get the storage path for offer header media
 */
export function getOfferPath(offerSlug: string, filename?: string): string {
    const basePath = `offers/${sanitizeSlug(offerSlug)}`;
    return filename ? `${basePath}/${filename}` : basePath;
}

/**
 * Get the storage path for suite portfolio media
 */
export function getSuitePortfolioPath(
    suiteSlug: string,
    mediaType: MediaType,
    filename?: string
): string {
    const basePath = `suites/${sanitizeSlug(suiteSlug)}/${mediaType}`;
    return filename ? `${basePath}/${filename}` : basePath;
}

/**
 * Get storage path based on category and target
 */
export function getStoragePath(
    category: StorageCategory,
    target: string,
    options?: { mediaType?: MediaType; filename?: string }
): string {
    switch (category) {
        case 'tiles':
            return getTilePath(target, options?.filename);
        case 'offers':
            return getOfferPath(target, options?.filename);
        case 'suites':
            return getSuitePortfolioPath(
                target,
                options?.mediaType || 'videos',
                options?.filename
            );
        default:
            throw new Error(`Unknown category: ${category}`);
    }
}

/**
 * Sanitize a slug for use in storage paths
 */
export function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Generate a unique filename with timestamp prefix
 */
export function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const sanitized = originalName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-');
    return `${timestamp}-${sanitized}`;
}

/**
 * Parse a storage path to extract category and target info
 */
export function parseStoragePath(path: string): {
    category: StorageCategory;
    target: string;
    mediaType?: MediaType;
    filename?: string;
} | null {
    const parts = path.split('/').filter(Boolean);

    if (parts.length < 2) return null;

    const category = parts[0] as StorageCategory;
    const target = parts[1];

    if (category === 'suites' && parts.length >= 3) {
        const mediaType = parts[2] as MediaType;
        const filename = parts[3];
        return { category, target, mediaType, filename };
    }

    return {
        category,
        target,
        filename: parts[2],
    };
}
