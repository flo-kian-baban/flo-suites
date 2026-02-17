import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FUNNEL_STEPS = [
    {
        title: 'Generate Insights',
        subtitle: 'Turn business goals into strategy, positioning, and messaging.',
        whatFloDoes: [
            'Define ICP, positioning, and offer angles.',
            'Set messaging pillars and brand tone guardrails.',
            'Turn business goals into measurable targets.',
        ],
        howOthersAlign: [
            'Studio produces content based on the messaging + angles.',
            'Development builds pages/funnels based on the offer + targets.',
        ],
    },
    {
        title: 'Reach',
        subtitle: 'Choose channels, set cadence, and define traffic KPIs.',
        whatFloDoes: [
            'Choose distribution mix (organic, paid, partnerships).',
            'Set channel priorities and posting/ad cadence.',
            'Define KPIs for awareness and traffic quality.',
        ],
        howOthersAlign: [
            'Studio produces platform-native creatives for the chosen channels.',
            'Development ensures tracking-ready destinations for every channel.',
        ],
    },
    {
        title: 'Attract',
        subtitle: 'Create hooks, lead magnets, and content-to-offer flows.',
        whatFloDoes: [
            'Create the "why click" hooks and content themes.',
            'Define lead magnets / content paths (if applicable).',
            'Set content-to-offer flow rules.',
        ],
        howOthersAlign: [
            'Studio executes the creative library and variations.',
            'Development builds landing pages that match the content promise.',
        ],
    },
    {
        title: 'Convert',
        subtitle: 'Set conversion goals, remove friction, and optimize.',
        whatFloDoes: [
            'Define conversion goals (bookings, calls, forms, purchases).',
            'Set funnel stages + friction removers.',
            'Run iterative optimization priorities.',
        ],
        howOthersAlign: [
            'Studio supplies conversion creatives (proof, offers, CTAs).',
            'Development optimizes page speed, UX, forms, and tracking.',
        ],
    },
    {
        title: 'Retain',
        subtitle: 'Build loyalty loops, proof systems, and repeat demand.',
        whatFloDoes: [
            'Set retention loops (follow-ups, reviews, reactivation).',
            'Define trust assets and proof systems.',
            'Plan ongoing campaigns around repeat demand.',
        ],
        howOthersAlign: [
            'Studio creates retention content (testimonials, updates, proof).',
            'Development supports email/SMS flows and retention pages if needed.',
        ],
    },
];

const FUNNEL_WIDTHS = [100, 88, 74, 58, 45];

const MarketingFunnel = () => {
    const [activeStep, setActiveStep] = useState(null);

    const toggleStep = (idx) => {
        setActiveStep((prev) => (prev === idx ? null : idx));
    };

    return (
        <div className="space-y-6">
            {/* Section Header — Eyebrow */}
            <div className="flex items-center gap-6 py-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    The Art of Marketing
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* High-Impact Section Title */}
            <div className="flex flex-col items-center text-center mt-2 mb-10">
                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                    Marketing that orchestrates the whole system.
                </span>
                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                    THE FUNNEL.
                </span>
            </div>

            {/* Funnel Stack */}
            <div className="flex flex-col items-start gap-3 pt-4">
                {FUNNEL_STEPS.map((step, idx) => {
                    const isOpen = activeStep === idx;
                    const widthPct = FUNNEL_WIDTHS[idx];
                    const number = String(idx + 1).padStart(2, '0');

                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center"
                            style={{ width: `${widthPct}%` }}
                        >
                            {/* Card */}
                            <button
                                onClick={() => toggleStep(idx)}
                                className={`
                                    w-full relative flex items-center px-6 py-5
                                    transition-all duration-300 ease-out cursor-pointer
                                    ${isOpen
                                        ? 'bg-white/[0.06] border-flo-orange/30 rounded-t-2xl rounded-b-none'
                                        : 'bg-white/[0.03] border-white/[0.06] hover:border-flo-orange/25 hover:bg-white/[0.05] rounded-2xl'
                                    }
                                    border
                                `}
                                style={{
                                    boxShadow: isOpen
                                        ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px rgba(241,89,45,0.07)'
                                        : 'inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 8px rgba(0,0,0,0.2)',
                                }}
                            >
                                {/* Title + Subtitle — left aligned */}
                                <div className="flex-1 flex flex-col items-start text-left gap-0.5">
                                    <span className={`
                                        text-base md:text-lg font-bold tracking-tight
                                        transition-colors duration-300
                                        ${isOpen ? 'text-flo-orange' : 'text-flo-orange/80'}
                                    `}>
                                        {step.title}
                                    </span>
                                    <span className={`
                                        text-[11px] md:text-xs font-medium
                                        transition-colors duration-300
                                        ${isOpen ? 'text-white/50' : 'text-white/30'}
                                    `}>
                                        {step.subtitle}
                                    </span>
                                </div>

                                {/* Chevron — right */}
                                <ChevronDown
                                    className={`
                                        w-5 h-5 shrink-0 transition-all duration-300
                                        ${isOpen ? 'rotate-180 text-flo-orange' : 'text-white/20'}
                                    `}
                                />
                            </button>

                            {/* Dropdown Panel — fused to card bottom */}
                            <div
                                className="w-full overflow-hidden"
                                style={{
                                    maxHeight: isOpen ? '400px' : '0px',
                                    opacity: isOpen ? 1 : 0,
                                    transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                                }}
                            >
                                <div
                                    className="w-full px-6 py-5 bg-white/[0.03] border border-t-0 border-white/[0.07] rounded-b-2xl"
                                    style={{
                                        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.02)',
                                    }}
                                >
                                    {/* What Flo Marketing does */}
                                    <div className="mb-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-flo-orange/70 mb-2">
                                            What Flo Marketing Does
                                        </h5>
                                        <ul className="space-y-1.5">
                                            {step.whatFloDoes.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300 leading-relaxed">
                                                    <span className="w-1 h-1 rounded-full bg-flo-orange/50 mt-[7px] shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* How other suites align */}
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-2">
                                            How Other Suites Align
                                        </h5>
                                        <ul className="space-y-1.5">
                                            {step.howOthersAlign.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-400 leading-relaxed">
                                                    <span className="w-1 h-1 rounded-full bg-white/20 mt-[7px] shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketingFunnel;
