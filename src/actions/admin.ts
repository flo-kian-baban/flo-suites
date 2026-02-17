'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

// ─── Applications ─────────────────────────────────────────────────────────────

export async function getAdminApplications(status?: string) {
    let query = supabaseAdmin
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch applications: ${error.message}`);
    return data;
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
    const payload: any = { status };
    if (notes !== undefined) payload.notes = notes;

    const { error } = await supabaseAdmin
        .from('applications')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update application: ${error.message}`);
    revalidatePath('/admin/applications');
}


