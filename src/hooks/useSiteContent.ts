
import { useState, useEffect, useCallback } from 'react';
import { getSiteContent, updateSiteContent, SiteContent, DEFAULT_CONTENT } from '@/lib/content-manager';

export function useSiteContent() {
    const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        const data = await getSiteContent();
        setContent(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const save = async (newContent: SiteContent) => {
        setIsSaving(true);
        const success = await updateSiteContent(newContent);
        if (success) {
            setContent(newContent);
        }
        setIsSaving(false);
        return success;
    };

    return { content, isLoading, isSaving, save, refresh };
}
