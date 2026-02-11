import { supabase } from './supabaseClient';

// ─── Types ───────────────────────────────────────────────
export type ClientStatus = 'lead' | 'onboarding' | 'active' | 'paused' | 'offboarded';

export type ContactType = 'decision_maker' | 'primary' | 'secondary';

export type LinkType =
    | 'website'
    | 'booking'
    | 'instagram'
    | 'tiktok'
    | 'youtube'
    | 'facebook'
    | 'google_business_profile'
    | 'other';

export interface ClientContact {
    type: ContactType;
    name: string;
    role: string;
    email: string;
    phone: string;
}

export interface ClientLocation {
    label: string;
    address: string;
    city: string;
    google_maps_url: string;
    phone: string;
}

export interface ClientOffer {
    name: string;
    is_primary: boolean;
}

export interface ClientLink {
    type: LinkType;
    label: string;
    url: string;
}

export interface Client {
    id: string;
    slug: string;
    business_name: string;
    legal_name: string | null;
    vertical: string;
    package?: 'FLO OS' | 'Funnel Builder' | 'Media Marketing';
    status: ClientStatus;
    start_date: string | null;
    notes: string | null;
    logo_url: string | null;
    contacts: ClientContact[];
    locations: ClientLocation[];
    offers: ClientOffer[];
    links: ClientLink[];
    created_at: string;
    updated_at: string;
    archived_at: string | null;
}

// ClientFull is now identical to Client (all data is on one row)
export type ClientFull = Client;

export interface CreateClientPayload {
    slug: string;
    business_name: string;
    legal_name?: string;
    vertical: string;
    package?: 'FLO OS' | 'Funnel Builder' | 'Media Marketing';
    status: ClientStatus;
    start_date?: string | null;
    notes?: string;
    logo_url?: string | null;
    contacts: ClientContact[];
    locations: ClientLocation[];
    offers: ClientOffer[];
    links: ClientLink[];
}

// ─── List Clients ────────────────────────────────────────
export async function getClients(
    search?: string,
    status?: ClientStatus | 'all'
): Promise<Client[]> {
    let query = supabase
        .from('clients')
        .select('*')
        .is('archived_at', null)
        .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (search) {
        query = query.or(
            `business_name.ilike.%${search}%,slug.ilike.%${search}%`
        );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Client[];
}

// ─── Get Single Client ──────────────────────────────────
export async function getClientById(id: string): Promise<ClientFull | null> {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data as ClientFull;
}

// ─── Create Client ───────────────────────────────────────
export async function createClient(payload: CreateClientPayload): Promise<string> {
    const { data, error } = await supabase
        .from('clients')
        .insert(payload)
        .select('id')
        .single();

    if (error || !data) {
        throw new Error(`Failed to create client: ${error?.message}`);
    }

    return data.id;
}

// ─── Update Client ───────────────────────────────────────
export async function updateClient(
    id: string,
    payload: Partial<CreateClientPayload>
): Promise<void> {
    const { error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', id);

    if (error) throw new Error(`Failed to update client: ${error.message}`);
}

// ─── Archive Client ──────────────────────────────────────
export async function archiveClient(id: string): Promise<void> {
    const { error } = await supabase
        .from('clients')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(`Failed to archive client: ${error.message}`);
}
