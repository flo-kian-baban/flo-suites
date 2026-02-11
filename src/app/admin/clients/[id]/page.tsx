'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ClientFull } from '@/lib/clients';
import { getAdminClientById } from '@/actions/admin';
import ClientHeader from '@/components/admin/clients/ClientHeader';
import ClientTabs from '@/components/admin/clients/ClientTabs';

export default function ClientDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [client, setClient] = useState<ClientFull | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getAdminClientById(id);
                setClient(data);
            } catch (err) {
                console.error('Failed to load client:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-white/30">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-flo-orange" />
                <p className="text-sm">Loading client...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-white/30">
                <p className="text-lg font-semibold mb-2">Client not found</p>
                <p className="text-sm">This client may have been archived or deleted.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-6 pb-20">
            <ClientHeader
                businessName={client.business_name}
                status={client.status}
                vertical={client.vertical}
            />
            <ClientTabs client={client} />
        </div>
    );
}
