import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollTimeline - A vertical timeline component (Static Version)
 */
const ScrollTimeline = ({
    steps,
    eyebrow = "How The System Works",
    title = "Operational Blueprint.",
    highlightTitle = "THE SYSTEM."
}) => {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="space-y-12 py-10">
            {/* Section Header - Eyebrow */}
            <div className="flex items-center gap-6">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    {eyebrow}
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* High-Impact Section Title */}
            <div className="flex flex-col items-center text-center">
                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {title}
                </span>
                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                    {highlightTitle}
                </span>
            </div>

            {/* Timeline Container */}
            <div className="relative py-8">
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2">
                    {/* Full orange line (Static) */}
                    <div className="absolute inset-0 bg-flo-orange/30 rounded-full" />
                    <div className="absolute inset-x-0 top-0 bottom-0 bg-flo-orange rounded-full shadow-[0_0_15px_rgba(241,89,45,0.3)]" />
                </div>

                {/* Steps */}
                <div className="relative space-y-16">
                    {steps.map((step, idx) => {
                        const isLeft = idx % 2 === 0;

                        return (
                            <div
                                key={idx}
                                className={`relative flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                {/* Step Container */}
                                <div className={`w-[calc(50%-2rem)] text-left`}>
                                    <div
                                        className="relative p-6 rounded-2xl bg-[#1A1A1A]/80 backdrop-blur-xl border border-flo-orange/20 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_20px_rgba(241,89,45,0.1)] overflow-hidden group/card"
                                    >
                                        {/* Background Step Number - Right Top */}
                                        <span className="absolute top-2 right-4 text-7xl md:text-9xl font-black text-white/[0.03] leading-none pointer-events-none transition-all duration-500 group-hover/card:text-white/[0.07] group-hover/card:scale-110">
                                            {idx + 1}
                                        </span>

                                        {/* High-Impact Headline */}
                                        <div className={`mb-2 flex flex-col items-start relative z-10`}>
                                            <span className="text-3xl md:text-5xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                                {step.title}
                                            </span>
                                            {step.subtitle && (
                                                <span className="text-sm md:text-base font-semibold text-neutral-400 mt-2 tracking-wide">
                                                    {step.subtitle}
                                                </span>
                                            )}
                                            {step.timeframe && (
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">
                                                    {step.timeframe}
                                                </span>
                                            )}
                                        </div>

                                        {/* Step Description */}
                                        <div className="relative z-10 mt-4">
                                            <p className="text-sm text-neutral-300 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bullet Node */}
                                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-[#1A1A1A] bg-flo-orange shadow-[0_0_12px_rgba(241,89,45,0.8)]"
                                    />
                                </div>

                                {/* Empty space for alternating layout */}
                                <div className="w-[calc(50%-2rem)]" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ScrollTimeline;
