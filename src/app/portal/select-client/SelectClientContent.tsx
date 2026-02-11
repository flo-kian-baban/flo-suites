'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { Building2, ArrowRight, LogOut } from 'lucide-react';

interface ClientInfo {
    id: string;
    slug: string;
    business_name: string;
    logo_url: string | null;
    vertical: string;
}

interface MappingWithClient {
    id: string;
    role: string;
    clients: ClientInfo;
}

export default function SelectClientContent({ mappings }: { mappings: MappingWithClient[] }) {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/portal/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.03] blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.04] blur-[120px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-12 w-auto object-contain brightness-0 invert mx-auto mb-4"
                    />
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
                        Select Workspace
                    </p>
                </div>

                {/* Client list */}
                <div className="space-y-3">
                    {mappings.map((mapping) => {
                        const clientRaw = mapping.clients;
                        // Handle potential array from Supabase join
                        const client = Array.isArray(clientRaw) ? clientRaw[0] : clientRaw;

                        if (!client) return null;

                        return (
                            <button
                                key={mapping.id}
                                onClick={() => router.push(`/portal/client/${client.slug}`)}
                                className="group w-full relative bg-[#111] border border-white/10 hover:border-white/20 rounded-2xl p-5
                                    flex items-center gap-4 transition-all duration-200 hover:bg-white/[0.03]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-flo-orange/10 flex items-center justify-center flex-shrink-0">
                                    {client.logo_url ? (
                                        <img
                                            src={client.logo_url}
                                            alt={client.business_name}
                                            className="w-8 h-8 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-5 h-5 text-flo-orange" />
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <h3 className="text-white font-semibold text-sm truncate">{client.business_name}</h3>
                                    <p className="text-white/40 text-xs capitalize">{client.vertical}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-flo-orange group-hover:translate-x-0.5 transition-all" />
                            </button>
                        );
                    })}
                </div>

                {/* Logout */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="text-white/30 hover:text-white/60 text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                        <LogOut className="w-3 h-3" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
