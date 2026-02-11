'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { Clock, RefreshCw, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function PortalPendingPage() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/portal/login');
            return;
        }

        // Check if any active mappings exist now
        const { data: mappings } = await supabase
            .from('portal_user_clients')
            .select('client_id, clients:client_id (slug)')
            .eq('user_id', user.id)
            .eq('is_active', true);

        const activeMappings = mappings || [];

        if (activeMappings.length === 1) {
            const slug = (activeMappings[0] as any).clients?.slug;
            if (slug) {
                router.push(`/portal/client/${slug}`);
                return;
            }
        } else if (activeMappings.length > 1) {
            router.push('/portal/select-client');
            return;
        }

        // Still pending
        setIsRefreshing(false);
    };

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

            <div className="relative w-full max-w-sm text-center">
                {/* Brand */}
                <div className="mb-10">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-12 w-auto object-contain brightness-0 invert mx-auto"
                    />
                </div>

                {/* Pending Card */}
                <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-flo-orange/10 flex items-center justify-center mx-auto mb-5">
                        <Clock className="w-7 h-7 text-flo-orange" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">Pending Approval</h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">
                        Your account has been created successfully. We&apos;re finishing setup on our end. You&apos;ll get access once approved.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="w-full py-3 px-4 bg-flo-orange hover:bg-[#FF6B35] text-white font-bold rounded-xl
                                shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40
                                transition-all duration-200 active:scale-[0.98]
                                disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2 text-sm"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Checking...' : 'Refresh Access'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white
                                font-medium rounded-xl transition-all duration-200
                                flex items-center justify-center gap-2 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
