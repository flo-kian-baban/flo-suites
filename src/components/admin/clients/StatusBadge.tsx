'use client';

import { ClientStatus } from '@/lib/clients';

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bg: string }> = {
    lead: { label: 'Lead', color: 'text-blue-300', bg: 'bg-blue-500/15 border-blue-500/20' },
    onboarding: { label: 'Onboarding', color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/20' },
    active: { label: 'Active', color: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-500/20' },
    paused: { label: 'Paused', color: 'text-orange-300', bg: 'bg-orange-500/15 border-orange-500/20' },
    offboarded: { label: 'Offboarded', color: 'text-neutral-400', bg: 'bg-neutral-500/15 border-neutral-500/20' },
};

export default function StatusBadge({ status }: { status: ClientStatus }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.lead;
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${config.bg} ${config.color}`}
        >
            {config.label}
        </span>
    );
}
