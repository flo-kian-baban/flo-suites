'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    ChevronDown,
    Archive,
    Loader2,
    Building2,
    Users,
} from 'lucide-react';
import { Client, ClientStatus } from '@/lib/clients';
import { getAdminClients, archiveAdminClient } from '@/actions/admin';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS: { value: ClientStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'lead', label: 'Lead' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'offboarded', label: 'Offboarded' },
];

export default function ClientsTable() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminClients(search || undefined, statusFilter);
            setClients(data);
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [search, statusFilter]);

    const handleArchive = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Archive this client? They will be hidden from the list.')) return;
        try {
            await archiveAdminClient(id);
            fetchClients();
        } catch (err) {
            console.error('Failed to archive:', err);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const selectedStatusLabel =
        STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label || 'All Statuses';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
                    <p className="text-white/50">Manage onboarded clients and their operations.</p>
                </div>
                <button
                    onClick={() => router.push('/admin/clients/new')}
                    className="flex items-center gap-2.5 px-5 py-3 bg-flo-orange hover:bg-flo-orange-dark text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30"
                >
                    <Plus className="w-4 h-4" />
                    Create Client
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                        type="text"
                        placeholder="Search by name or slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-flo-orange/40 transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 hover:text-white hover:border-white/15 transition-all min-w-[160px]"
                    >
                        <span className="flex-1 text-left">{selectedStatusLabel}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showStatusDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="absolute z-40 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setStatusFilter(opt.value);
                                            setShowStatusDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${statusFilter === opt.value
                                            ? 'text-flo-orange bg-white/[0.06]'
                                            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[minmax(300px,2fr)_1fr_1fr_1fr_1fr_1fr_40px] gap-x-6 px-6 py-5 border-b border-white/[0.06] text-[11px] font-bold text-white/30 uppercase tracking-widest">
                    <span>Business</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Package</span>
                    <span className="text-center">Vertical</span>
                    <span className="text-center">Start Date</span>
                    <span className="text-center">Updated</span>
                    <span></span>
                </div>

                {/* Rows */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <Loader2 className="w-7 h-7 animate-spin mb-3 text-flo-orange" />
                        <p className="text-sm">Loading clients...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30">
                        <Users className="w-10 h-10 mb-4 text-white/10" />
                        <p className="text-sm font-medium mb-1">No clients found</p>
                        <p className="text-xs text-white/20">
                            {search || statusFilter !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'Create your first client to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => router.push(`/admin/clients/${client.id}`)}
                                className="grid grid-cols-[minmax(300px,2fr)_1fr_1fr_1fr_1fr_1fr_40px] gap-x-6 px-6 py-5 items-center cursor-pointer hover:bg-white/[0.04] transition-colors group"
                            >
                                {/* Business */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] ring-1 ring-white/10 group-hover:ring-flo-orange/30 transition-all flex items-center justify-center shrink-0 overflow-hidden relative">
                                        {client.logo_url ? (
                                            <img src={client.logo_url} alt={client.business_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-5 h-5 text-white/20 group-hover:text-flo-orange/70 transition-colors" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-medium text-white group-hover:text-flo-orange transition-colors truncate">
                                            {client.business_name}
                                        </p>
                                        <p className="text-xs text-white/30 truncate group-hover:text-white/40 transition-colors">{client.slug}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex justify-center">
                                    <StatusBadge status={client.status} />
                                </div>

                                {/* Package */}
                                <span className="text-sm text-center text-white/40 group-hover:text-white/60 transition-colors truncate">
                                    {client.package || client.offers?.find((o) => o.is_primary)?.name || '—'}
                                </span>

                                {/* Vertical */}
                                <span className="text-sm text-center text-white/40 group-hover:text-white/60 transition-colors truncate">{client.vertical}</span>

                                {/* Start Date */}
                                <span className="text-sm text-center text-white/30 group-hover:text-white/50 transition-colors">{formatDate(client.start_date)}</span>

                                {/* Updated */}
                                <span className="text-sm text-center text-white/30 group-hover:text-white/50 transition-colors">{formatDate(client.updated_at)}</span>

                                {/* Actions */}
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={(e) => handleArchive(e, client.id)}
                                        className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                        title="Archive"
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
