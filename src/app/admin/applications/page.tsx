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
    Filter,
    X,
} from 'lucide-react';
import { Application } from '@/lib/applications';
import { getAdminApplications } from '@/actions/admin';

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
    'flo-os': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Funnel Builder': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'media-marketing': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

const INTENT_COLORS: Record<string, string> = {
    'full-operating-system': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'funnel-conversion': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'media-content': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    'not-sure': 'bg-white/5 text-white/40 border-white/10',
};

/* ─── Helper Components ─── */
const Badge = ({ label, colorClass }: { label: string; colorClass: string }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
        {label}
    </span>
);

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{label}</span>
            <span className="text-sm text-neutral-200">{value}</span>
        </div>
    );
};

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
        <h4 className="text-xs font-bold text-flo-orange uppercase tracking-widest border-b border-white/[0.06] pb-2">{title}</h4>
        <div className="grid gap-4">
            {children}
        </div>
    </div>
);

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [sourceFilter, setSourceFilter] = useState<string>('all');

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
        });
    };

    // Filter applications
    const filteredApps = applications.filter(app => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (app.name || '').toLowerCase().includes(searchLower) ||
            (app.email || '').toLowerCase().includes(searchLower) ||
            (app.business_name || '').toLowerCase().includes(searchLower)
        );

        const appSource = (app as any).source || app.data?.source || app.type || '';

        const matchesSource = sourceFilter === 'all' || appSource === sourceFilter;

        return matchesSearch && matchesSource;
    });

    const renderApplicationDetails = (app: Application) => {
        const { data } = app;
        return (
            <div className="p-6 bg-black/40 border-t border-white/[0.06]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Column 1: Contact & Business */}
                    <div className="space-y-8">
                        <DetailSection title="Contact Info">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-neutral-300">
                                    <Mail className="w-4 h-4 text-flo-orange shrink-0" />
                                    <span>{app.email}</span>
                                </div>
                                {data.phone && (
                                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                                        <Phone className="w-4 h-4 text-flo-orange shrink-0" />
                                        <span>{data.phone}</span>
                                    </div>
                                )}
                                {data.website && (
                                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                                        <Globe className="w-4 h-4 text-flo-orange shrink-0" />
                                        <a
                                            href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white underline decoration-white/20 underline-offset-4 truncate"
                                        >
                                            {data.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </DetailSection>

                        <DetailSection title="Business Profile">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailRow label="Industry" value={data.industry} />
                                <DetailRow label="Est. Revenue" value={data.monthlyRevenue} />
                                <DetailRow label="Team Size" value={data.teamSize} />
                                <DetailRow label="Years in Ops" value={data.yearsInOperation} />
                            </div>
                        </DetailSection>
                    </div>

                    {/* Column 2: Strategy & System */}
                    <div className="space-y-8">
                        <DetailSection title="Growth Strategy">
                            <div className="space-y-4">
                                {data.primaryOffers?.length > 0 && (
                                    <DetailRow
                                        label="Primary Offers"
                                        value={
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {data.primaryOffers.map((offer: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-neutral-300">
                                                        {offer}
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                                {data.growthGoals?.length > 0 && (
                                    <DetailRow
                                        label="Goals"
                                        value={
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {data.growthGoals.map((goal: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-xs">
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                            </div>
                        </DetailSection>

                        <DetailSection title="System Maturity (1-5)">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: 'Brand Clarity', value: data.brandClarity },
                                    { label: 'Content Sys', value: data.contentSystem },
                                    { label: 'Lead Gen', value: data.leadGeneration },
                                    { label: 'Conversion', value: data.conversionSystem },
                                    { label: 'Data Vis', value: data.dataVisibility },
                                    { label: 'Execution', value: data.executionProcess },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between bg-white/5 rounded px-3 py-2 border border-white/5">
                                        <span className="text-[10px] uppercase text-white/40 font-semibold">{item.label}</span>
                                        <span className="text-sm font-bold text-white">{item.value ?? '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    </div>

                    {/* Column 3: Context & Notes */}
                    <div className="space-y-8">
                        <DetailSection title="Assessment">
                            <div className="space-y-4">
                                <DetailRow label="Current Situation" value={data.situation} />
                                <DetailRow label="Time Horizon" value={data.timeHorizon} />
                                {data.bottlenecks?.length > 0 && (
                                    <DetailRow
                                        label="Bottlenecks"
                                        value={
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {data.bottlenecks.map((b: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded text-xs">
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                                {data.frustrationText && (
                                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                        <p className="text-xs text-red-200/80 italic">"{data.frustrationText}"</p>
                                    </div>
                                )}
                            </div>
                        </DetailSection>

                        <DetailSection title="Final Notes">
                            <div className="space-y-4">
                                <DetailRow label="Decision Authority" value={data.decisionAuthority} />
                                {data.finalQuestion && (
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Final Question / Notes</span>
                                        <p className="text-sm text-neutral-300 bg-white/5 p-3 rounded-lg border border-white/5">
                                            {data.finalQuestion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </DetailSection>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full px-6 pb-20 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
                    <p className="text-white/50">Unified view of all incoming leads & form submissions.</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or business..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-flo-orange/40 transition-colors"
                    />
                </div>

                {/* Filter: Source */}
                <div className="relative min-w-[180px]">
                    <div className="relative">
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-flo-orange/40 transition-colors cursor-pointer pl-10"
                        >
                            <option value="all" className="bg-[#1a1a1a] text-white">All Sources</option>
                            {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                                <option key={key} value={key} className="bg-[#1a1a1a] text-white">{label}</option>
                            ))}
                        </select>
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs text-white/30 uppercase tracking-widest font-semibold border-b border-white/[0.06] pb-4">
                <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-flo-orange" />
                    <span className="text-white">{filteredApps.length}</span> Results
                </span>
                {(sourceFilter !== 'all' || searchQuery) && (
                    <button
                        onClick={() => {
                            setSourceFilter('all');
                            setSearchQuery('');
                        }}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Clear Filters
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[minmax(250px,2fr)_minmax(200px,1.5fr)_1.5fr_1fr_40px] gap-x-6 px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-bold text-white/30 uppercase tracking-widest">
                    <span>Applicant</span>
                    <span>Business</span>
                    <span>Source / Intent</span>
                    <span className="text-right">Date</span>
                    <span></span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/30">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-flo-orange" />
                        <p className="text-sm">Loading applications...</p>
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/30">
                        <Filter className="w-8 h-8 mb-4 text-white/10" />
                        <p className="text-sm">No applications found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {filteredApps.map(app => {
                            const source = (app as any).source || app.data?.source || app.type || '';
                            const intent = (app as any).primary_intent || app.data?.primaryIntent || '';
                            const isExpanded = expandedAppId === app.id;

                            return (
                                <div key={app.id} className={`group transition-colors ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}>
                                    {/* Row Content */}
                                    <div
                                        onClick={() => toggleAppExpand(app.id)}
                                        className="grid grid-cols-[minmax(250px,2fr)_minmax(200px,1.5fr)_1.5fr_1fr_40px] gap-x-6 px-6 py-4 items-center cursor-pointer"
                                    >
                                        {/* Applicant */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate group-hover:text-flo-orange transition-colors">
                                                {app.name || 'Unknown Applicant'}
                                            </p>
                                            <p className="text-xs text-white/40 truncate">{app.email}</p>
                                        </div>

                                        {/* Business */}
                                        <div className="min-w-0">
                                            {app.business_name ? (
                                                <>
                                                    <p className="text-sm text-neutral-200 truncate">{app.business_name}</p>
                                                    {app.data?.website && (
                                                        <p className="text-xs text-white/30 truncate max-w-[200px]">{app.data.website}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-white/20 italic">No business provided</span>
                                            )}
                                        </div>

                                        {/* Source / Intent */}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                label={SOURCE_LABELS[source] || source || '?'}
                                                colorClass={SOURCE_COLORS[source] || 'bg-white/5 text-white/30 border-white/10'}
                                            />
                                            {intent && (
                                                <Badge
                                                    label={INTENT_LABELS[intent] || intent}
                                                    colorClass={INTENT_COLORS[intent] || 'bg-white/5 text-white/30 border-white/10'}
                                                />
                                            )}
                                        </div>

                                        {/* Date */}
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-white/50">{formatDate(app.created_at)}</p>
                                        </div>

                                        {/* Expand Icon */}
                                        <div className="flex justify-center">
                                            <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
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
        </div>
    );
}
