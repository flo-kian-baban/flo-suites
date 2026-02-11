import React from 'react';
import { motion } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';

/**
 * EngagementInvestment - A two-column bento layout for investment summary and outcomes (Static Version)
 */
const EngagementInvestment = ({ investment, outcomes }) => {
    if (!investment && (!outcomes || outcomes.length === 0)) return null;

    return (
        <div className="space-y-12 py-10">
            {/* Section Header - Eyebrow */}
            <div className="flex items-center gap-6 py-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    Your Investment
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* High-Impact Section Title */}
            <div className="flex flex-col items-center text-center mt-2 mb-10">
                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                    Strategic Commitment.
                </span>
                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                    YOUR INVESTMENT.
                </span>
            </div>

            {/* Bento Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Investment Summary */}
                {investment && (
                    <div
                        className="md:col-span-1 relative overflow-hidden rounded-2xl bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/8 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    >
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-flo-orange/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 h-full flex flex-col">
                            {/* Label */}
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-flo-orange" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-flo-orange">
                                    {investment.label || 'Engagement Investment'}
                                </span>
                            </div>

                            {/* High-Impact Headline */}
                            <div className="mb-6 flex flex-col">
                                <span className="text-lg font-bold text-white leading-tight">
                                    The Commitment.
                                </span>
                                <span className="text-2xl md:text-3xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                    {investment.title}.
                                </span>
                            </div>

                            {/* Price */}
                            <div className="py-5 border-y border-white/10 mb-4">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    {investment.price}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-neutral-400 leading-relaxed uppercase tracking-wide mt-auto">
                                {investment.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Right Column - Results/Outcomes */}
                {outcomes && outcomes.length > 0 && (
                    <div
                        className="md:col-span-2 relative overflow-hidden rounded-2xl bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/8 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    >
                        <div className="h-full flex flex-col">
                            {/* High-Impact Headline (Ref: Your Lifestyle. YOUR CURRENCY.) */}
                            <div className="mb-8 flex flex-col">
                                <span className="text-lg md:text-xl font-bold text-white leading-tight">
                                    The Result.
                                </span>
                                <span className="text-3xl md:text-5xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                    What You'll Achieve.
                                </span>
                                <p className="text-neutral-400 text-sm mt-4 max-w-sm leading-relaxed font-medium transition-colors group-hover:text-neutral-300">
                                    Tangible outcomes and performance architecture delivered.
                                </p>
                            </div>

                            {/* Outcome Stack */}
                            <div className="flex-1 flex flex-col justify-between gap-3">
                                {outcomes.map((outcome, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex items-center gap-4 py-4 px-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-flo-orange/30 hover:bg-white/[0.05] transition-all duration-300"
                                    >
                                        {/* Status Indicator */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-flo-orange/10 border border-flo-orange/20 flex items-center justify-center group-hover:bg-flo-orange/20">
                                            <Check className="w-4 h-4 text-flo-orange" />
                                        </div>

                                        {/* Outcome Text */}
                                        <span className="flex-1 text-white text-md font-medium leading-snug">
                                            {outcome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngagementInvestment;
