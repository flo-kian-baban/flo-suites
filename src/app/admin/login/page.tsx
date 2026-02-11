'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
    const { login, isLoading: authLoading } = useAdminAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const success = await login(password);

        if (!success) {
            setError('Invalid password');
            setPassword('');
        }

        setIsSubmitting(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-flo-orange animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.03] blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.04] blur-[120px]" />
            </div>

            <div className="relative w-full max-w-sm animate-scale-in">
                {/* Brand */}
                <div className="text-center mb-10">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-16 w-auto object-contain brightness-0 invert mx-auto mb-6"
                    />
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">Internal Operating System</p>
                </div>

                {/* Login Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-50 blur-sm group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-white/30" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Access Key"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl
                                            text-white placeholder-white/20 text-sm font-medium
                                            focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-flo-orange/20
                                            transition-all duration-200"
                                        autoFocus
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2.5 rounded-lg border border-red-500/10 animate-fade-in">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !password}
                                className="group w-full py-3.5 px-4 bg-flo-orange hover:bg-[#FF6B35] text-white font-bold rounded-xl
                                    shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40
                                    transition-all duration-200 transform active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                                    flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm">Enter Dashboard</span>
                                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-white/20">
                        Secure Environment • v1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}
