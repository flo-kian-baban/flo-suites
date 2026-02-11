'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, X, Shield, ShieldOff, Users, Loader2 } from 'lucide-react';
import {
    searchPortalUsers,
    getLinkedUsersForClient,
    grantClientAccess,
    revokeClientAccess,
    reactivateClientAccess,
    PortalUser,
} from '@/lib/portal';

interface PortalAccessCardProps {
    clientId: string;
}

interface LinkedUser {
    id: string;
    user_id: string;
    client_id: string;
    role: string;
    is_active: boolean;
    created_at: string;
    portal_users: {
        id: string;
        email: string;
        full_name: string | null;
        status: string;
    };
}

export default function PortalAccessCard({ clientId }: PortalAccessCardProps) {
    const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PortalUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [granting, setGranting] = useState<string | null>(null);
    const [toggling, setToggling] = useState<string | null>(null);

    const loadLinkedUsers = useCallback(async () => {
        try {
            const data = await getLinkedUsersForClient(clientId);
            setLinkedUsers(data as LinkedUser[]);
        } catch (err) {
            console.error('Error loading linked users:', err);
        } finally {
            setIsLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        loadLinkedUsers();
    }, [loadLinkedUsers]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchPortalUsers(query);
            // Filter out already-linked users
            const linkedIds = new Set(linkedUsers.map((u) => u.user_id));
            setSearchResults(results.filter((r) => !linkedIds.has(r.id)));
        } catch (err) {
            console.error('Error searching:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleGrant = async (userId: string) => {
        setGranting(userId);
        try {
            await grantClientAccess(userId, clientId);
            setSearchQuery('');
            setSearchResults([]);
            await loadLinkedUsers();
        } catch (err) {
            console.error('Error granting access:', err);
        } finally {
            setGranting(null);
        }
    };

    const handleToggle = async (mappingId: string, currentlyActive: boolean) => {
        setToggling(mappingId);
        try {
            if (currentlyActive) {
                await revokeClientAccess(mappingId);
            } else {
                await reactivateClientAccess(mappingId);
            }
            await loadLinkedUsers();
        } catch (err) {
            console.error('Error toggling access:', err);
        } finally {
            setToggling(null);
        }
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-400 border-green-500/20',
            blocked: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-flo-orange/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-flo-orange" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">Portal Access</h3>
                    <p className="text-xs text-white/40">Manage portal users for this client</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-white/30" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by email to grant access..."
                    className="w-full pl-9 pr-8 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg
                        text-white placeholder-white/20 text-xs
                        focus:outline-none focus:border-flo-orange/50 focus:ring-1 focus:ring-flo-orange/20
                        transition-all duration-200"
                />
                {searchQuery && (
                    <button
                        onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/30 hover:text-white/60"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="mb-4 border border-white/[0.06] rounded-lg overflow-hidden">
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.04] last:border-b-0 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="text-xs text-white font-medium truncate">{user.email}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {user.full_name && (
                                        <span className="text-[10px] text-white/40">{user.full_name}</span>
                                    )}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusBadge(user.status)}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleGrant(user.id)}
                                disabled={granting === user.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-flo-orange/10 text-flo-orange text-[10px] font-semibold rounded-md
                                    hover:bg-flo-orange/20 transition-colors disabled:opacity-50"
                            >
                                {granting === user.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <UserPlus className="w-3 h-3" />
                                )}
                                Grant
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isSearching && (
                <div className="flex items-center justify-center py-3 mb-4">
                    <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                </div>
            )}

            {/* Linked Users List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
                </div>
            ) : linkedUsers.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-xs text-white/30">No portal users linked to this client</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-2">
                        Linked Users ({linkedUsers.length})
                    </p>
                    {linkedUsers.map((mapping) => {
                        const user = mapping.portal_users;
                        return (
                            <div
                                key={mapping.id}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${mapping.is_active
                                        ? 'border-white/[0.06] bg-white/[0.02]'
                                        : 'border-white/[0.04] bg-white/[0.01] opacity-50'
                                    }`}
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-white font-medium truncate">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-white/40 capitalize">{mapping.role}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusBadge(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle(mapping.id, mapping.is_active)}
                                    disabled={toggling === mapping.id}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-md transition-colors disabled:opacity-50 ${mapping.is_active
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        }`}
                                >
                                    {toggling === mapping.id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : mapping.is_active ? (
                                        <ShieldOff className="w-3 h-3" />
                                    ) : (
                                        <Shield className="w-3 h-3" />
                                    )}
                                    {mapping.is_active ? 'Revoke' : 'Reactivate'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
