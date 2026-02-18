import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import VideoWithPlaceholder from '../VideoWithPlaceholder';

const SuiteHeader = ({ title, tagline, summary, outcomes, videoUrl }) => {
    return (
        <div className={`grid grid-cols-1 ${videoUrl ? 'lg:grid-cols-2 gap-12 items-center' : 'gap-6'}`}>
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-flo-orange/30 bg-flo-orange/10 text-flo-orange text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-flo-orange animate-pulse" />
                        <span>Specialized Unit</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                            The Specialization.
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-flo-orange uppercase leading-[0.85] mt-2">
                            {title}.
                        </h1>
                    </div>
                    <p className="text-xl text-neutral-400 font-medium pt-4">{tagline}</p>
                </div>

                <p className="text-lg text-neutral-300 max-w-3xl leading-relaxed border-l-2 border-white/10 pl-6">
                    {summary}
                </p>

                {outcomes && outcomes.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                        {outcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-flo-orange" />
                                <span className="text-xs font-medium text-neutral-300">{outcome}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Video Column */}
            {videoUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <VideoWithPlaceholder
                        src={videoUrl}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
            )}
        </div>
    );
};

export default SuiteHeader;
