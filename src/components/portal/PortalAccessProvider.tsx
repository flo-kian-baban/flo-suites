'use client';

import { createContext, useContext } from 'react';

export interface PortalAccessData {
    clientId: string;
    clientSlug: string;
    userEmail: string;
    role: string;
}

const PortalAccessContext = createContext<PortalAccessData | null>(null);

export function PortalAccessProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: PortalAccessData;
}) {
    return (
        <PortalAccessContext.Provider value={value}>
            {children}
        </PortalAccessContext.Provider>
    );
}

/** Hook to read client access data from the layout.
 *  Returns { clientId, clientSlug, userEmail, role }.
 *  Only available inside /portal/client/[slug]/* routes. */
export function usePortalAccess(): PortalAccessData {
    const ctx = useContext(PortalAccessContext);
    if (!ctx) {
        throw new Error('usePortalAccess must be used inside PortalAccessProvider');
    }
    return ctx;
}
