import React from 'react';
import { ArrowRight } from 'lucide-react';

const ProcessSteps = ({ steps }) => {
    if (!steps) return null;

    return (
        <div className="space-y-8">
            {/* Section Header - Eyebrow */}
            <div className="flex items-center gap-6 py-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    The Process
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* High-Impact Section Title */}
            <div className="flex flex-col items-center text-center mt-2 mb-10">
                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                    Execution Workflow.
                </span>
                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                    THE PROCESS.
                </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {steps.map((step, idx) => (
                    <div key={idx} className="relative group/card">
                        <div className="relative h-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-10 hover:border-flo-orange/40 transition-all duration-500 overflow-hidden">
                            {/* Background Step Number - Right Top */}
                            <span className="absolute top-2 right-6 text-7xl md:text-9xl font-black text-white/[0.03] leading-none pointer-events-none transition-all duration-500 group-hover/card:text-white/[0.07] group-hover/card:scale-110">
                                {idx + 1}
                            </span>

                            {/* High-Impact Headline */}
                            <div className="mb-6 flex flex-col relative z-10">
                                <span className="text-2xl md:text-4xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                    {step.title}.
                                </span>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-medium max-w-2xl">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcessSteps;
