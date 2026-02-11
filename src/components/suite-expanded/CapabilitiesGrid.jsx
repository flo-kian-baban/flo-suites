import React from 'react';

const CapabilitiesGrid = ({ capabilities }) => {
    if (!capabilities) return null;

    return (
        <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {capabilities.map((cat, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
                        <h4 className="text-base font-bold text-white mb-3">{cat.title}</h4>
                        <ul className="space-y-2">
                            {cat.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                                    <span className="w-1 h-1 rounded-full bg-flo-orange/50 mt-2 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CapabilitiesGrid;
