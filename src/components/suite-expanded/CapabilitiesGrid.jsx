import React from 'react';

const CapabilitiesGrid = ({ capabilities, hideHeader = false }) => {
    if (!capabilities) return null;

    return (
        <div className={hideHeader ? '' : 'space-y-6'}>
            {!hideHeader && (
                <>
                    {/* Section Header - Eyebrow */}
                    <div className="flex items-center gap-6 py-4">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                            Capabilities
                        </span>
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                    </div>

                    {/* High-Impact Section Title */}
                    <div className="mb-10 flex flex-col items-center text-center">
                        <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                            The Force Multipliers.
                        </span>
                        <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                            CORE SKILLSETS.
                        </span>
                    </div>
                </>
            )}

            <div className="flex items-stretch gap-0">
                {capabilities.map((cat, idx) => (
                    <React.Fragment key={idx}>
                        {idx > 0 && (
                            <div className="hidden md:flex items-center">
                                <div className="w-6 h-px bg-white/10" />
                            </div>
                        )}
                        <div className="flex-1 bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-flo-orange/30 transition-colors">
                            <h4 className="text-base font-bold text-white mb-3">{cat.title}</h4>
                            {cat.description ? (
                                <p className="text-sm text-neutral-400 leading-relaxed">{cat.description}</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cat.items?.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                                            <span className="w-1 h-1 rounded-full bg-flo-orange/50 mt-2 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CapabilitiesGrid;
