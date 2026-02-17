import React from 'react';

const PROBLEMS = [
    {
        title: "Booking Systems",
        line: "Reduce no-shows, speed up scheduling, remove friction."
    },
    {
        title: "CRM & Follow-Ups",
        line: "Centralize leads, automate reminders, close faster."
    },
    {
        title: "Workflow Automation",
        line: "Eliminate repetitive admin work with clean automations."
    },
    {
        title: "Website Rebuilds",
        line: "Rebuild for trust, speed, and conversion, not just looks."
    }
];

const PATHS = [
    {
        title: "Build it once. Own it.",
        body: "We deliver the system and you run it, no ongoing management fees.",
        bullets: [
            "Handoff + documentation",
            "Internal ownership",
            "Optional upgrades later"
        ]
    },
    {
        title: "Turn it into software.",
        body: "If the problem is big enough, we can productize it as SaaS for your industry, and build it as partners.",
        bullets: [
            "SaaS product build",
            "Industry rollout",
            "Partnership structure"
        ]
    }
];

const DevSolutionsSection = () => {
    return (
        <div className="space-y-0">
            {/* ── SECTION A — Common Problems We Fix ── */}
            <div className="space-y-8">
                {/* Section Header - Eyebrow */}
                <div className="flex items-center gap-6 py-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                        What We Fix
                    </span>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                </div>

                {/* High-Impact Section Title */}
                <div className="flex flex-col items-center text-center">
                    <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                        Operational Gaps.
                    </span>
                    <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                        COMMON PROBLEMS WE FIX.
                    </span>
                </div>

                {/* 4-Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PROBLEMS.map((problem, idx) => (
                        <div
                            key={idx}
                            className="relative bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-flo-orange/30 transition-all duration-500 overflow-hidden group"
                        >
                            <h4 className="text-lg font-bold text-white mb-2 relative z-10">
                                {problem.title}
                            </h4>
                            <p className="text-sm text-neutral-400 leading-relaxed relative z-10">
                                {problem.line}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Connector Lines (desktop only) ── */}
            <div className="hidden lg:block relative w-full" style={{ height: '80px' }}>
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1000 80"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 4 vertical drop lines from each card center */}
                    {/* Card positions at 12.5%, 37.5%, 62.5%, 87.5% of width */}
                    <line x1="125" y1="0" x2="125" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="375" y1="0" x2="375" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="625" y1="0" x2="625" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="875" y1="0" x2="875" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                    {/* Horizontal collector line */}
                    <line x1="125" y1="50" x2="875" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                    {/* Single centered vertical drop from collector */}
                    <line x1="500" y1="50" x2="500" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </svg>
            </div>

            {/* Connector for tablet (2-col) */}
            <div className="hidden sm:block lg:hidden relative w-full" style={{ height: '60px' }}>
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1000 60"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 2 vertical lines from center of each column */}
                    <line x1="250" y1="0" x2="250" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="750" y1="0" x2="750" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                    {/* Horizontal collector */}
                    <line x1="250" y1="35" x2="750" y2="35" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                    {/* Single centered drop */}
                    <line x1="500" y1="35" x2="500" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </svg>
            </div>

            {/* ── Connector into "How we solve it" container (desktop) ── */}
            <div className="hidden lg:flex justify-center" style={{ height: '32px' }}>
                <div className="w-px bg-white/15" />
            </div>
            {/* Connector into container (tablet) */}
            <div className="hidden sm:flex lg:hidden justify-center" style={{ height: '24px' }}>
                <div className="w-px bg-white/15" />
            </div>

            {/* ── "How we solve it" container ── */}
            <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-center bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]">


                <div className="relative z-10">
                    <h4 className="text-xl md:text-2xl font-bold text-flo-orange mb-4">
                        How we solve it.
                    </h4>
                    <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                        A hybrid team of web developers, AI automation builders, and strategists built to solve the real operational problems behind your growth, align your online presence with your business tone and goals, and keep you at the edge of technology.
                    </p>
                </div>
            </div>

            {/* ── Connector out of container into "What Happens Next" (desktop) ── */}
            <div className="hidden lg:flex justify-center" style={{ height: '32px' }}>
                <div className="w-px bg-white/15" />
            </div>
            {/* Connector out (tablet) */}
            <div className="hidden sm:flex lg:hidden justify-center" style={{ height: '24px' }}>
                <div className="w-px bg-white/15" />
            </div>

            {/* ── SECTION B — Two Paths Forward ── */}
            <div className="space-y-8">
                {/* High-Impact Section Title (no eyebrow divider) */}
                <div className="flex flex-col items-center text-center">
                    <span className="text-xl md:text-2xl pt-4 font-bold text-white leading-tight">
                        What Happens Next.
                    </span>
                    <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                        TWO PATHS FORWARD.
                    </span>
                </div>

                {/* Split Decision Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PATHS.map((path, idx) => (
                        <div
                            key={idx}
                            className="relative group overflow-hidden rounded-2xl p-8 border border-white/10 bg-[#111] hover:border-flo-orange/30 transition-all duration-500"
                        >
                            {/* Subtle Ambient Background Gradient */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${idx === 0 ? 'from-blue-500/20 via-transparent to-transparent' : 'from-flo-orange/20 via-transparent to-transparent'
                                }`} />

                            {/* Content Wrapper */}
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Option Label */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black text-flo-orange/80 uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-flo-orange/20 bg-flo-orange/5">
                                        Option {idx + 1}
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors duration-300">
                                    {path.title}
                                </h4>

                                {/* Body Text */}
                                <p className="text-sm text-neutral-400 leading-relaxed mb-8 border-l-2 border-white/10 pl-4">
                                    {path.body}
                                </p>

                                {/* Bullet List */}
                                <ul className="space-y-3 mt-auto">
                                    {path.bullets.map((bullet, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-neutral-300 group/item">
                                            <span className={`w-1.5 h-1.5 rounded-full ring-2 ring-white/10 group-hover/item:bg-flo-orange group-hover/item:ring-flo-orange/30 transition-all duration-300 bg-flo-orange/80 shadow-[0_0_8px_rgba(241,89,45,0.5)]`} />
                                            <span className="group-hover/item:text-white transition-colors duration-300">
                                                {bullet}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DevSolutionsSection;
