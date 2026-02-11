/**
 * Content Manager - Supabase content and asset management
 * 
 * Handles site configuration storage and file uploads.
 * - getSiteContent: Retrieve studio/suite config from database
 * - updateSiteContent: Save site configuration to database  
 * - uploadContentAsset: Upload files to Supabase storage bucket
 */

import { supabase, BUCKET_NAME } from './supabaseClient';

const CONFIG_FILE_PATH = 'config/site-content.json';

export interface SiteContent {
    studio: {
        showcase: {
            capture: string | null;
            cut: string | null;
            deploy: string | null;
        };
        reels: Array<{
            id: number;
            title: string;
            description: string;
            duration: string;
            poster: string;
            videoUrl: string | null;
        }>;
    };
    suites: {
        [key: string]: {
            headerVideo?: string | null;
            walkthroughVideo?: string | null;
        };
    };
}

export const DEFAULT_CONTENT: SiteContent = {
    studio: {
        showcase: {
            capture: null,
            cut: null,
            deploy: null,
        },
        reels: [
            {
                id: 1,
                title: 'Brand Reveal',
                description: 'Cinematic brand identity unveiling for maximum impact.',
                duration: '0:24',
                poster: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
                videoUrl: null
            },
            {
                id: 2,
                title: 'Product Launch',
                description: 'Dynamic product showcase with premium production quality.',
                duration: '0:18',
                poster: 'linear-gradient(135deg, #16213e 0%, #F1592D 100%)',
                videoUrl: null
            },
            {
                id: 3,
                title: 'BTS Session',
                description: 'Behind-the-scenes look at our creative process.',
                duration: '0:32',
                poster: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
                videoUrl: null
            },
            {
                id: 4,
                title: 'Client Story',
                description: 'Authentic testimonial capturing real results.',
                duration: '0:45',
                poster: 'linear-gradient(135deg, #533483 0%, #e94560 100%)',
                videoUrl: null
            },
            {
                id: 5,
                title: 'Creative Process',
                description: 'Deep dive into our ideation and execution workflow.',
                duration: '0:28',
                poster: 'linear-gradient(135deg, #e94560 0%, #ff7d55 100%)',
                videoUrl: null
            },
            {
                id: 6,
                title: 'Social Highlight',
                description: 'Optimized vertical content for social platforms.',
                duration: '0:15',
                poster: 'linear-gradient(135deg, #F1592D 0%, #1a1a2e 100%)',
                videoUrl: null
            },
            {
                id: 7,
                title: 'Campaign Teaser',
                description: 'High-energy preview building anticipation.',
                duration: '0:21',
                poster: 'linear-gradient(135deg, #ff7d55 0%, #16213e 100%)',
                videoUrl: null
            },
            {
                id: 8,
                title: 'Event Recap',
                description: 'Highlights and key moments from live events.',
                duration: '0:38',
                poster: 'linear-gradient(135deg, #0f3460 0%, #F1592D 100%)',
                videoUrl: null
            }
        ]
    },
    suites: {}
};

export async function getSiteContent(): Promise<SiteContent> {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('content')
            .eq('id', 'default')
            .single();

        if (error || !data) {
            console.warn('Config not found in DB, returning default');
            return DEFAULT_CONTENT;
        }

        // Merge with defaults to ensure all keys exist
        const dbStudio = data.content.studio || {};
        const dbReels = dbStudio.reels || [];

        return {
            ...DEFAULT_CONTENT,
            ...data.content,
            studio: {
                ...DEFAULT_CONTENT.studio,
                showcase: {
                    ...DEFAULT_CONTENT.studio.showcase,
                    ...(dbStudio.showcase || {})
                },
                // Use default reels as base, then merge any uploaded video URLs
                reels: DEFAULT_CONTENT.studio.reels.map((defaultReel, idx) => ({
                    ...defaultReel,
                    videoUrl: dbReels[idx]?.videoUrl || defaultReel.videoUrl
                }))
            },
            suites: {
                ...DEFAULT_CONTENT.suites,
                ...(data.content.suites || {})
            }
        };
    } catch (e) {
        console.error('Error fetching site content', e);
        return DEFAULT_CONTENT;
    }
}

export async function updateSiteContent(newContent: SiteContent): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('site_config')
            .upsert({
                id: 'default',
                content: newContent,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error saving site content', e);
        return false;
    }
}

export async function uploadContentAsset(file: File, path: string): Promise<string | null> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                upsert: true
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path);

        return data.publicUrl;
    } catch (e) {
        console.error('Upload failed', e);
        return null;
    }
}
