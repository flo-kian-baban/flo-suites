/**
 * Content Manager - Legacy configuration placeholder
 * 
 * Previously handled site configuration storage and file uploads for Supabase.
 * Now primarily used to maintain compatibility points if dynamic text updates are still needed.
 */

import { supabase } from './supabaseClient';

export interface SiteContent {
    // Media assets are now statically served from /public/assets/media/
    // This interface is kept minimal for text/config overrides if necessary in the future
}

export const DEFAULT_CONTENT: SiteContent = {
    // Video arrays and URLs have been migrated to static Next.js assets
};

export async function getSiteContent(): Promise<SiteContent> {
    try {
        const { data, error } = await supabase
            .from('site_config')
            .select('content')
            .eq('id', 'default')
            .single();

        if (error || !data) {
            return DEFAULT_CONTENT;
        }

        return {
            ...DEFAULT_CONTENT,
            ...data.content
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
