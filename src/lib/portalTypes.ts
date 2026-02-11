// ─── Portal Types ──────────────────────────────────────
export type PortalUserStatus = 'pending' | 'approved' | 'blocked';
export type PortalUserRole = 'viewer' | 'manager';

export interface PortalUser {
    id: string;
    email: string;
    full_name: string | null;
    status: PortalUserStatus;
    created_at: string;
    updated_at: string;
}

export interface PortalUserClient {
    id: string;
    user_id: string;
    client_id: string;
    role: PortalUserRole;
    is_active: boolean;
    created_at: string;
}

export interface PortalUserClientWithDetails extends PortalUserClient {
    clients: {
        id: string;
        slug: string;
        business_name: string;
        logo_url: string | null;
    };
}
