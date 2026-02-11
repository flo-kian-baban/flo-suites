import React from 'react';
import { Layers } from 'lucide-react';

const FloStandardCallout = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 p-8 md:p-10">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-flo-orange/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-flo-orange">
                        <Layers className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">The Integrated System</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Power alone. Unstoppable together.</h3>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                        This suite is a powerful specialized unit. But <strong>Flo Standard</strong> integrates it with our clear Strategy and Dev engines to form a complete business operating system.
                    </p>
                </div>

                <div className="w-full md:w-auto p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-3 min-w-[200px]">
                    <div className="text-xs text-neutral-500 uppercase font-bold text-center">Engagement Tiers</div>

                    <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                        <span className="text-xs text-neutral-300">Single Suite</span>
                        <div className="w-2 h-2 rounded-full bg-neutral-600" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-flo-orange/10 border border-flo-orange/20">
                        <span className="text-xs text-flo-orange font-bold">Flo Standard</span>
                        <div className="w-2 h-2 rounded-full bg-flo-orange animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloStandardCallout;
