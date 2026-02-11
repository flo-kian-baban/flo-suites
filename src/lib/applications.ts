import { supabase } from './supabaseClient';

export type ApplicationType = 'flo-os' | 'funnel-builder' | 'media-marketing';

export interface Application {
    id: string;
    created_at: string;
    type: ApplicationType;
    status: 'new' | 'viewed' | 'contacted' | 'archived';
    name: string;
    email: string;
    business_name: string;
    source: string | null;
    primary_intent: string | null;
    data: any;
}

/**
 * Save a new application to the database
 */
export async function saveApplication(type: ApplicationType, data: any): Promise<string> {
    const email = data.email || 'unknown';
    const name = data.name || data.fullName || '';
    const businessName = data.businessName || '';
    const source = data.source || null;
    const primaryIntent = data.primaryIntent || null;

    const { data: result, error } = await supabase
        .from('applications')
        .insert({
            type,
            name,
            email,
            business_name: businessName,
            status: 'new',
            source,
            primary_intent: primaryIntent,
            data
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error saving application:', error);
        throw new Error(`Failed to save application: ${error.message}`);
    }

    return result.id;
}

/**
 * Get all applications, optionally filtered by type
 */
export async function getApplications(type?: ApplicationType): Promise<Application[]> {
    try {
        let query = supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data || []) as Application[];

    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
}
