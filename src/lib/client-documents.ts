import { supabase } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────
export type DocType = 'cop' | 'mci' | 'sb';

export interface ClientDocument {
    id: string;
    client_id: string;
    doc_type: DocType;
    title: string | null;
    markdown: string;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
}

// ─── Labels & Defaults ───────────────────────────────────

export const DOC_TYPE_LABELS: Record<DocType, string> = {
    cop: 'COP',
    mci: 'MCI',
    sb: 'SB',
};

export const DOC_TYPE_FULL_NAMES: Record<DocType, string> = {
    cop: 'Client Operating Profile',
    mci: 'Market & Competitive Intelligence',
    sb: 'System Blueprint',
};

export const DEFAULT_TITLES: Record<DocType, string> = {
    cop: 'Client Operating Profile',
    mci: 'Market & Competitive Intelligence',
    sb: 'System Blueprint',
};

export const STARTER_TEMPLATES: Record<DocType, string> = {
    cop: `# Client Operating Profile

## Overview


## Locations & Service Area


## Primary Offers


## Target Audience


## Goals (90 Days)


## Constraints / Compliance


## Deliverables Summary
`,
    mci: `# Market & Competitive Intelligence

## Market Snapshot


## Top Competitors


## Positioning Notes


## Pricing / Offer Observations


## Messaging Angles


## Opportunities & Risks
`,
    sb: `# System Blueprint

## System Overview


## Workflow
Intake → Production → Review → Delivery

## Content System


## Landing Page System


## Automation System


## Cadence


## Next Milestones
`,
};

// ─── Fetch Documents ─────────────────────────────────────

export async function getClientDocuments(
    clientId: string
): Promise<ClientDocument[]> {
    const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('doc_type');

    if (error) throw error;
    return (data || []) as ClientDocument[];
}

// ─── Seed Missing Documents ──────────────────────────────

export async function ensureAllDocuments(
    clientId: string
): Promise<ClientDocument[]> {
    const existing = await getClientDocuments(clientId);
    const existingTypes = new Set(existing.map((d) => d.doc_type));
    const allTypes: DocType[] = ['cop', 'mci', 'sb'];
    const missing = allTypes.filter((t) => !existingTypes.has(t));

    if (missing.length > 0) {
        const rows = missing.map((docType) => ({
            client_id: clientId,
            doc_type: docType,
            title: DEFAULT_TITLES[docType],
            markdown: STARTER_TEMPLATES[docType],
        }));

        const { error } = await supabase
            .from('client_documents')
            .insert(rows);

        if (error) throw new Error(`Failed to seed documents: ${error.message}`);

        // Re-fetch to return complete set
        return getClientDocuments(clientId);
    }

    return existing;
}

// ─── Upsert Document ─────────────────────────────────────

export async function upsertDocument(
    clientId: string,
    docType: DocType,
    markdown: string,
    title?: string,
    updatedBy?: string
): Promise<ClientDocument> {
    const payload: Record<string, unknown> = {
        client_id: clientId,
        doc_type: docType,
        markdown,
        updated_at: new Date().toISOString(),
    };

    if (title !== undefined) payload.title = title;
    if (updatedBy !== undefined) payload.updated_by = updatedBy;

    const { data, error } = await supabase
        .from('client_documents')
        .upsert(payload, { onConflict: 'client_id,doc_type' })
        .select('*')
        .single();

    if (error || !data) {
        throw new Error(`Failed to upsert document: ${error?.message}`);
    }

    return data as ClientDocument;
}
