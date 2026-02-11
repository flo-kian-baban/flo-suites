'use client';

import { ClientStatus } from '@/lib/clients';
import StatusBadge from './StatusBadge';
import { Building2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientHeaderProps {
    businessName: string;
    status: ClientStatus;
    vertical: string;
}

export default function ClientHeader({ businessName, status, vertical }: ClientHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-6 pb-6 border-b border-white/[0.06]">
            {/* Back */}
            <button
                onClick={() => router.push('/admin/clients')}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:border-white/15 transition-all shrink-0"
            >
                <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-flo-orange/25 to-flo-orange/5 flex items-center justify-center border border-flo-orange/10 shrink-0">
                <Building2 className="w-5 h-5 text-flo-orange" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-white truncate">{businessName}</h1>
                    <StatusBadge status={status} />
                </div>
                <p className="text-sm text-white/40">{vertical}</p>
            </div>
        </div>
    );
}
