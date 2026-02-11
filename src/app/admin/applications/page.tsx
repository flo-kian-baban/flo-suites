'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    Search,
    ChevronDown,
    Calendar,
    Mail,
    Globe,
    Phone,
    Building2,
    Layers,
    MapPin,
    Target,
} from 'lucide-react';
import { Application } from '@/lib/applications';
import { getAdminApplications } from '@/actions/admin';

/* ─── Helper: Render an array of strings as tags ─── */
const Tags = ({ items, color = 'bg-white/10' }: { items: string[]; color?: string }) => (
    <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-lg ${color} text-xs text-neutral-200`}>{item}</span>
        ))}
    </div>
);

/* ─── Helper: Render a single key-value detail row ─── */
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">{label}</span>
            <span className="text-sm text-neutral-200">{typeof value === 'string' || typeof value === 'number' ? value : value}</span>
        </div>
    );
};

/* ─── Helper: Section header inside details ─── */
const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
        <h4 className="text-xs font-bold text-flo-orange/70 uppercase tracking-widest border-b border-white/5 pb-2">{title}</h4>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

/* ─── Source & Intent label maps ─── */
const SOURCE_LABELS: Record<string, string> = {
    'flo-os': 'Flo OS',
    'Funnel Builder': 'Funnel Builder',
    'media-marketing': 'Media Marketing',
};

const INTENT_LABELS: Record<string, string> = {
    'full-operating-system': 'Full OS',
    'funnel-conversion': 'Funnel & Conversion',
    'media-content': 'Media & Content',
    'not-sure': 'Undecided',
};

const SOURCE_COLORS: Record<string, string> = {
    'flo-os': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Funnel Builder': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'media-marketing': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const INTENT_COLORS: Record<string, string> = {
    'full-operating-system': 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    'funnel-conversion': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    'media-content': 'bg-pink-500/15 text-pink-300 border-pink-500/20',
    'not-sure': 'bg-white/10 text-white/50 border-white/10',
};

/* ─── Badge Component ─── */
const Badge = ({ label, colorClass }: { label: string; colorClass: string }) => (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
        {label}
    </span>
);

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const data = await getAdminApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAppExpand = (id: string) => {
        setExpandedAppId(expandedAppId === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter applications
    const filteredApps = applications.filter(app => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (app.name || '').toLowerCase().includes(searchLower) ||
            (app.email || '').toLowerCase().includes(searchLower) ||
            (app.business_name || '').toLowerCase().includes(searchLower)
        );
    });

    /* ═══════════════════════════════════════════════════════════
       UNIFIED DETAIL RENDERER
       ═══════════════════════════════════════════════════════════ */

    const renderApplicationDetails = (app: Application) => {
        const { data } = app;
        // Determine source and intent — prefer top-level columns, fall back to data
        const source = (app as any).source || data?.source || app.type || '';
        const intent = (app as any).primary_intent || data?.primaryIntent || '';

        return (
            <div className="p-5 space-y-6">
                {/* Source & Intent */}
                <DetailSection title="Application Context">
                    <div className="flex flex-wrap gap-4">
                        <div className="space-y-1">
                            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" /> Source
                            </span>
                            <Badge
                                label={SOURCE_LABELS[source] || source || 'Unknown'}
                                colorClass={SOURCE_COLORS[source] || 'bg-white/10 text-white/50 border-white/10'}
                            />
                        </div>
                        {intent && (
                            <div className="space-y-1">
                                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <Target className="w-3 h-3" /> Primary Intent
                                </span>
                                <Badge
                                    label={INTENT_LABELS[intent] || intent}
                                    colorClass={INTENT_COLORS[intent] || 'bg-white/10 text-white/50 border-white/10'}
                                />
                            </div>
                        )}
                    </div>
                </DetailSection>

                {/* Contact Info */}
                <DetailSection title="Contact Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2.5 text-neutral-300">
                            <Mail className="w-4 h-4 text-flo-orange shrink-0" />
                            <span className="text-sm truncate">{app.email}</span>
                        </div>
                        {data.phone && (
                            <div className="flex items-center gap-2.5 text-neutral-300">
                                <Phone className="w-4 h-4 text-flo-orange shrink-0" />
                                <span className="text-sm">{data.phone}</span>
                            </div>
                        )}
                        {data.website && (
                            <div className="flex items-center gap-2.5 text-neutral-300">
                                <Globe className="w-4 h-4 text-flo-orange shrink-0" />
                                <a
                                    href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:text-white underline decoration-white/20 underline-offset-4 truncate"
                                >
                                    {data.website}
                                </a>
                            </div>
                        )}
                        {app.business_name && (
                            <div className="flex items-center gap-2.5 text-neutral-300">
                                <Building2 className="w-4 h-4 text-flo-orange shrink-0" />
                                <span className="text-sm">{app.business_name}</span>
                            </div>
                        )}
                    </div>
                </DetailSection>

                {/* Application Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Business Snapshot */}
                    <DetailSection title="Business Snapshot">
                        <DetailRow label="Industry" value={data.industry} />
                        <DetailRow label="Years in Operation" value={data.yearsInOperation} />
                        <DetailRow label="Team Size" value={data.teamSize} />
                        <DetailRow label="Monthly Revenue" value={data.monthlyRevenue} />
                        {data.primaryOffers?.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Primary Offers</span>
                                <Tags items={data.primaryOffers} />
                            </div>
                        )}
                    </DetailSection>

                    {/* Growth Intent */}
                    <DetailSection title="Growth Intent">
                        {data.growthGoals?.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Growth Goals</span>
                                <Tags items={data.growthGoals} color="bg-purple-500/20" />
                            </div>
                        )}
                        <DetailRow label="Time Horizon" value={data.timeHorizon} />
                        <DetailRow label="Situation" value={data.situation} />
                    </DetailSection>

                    {/* System Maturity */}
                    <DetailSection title="System Maturity Scores">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Brand Clarity', value: data.brandClarity },
                                { label: 'Content System', value: data.contentSystem },
                                { label: 'Lead Generation', value: data.leadGeneration },
                                { label: 'Conversion System', value: data.conversionSystem },
                                { label: 'Data Visibility', value: data.dataVisibility },
                                { label: 'Execution Process', value: data.executionProcess },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                    <span className="text-xs text-white/50">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.value ?? '—'}<span className="text-white/30 font-normal">/5</span></span>
                                </div>
                            ))}
                        </div>
                    </DetailSection>

                    {/* Bottlenecks */}
                    <DetailSection title="Bottlenecks & Frustrations">
                        {data.bottlenecks?.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Bottlenecks</span>
                                <Tags items={data.bottlenecks} color="bg-red-500/20" />
                            </div>
                        )}
                        <DetailRow label="Frustration (Open Text)" value={data.frustrationText} />
                    </DetailSection>

                    {/* Fit & Commitment */}
                    <DetailSection title="Fit & Commitment">
                        <DetailRow label="Decision Authority" value={data.decisionAuthority} />
                        <DetailRow label="Readiness" value={data.readiness} />
                    </DetailSection>

                    {/* Final Details */}
                    <DetailSection title="Final Details">
                        <DetailRow label="Final Question / Notes" value={data.finalQuestion} />
                    </DetailSection>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
                    <p className="text-white/50">Unified view of all incoming leads — sorted by date.</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-flo-orange/50 transition-colors"
                    />
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-flo-orange" />
                    <span className="font-semibold text-white">{filteredApps.length}</span> applications
                </span>
            </div>

            {/* Applications List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/30">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-flo-orange" />
                    <p>Loading applications...</p>
                </div>
            ) : filteredApps.length === 0 ? (
                <p className="text-center py-20 text-white/30 italic">No applications found.</p>
            ) : (
                <div className="space-y-3">
                    {filteredApps.map(app => {
                        const source = (app as any).source || app.data?.source || app.type || '';
                        const intent = (app as any).primary_intent || app.data?.primaryIntent || '';

                        return (
                            <div
                                key={app.id}
                                className={`rounded-xl border transition-all duration-300 overflow-hidden ${expandedAppId === app.id
                                    ? 'bg-white/5 border-white/20'
                                    : 'bg-black/20 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {/* App Row Header */}
                                <div
                                    onClick={() => toggleAppExpand(app.id)}
                                    className="p-4 flex items-center justify-between cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-white group-hover:text-flo-orange transition-colors truncate">
                                                {app.name || 'Unknown Name'}
                                            </h3>
                                            <p className="text-xs text-white/40 truncate">{app.business_name || 'No Business Name'}</p>
                                        </div>
                                        {/* Badges */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge
                                                label={SOURCE_LABELS[source] || source || '?'}
                                                colorClass={SOURCE_COLORS[source] || 'bg-white/10 text-white/40 border-white/10'}
                                            />
                                            {intent && (
                                                <Badge
                                                    label={INTENT_LABELS[intent] || intent}
                                                    colorClass={INTENT_COLORS[intent] || 'bg-white/10 text-white/40 border-white/10'}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-white/40 shrink-0 ml-4">
                                        <span className="hidden sm:flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(app.created_at)}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedAppId === app.id ? 'rotate-180 text-white' : ''}`} />
                                    </div>
                                </div>

                                {/* App Expanded Details */}
                                <AnimatePresence>
                                    {expandedAppId === app.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-white/5 bg-black/20"
                                        >
                                            {renderApplicationDetails(app)}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
