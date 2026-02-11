'use client';

import { Settings, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Settings className="w-7 h-7 text-flo-orange" />
                    Settings
                </h1>
                <p className="text-white/50 mt-1">
                    Admin configuration and preferences
                </p>
            </div>

            {/* Placeholder */}
            <div className="glass-effect rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-flo-orange/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-flo-orange" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
                <p className="text-white/50 max-w-md mx-auto">
                    Settings page will be available in a future update. This will include
                    configuration options for storage, notifications, and admin preferences.
                </p>
            </div>

            {/* Environment Info */}
            <div className="glass-effect rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Environment</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-white/60">Supabase URL</span>
                        <span className="text-white/40 text-sm font-mono">
                            {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-white/60">Supabase Anon Key</span>
                        <span className="text-white/40 text-sm font-mono">
                            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-white/60">Admin Password</span>
                        <span className="text-white/40 text-sm font-mono">
                            ••••••••
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
