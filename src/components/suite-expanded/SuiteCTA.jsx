import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

const SuiteCTA = ({ suiteName, primaryAction, secondaryAction }) => {
    return (
        <div className="p-6 border-t border-white/20 bg-black/50 backdrop-blur-3xl z-20 shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="hidden md:flex flex-col gap-1">
                    <span className="text-sm font-bold text-white">Ready to deploy?</span>
                    <span className="text-xs text-neutral-500">Engage the {suiteName} team or explore standard integration.</span>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white text-sm transition-all flex items-center justify-center gap-2 group">
                        <Layers className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                        <span>Explore Flo OS</span>
                    </button>

                    <button className="flex-1 md:flex-none px-8 py-3.5 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold shadow-lg shadow-flo-orange/25 hover:shadow-flo-orange/40 transition-all flex items-center justify-center gap-2">
                        <span>Work with {suiteName}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuiteCTA;
