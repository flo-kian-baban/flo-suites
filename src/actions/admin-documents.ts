'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { DocType, DEFAULT_TITLES, STARTER_TEMPLATES } from '@/lib/client-documents';

export async function getAdminClientDocuments(clientId: string) {
    const { data, error } = await supabaseAdmin
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('doc_type');

    if (error) throw new Error(`Failed to fetch documents: ${error.message}`);
    return data;
}

export async function ensureAdminAllDocuments(clientId: string) {
    const existing = await getAdminClientDocuments(clientId);
    const existingTypes = new Set(existing.map((d: any) => d.doc_type));
    const allTypes: DocType[] = ['cop', 'mci', 'sb'];
    const missing = allTypes.filter((t) => !existingTypes.has(t));

    if (missing.length > 0) {
        // Must hardcode these constants or import them. Imported above.
        const rows = missing.map((docType) => ({
            client_id: clientId,
            doc_type: docType,
            title: DEFAULT_TITLES[docType],
            markdown: STARTER_TEMPLATES[docType],
        }));

        const { error } = await supabaseAdmin
            .from('client_documents')
            .insert(rows);

        if (error) throw new Error(`Failed to seed documents: ${error.message}`);
        revalidatePath(`/admin/clients/${clientId}`);
        return getAdminClientDocuments(clientId);
    }

    return existing;
}

export async function upsertAdminDocument(
    clientId: string,
    docType: DocType,
    markdown: string,
    title?: string,
    updatedBy?: string
) {
    const payload: Record<string, unknown> = {
        client_id: clientId,
        doc_type: docType,
        markdown,
        updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title;
    if (updatedBy !== undefined) payload.updated_by = updatedBy;

    const { data, error } = await supabaseAdmin
        .from('client_documents')
        .upsert(payload, { onConflict: 'client_id,doc_type' })
        .select('*')
        .single();

    if (error || !data) {
        throw new Error(`Failed to upsert document: ${error?.message}`);
    }
    revalidatePath(`/admin/clients/${clientId}`);
    return data;
}
