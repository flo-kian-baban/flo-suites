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

// ─── Clients ──────────────────────────────────────────────────────────────────

export async function getAdminClients(search?: string, status?: string) {
    let query = supabaseAdmin
        .from('clients')
        .select('*')
        .is('archived_at', null)
        .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.or(`business_name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch clients: ${error.message}`);
    return data;
}

export async function getAdminClientById(id: string) {
    const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null; // Return null instead of throwing for 404
    return data;
}

export async function createAdminClient(payload: any) {
    // Generate slug from business name if not provided
    if (!payload.slug && payload.business_name) {
        payload.slug = payload.business_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabaseAdmin
        .from('clients')
        .insert(payload)
        .select('id')
        .single();

    if (error) throw new Error(`Failed to create client: ${error.message}`);
    revalidatePath('/admin/clients');
    return data.id;
}

export async function updateAdminClient(id: string, payload: any) {
    const { error } = await supabaseAdmin
        .from('clients')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update client: ${error.message}`);
    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${id}`);
}

export async function archiveAdminClient(id: string) {
    const { error } = await supabaseAdmin
        .from('clients')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(`Failed to archive client: ${error.message}`);
    revalidatePath('/admin/clients');
}
