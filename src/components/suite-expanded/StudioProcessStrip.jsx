import React from 'react';

const steps = [
    { title: 'Creative Direction', desc: 'Align production with marketing strategy and brand goals before a single frame is shot.' },
    { title: 'Production', desc: 'Seamless on-site shooting that makes people feel comfortable on camera, even if they\u2019re shy.' },
    { title: 'Post Production', desc: 'Editors and designers execute within the marketing scope and creative direction.' },
];

const StudioProcessStrip = () => {
    return (
        <div className="pb-8 -mt-8 md:-mt-8">
            {/* Desktop: horizontal strip */}
            <div className="hidden md:flex items-stretch gap-0 w-full">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        {/* Block */}
                        <div className="flex-1 relative group min-w-0">
                            {/* Card container - MATCHING TEAM CARD STYLE */}
                            <div className="h-full relative rounded-2xl border border-white/10 bg-[#111] transition-all duration-500 hover:border-flo-orange/30 hover:shadow-[0_0_30px_rgba(241,89,45,0.1)] overflow-hidden flex flex-col justify-center p-6">

                                {/* Inner Glow/Highlight */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Title */}
                                <h4 className="text-2xl font-black text-white leading-tight relative z-10 mb-4 tracking-tight">
                                    {step.title}
                                </h4>

                                {/* Description */}
                                <p className="text-sm text-neutral-400 font-medium leading-relaxed relative z-10 max-w-[95%]">
                                    {step.desc}
                                </p>
                            </div>
                        </div>

                        {/* Connector line (wider spacing, NO DOT) */}
                        {idx < steps.length - 1 && (
                            <div className="self-center flex items-center justify-center w-12 shrink-0 relative z-0">
                                {/* Line */}
                                <div className="absolute w-full h-[1px] bg-white/10" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile: vertical stack */}
            <div className="flex md:hidden flex-col items-center gap-0 w-full">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        {/* Block */}
                        <div className="w-full">
                            {/* Card container - MATCHING TEAM CARD STYLE */}
                            <div className="relative rounded-2xl border border-white/10 bg-[#111] p-6 py-8 overflow-hidden">

                                {/* Title */}
                                <h4 className="text-xl font-black text-white leading-tight relative z-10 mb-2 tracking-tight">
                                    {step.title}
                                </h4>

                                {/* Description */}
                                <p className="text-sm text-neutral-400 font-medium leading-relaxed relative z-10">
                                    {step.desc}
                                </p>
                            </div>
                        </div>

                        {/* Vertical connector line (taller spacing, NO DOT) */}
                        {idx < steps.length - 1 && (
                            <div className="relative flex flex-col items-center justify-center h-10 shrink-0">
                                {/* Line */}
                                <div className="absolute h-full w-[1px] bg-white/10" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StudioProcessStrip;
