'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function PortalSignupPage() {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setIsSubmitting(false);
            return;
        }

        // Update full_name in portal_users if provided
        if (fullName) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('portal_users')
                    .update({ full_name: fullName })
                    .eq('id', user.id);
            }
        }

        router.push('/portal/pending');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.03] blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flo-orange/[0.04] blur-[120px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Brand */}
                <div className="text-center mb-10">
                    <img
                        src="/assets/FLO.png"
                        alt="FLO"
                        className="h-12 w-auto object-contain brightness-0 invert mx-auto mb-4"
                    />
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
                        Client Portal
                    </p>
                </div>

                {/* Signup Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-50 blur-sm group-hover:opacity-100 transition duration-1000" />
                    <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                        <h2 className="text-lg font-semibold text-white mb-1">Create Account</h2>
                        <p className="text-white/40 text-sm mb-6">Sign up for portal access</p>

                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Full Name */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-white/30" />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name (optional)"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl
                                        text-white placeholder-white/20 text-sm font-medium
                                        focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-flo-orange/20
                                        transition-all duration-200"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-white/30" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl
                                        text-white placeholder-white/20 text-sm font-medium
                                        focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-flo-orange/20
                                        transition-all duration-200"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-white/30" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password (min. 6 characters)"
                                    required
                                    minLength={6}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl
                                        text-white placeholder-white/20 text-sm font-medium
                                        focus:outline-none focus:border-flo-orange/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-flo-orange/20
                                        transition-all duration-200"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2.5 rounded-lg border border-red-500/10">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !email || !password}
                                className="group w-full py-3.5 px-4 bg-flo-orange hover:bg-[#FF6B35] text-white font-bold rounded-xl
                                    shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40
                                    transition-all duration-200 transform active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                                    flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm">Sign Up</span>
                                        <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                            <p className="text-white/40 text-xs">
                                Already have an account?{' '}
                                <a href="/portal/login" className="text-flo-orange hover:text-flo-orange-light transition-colors font-medium">
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
