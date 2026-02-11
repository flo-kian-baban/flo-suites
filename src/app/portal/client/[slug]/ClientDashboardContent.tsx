'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { Building2, LogOut, ArrowLeft } from 'lucide-react';

interface ClientInfo {
    id: string;
    slug: string;
    business_name: string;
    logo_url: string | null;
    vertical: string;
}

export default function ClientDashboardContent({ client }: { client: ClientInfo }) {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/portal/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
            {/* Top Bar */}
            <header className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/portal" className="text-white/40 hover:text-white/70 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </a>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-flo-orange/10 flex items-center justify-center">
                                {client.logo_url ? (
                                    <img
                                        src={client.logo_url}
                                        alt={client.business_name}
                                        className="w-6 h-6 rounded object-cover"
                                    />
                                ) : (
                                    <Building2 className="w-4 h-4 text-flo-orange" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-white font-semibold text-sm">{client.business_name}</h1>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider">{client.vertical}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-white/30 hover:text-white/60 transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-flo-orange/10 flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-8 h-8 text-flo-orange" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to your dashboard</h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                        Your client portal is being set up. Content, campaigns, and project updates will appear here soon.
                    </p>
                </div>
            </main>
        </div>
    );
}
