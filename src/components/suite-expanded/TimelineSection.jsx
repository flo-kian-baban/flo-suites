import React from 'react';
import { motion } from 'framer-motion';

const TimelineStep = ({ step, index }) => {
    const isLeft = index % 2 === 0;

    return (
        <div className={`relative flex items-center justify-between md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} mb-12 last:mb-0 group`}>
            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px -10% 0px", once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-[44%] pl-12 md:pl-0"
            >
                <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-500 backdrop-blur-sm overflow-hidden group/card">
                    {/* Background Step Number - Right Top */}
                    <span className="absolute top-0 right-2 text-7xl md:text-9xl font-black text-white/[0.03] leading-none pointer-events-none transition-all duration-500 group-hover/card:text-white/[0.07] group-hover/card:scale-110">
                        {index + 1}
                    </span>

                    <div className="flex flex-col gap-0 relative z-10">
                        <div className={`flex flex-col items-start`}>
                            <span className="text-3xl md:text-5xl font-black text-flo-orange uppercase tracking-tight mt-0 leading-[0.9]">
                                {step.title}
                            </span>
                            {step.timeframe && (
                                <span className="text-[14px] font-bold text-flo-orange/40 uppercase tracking-[0.2em] mt-3">
                                    {step.timeframe}
                                </span>
                            )}
                        </div>
                        <p className="text-neutral-300 text-sm leading-relaxed max-w-[80%] mt-3">
                            {step.description}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block w-[45%]" />

            {/* Bullet - Absolute Center - STATIC ORANGE */}
            <div className="absolute left-[19px] md:left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 -translate-x-1/2 z-10">
                <div className="absolute inset-0 rounded-full bg-flo-orange shadow-[0_0_12px_rgba(241,89,45,1)] border-2 border-[#0A0A0A]" />
            </div>
        </div>
    );
};

const TimelineSection = ({ timeline, title = "THE TIMELINE.", subtitle = "Strategic Rollout." }) => {
    // If no timeline data, don't render anything
    if (!timeline || timeline.length === 0) return null;

    return (
        <div className="w-full space-y-0">
            {/* Section Header - Eyebrow */}
            <div className="flex items-center gap-6 py-12">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    The Process
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* High-Impact Section Title */}
            <div className="flex flex-col items-center text-center mt-2 pb-14">
                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {subtitle}
                </span>
                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                    {title}
                </span>
            </div>

            <div className="relative w-full max-w-5xl mx-auto py-12 md:py-24">
                {/* Line - STATIC ORANGE */}
                <div className="absolute left-[19px] md:left-1/2 top-12 bottom-12 w-[2px] bg-white/5 md:-translate-x-1/2">
                    <div className="w-full h-full bg-flo-orange shadow-[0_0_15px_rgba(241,89,45,0.6)]" />
                </div>

                <div className="flex flex-col gap-8">
                    {timeline.map((step, idx) => (
                        <TimelineStep key={idx} step={step} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineSection;
