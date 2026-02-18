import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Layers, Cpu, Palette, TrendingUp, Brain, Sparkles } from 'lucide-react';
import FloOSApplicationForm from './FloOSApplicationForm';
import SuiteExpandedLayout from './suite-expanded/SuiteExpandedLayout';
import TimelineSection from './suite-expanded/TimelineSection';
import { suites } from '../data/suites';
import { useSiteContent } from '../hooks/useSiteContent';
import VideoWithPlaceholder from './VideoWithPlaceholder';

// Map suite IDs to icons for the "Powered By" section
const SUITE_ICONS = {
    'studio': Palette,
    'marketing': TrendingUp,
    'dev': Cpu,
    'about-flo': Brain,
    'consultation': Brain,
    'media-marketing': Layers
};





const OfferExpandedView = ({ suite, onClose }) => {
    const { expandedContent, teamPage } = suite;
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const { content } = useSiteContent();
    const systemSectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const scrollToSystem = () => {
        if (systemSectionRef.current) {
            systemSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const isFloOS = suite.id === 'flo-os';
    const isFunnelBuilder = suite.id === 'Funnel Builder';
    const isMediaMarketing = suite.id === 'media-marketing';

    // Check if this is a team suite page (Studio, Marketing, Dev)
    if (teamPage) {
        return <SuiteExpandedLayout suite={suite} onClose={onClose} />;
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.2, 0, 0, 1] }
        }
    };

    // Application Form View (unified for all offer tiles)
    if ((isFloOS || isFunnelBuilder || isMediaMarketing) && showApplicationForm) {
        return (
            <motion.div
                className="absolute inset-0 flex flex-col bg-[#0A0A0A] text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-flo-orange/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

                <FloOSApplicationForm
                    onClose={onClose}
                    onBack={() => setShowApplicationForm(false)}
                    source={suite.id}
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            className="absolute inset-0 flex flex-col bg-[#0A0A0A] text-white overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            {/* Background Ambience */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-flo-orange/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2`} />

            {/* Header / Nav */}
            <div className="flex items-center justify-between px-8 py-6 z-30 shrink-0 bg-black/40 backdrop-blur-3xl border-b border-white/20 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white/90">{suite.title}</h2>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-widest">{suite.tagline}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content - Scrollable */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-40 z-10">
                <div className="max-w-7xl mx-auto space-y-20 pt-12">
                    {/* 1. Hero / Outcome */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-colors hover:border-flo-orange/30 group">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-flo-orange/10 border border-flo-orange/20">
                                <CheckCircle2 className="w-3 h-3 text-flo-orange" />
                            </div>
                            <span className="text-[11px] font-black text-white/90 uppercase tracking-[0.25em]">The Outcome</span>
                        </div>

                        <div className="flex flex-col gap-8 md:gap-8">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                                {expandedContent.outcome}
                            </h1>

                            <div className="flex gap-6 pl-2 items-stretch">
                                {/* Vertical Accent Line */}
                                <div className="w-[2px] bg-gradient-to-b from-flo-orange via-flo-orange/50 to-transparent shrink-0 rounded-full" />

                                <div className="space-y-4">
                                    {expandedContent.subtitle && (
                                        <p className="text-sm md:text-3xl font-black text-flo-orange uppercase tracking-wider leading-none mb-2">
                                            {expandedContent.subtitle}
                                        </p>
                                    )}
                                    <p className="text-xl md:text-xl text-white/80 font-medium max-w-4xl leading-snug tracking-tight">
                                        {expandedContent.outcomeDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Video Walkthrough - Only show if video exists for this offer */}
                    {content.suites?.[suite.id]?.headerVideo && (
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r mx-auto w-2/3 from-flo-orange/20 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative aspect-video w-2/3 mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                                <VideoWithPlaceholder
                                    src={content.suites[suite.id].headerVideo}
                                    containerClassName="w-full h-full"
                                    className="w-full h-full object-cover"
                                    controls
                                    playsInline
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* 3. The System / How it Works */}
                    <motion.div ref={systemSectionRef} variants={itemVariants} className="space-y-0">
                        {/* Section Header - Eyebrow */}
                        <div className="flex items-center gap-6 py-12">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                                How The System Works
                            </span>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                        </div>

                        {/* High-Impact Section Title */}
                        <div className="flex flex-col items-center text-center mt-2 pb-14">
                            <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                                Unified Ecosystem.
                            </span>
                            <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                THE ARCHITECTURE.
                            </span>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${(expandedContent.poweredBy || []).length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                            {/* Suite Containers */}
                            {(expandedContent.poweredBy || []).map((item) => {
                                const suiteId = typeof item === 'string' ? item : item.id;
                                const originalSuite = suites.find(s => s.id === suiteId);
                                if (!originalSuite) return null;

                                const suiteData = typeof item === 'string' ? originalSuite : { ...originalSuite, ...item };

                                return (
                                    <div
                                        key={suiteId}
                                        className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group/suite overflow-hidden flex flex-col justify-center min-h-[280px]"
                                    >


                                        <div className="flex flex-col justify-center h-full">
                                            <div className="flex items-center gap-3 mb-4">
                                                <h4 className="text-3xl font-bold text-flo-orange group-hover/suite:text-flo-orange transition-colors">
                                                    {suiteData.title}
                                                </h4>
                                                <span className="text-3xl font-black tracking-widest text-transparent font-outline-2" style={{ WebkitTextStroke: '1px #FFFFFF' }}>
                                                    SUITE
                                                </span>
                                            </div>
                                            <p className="text-lg uppercase text-white">
                                                {suiteData.tagline}
                                            </p>
                                            <p className="text-neutral-600 mt-1 leading-relaxed pt-1 group-hover/suite:text-white transition-colors duration-300">
                                                {suiteData.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Flo OS Extra Row */}
                            {isFloOS && (
                                <>
                                    {/* EZReview */}
                                    <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group/extra overflow-hidden flex flex-col justify-center min-h-[280px]">
                                        <div className="flex flex-col justify-center h-full">
                                            <div className="flex items-center gap-2 mb-4 w-full">
                                                <h4 className="text-3xl font-bold text-flo-orange group-hover/extra:text-flo-orange transition-colors">
                                                    EZ
                                                </h4>
                                                <span className="text-3xl font-black text-transparent font-outline-2" style={{ WebkitTextStroke: '1px #FFFFFF' }}>
                                                    Review
                                                </span>
                                            </div>
                                            <p className="text-lg uppercase text-white">
                                                REPUTATION MANAGEMENT
                                            </p>
                                            <p className="text-neutral-600 mt-1 leading-relaxed pt-1 group-hover/extra:text-white transition-colors duration-300">
                                                Automated reputation management system that captures 5-star Google reviews on autopilot. Build trust and rank higher without lifting a finger.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connex - Logo Only */}
                                    <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group/extra overflow-hidden flex items-center justify-center min-h-[280px]">
                                        <img
                                            src="/assets/Connex2.png"
                                            alt="Connex"
                                            className="h-20 md:h-24 w-auto opacity-95 group-hover/extra:opacity-100"
                                        />
                                    </div>

                                    {/* AI Automation */}
                                    <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group/extra overflow-hidden flex flex-col justify-center min-h-[280px]">
                                        <div className="flex flex-col justify-center h-full">
                                            <div className="flex items-center gap-2 mb-4 w-full">
                                                <h4 className="text-3xl font-bold text-flo-orange group-hover/extra:text-flo-orange transition-colors">
                                                    AI
                                                </h4>
                                                <span className="text-3xl font-black text-transparent font-outline-2" style={{ WebkitTextStroke: '1px #FFFFFF' }}>
                                                    Automation
                                                </span>
                                            </div>
                                            <p className="text-lg uppercase text-white">
                                                BUSINESS AUTOMATION
                                            </p>
                                            <p className="text-neutral-600 mt-1 leading-relaxed pt-1 group-hover/extra:text-white transition-colors duration-300">
                                                Custom operational workflows that eliminate manual tasks. We build intelligent agents and integrations to streamline your entire business backend.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <TimelineSection
                        timeline={expandedContent.timeline}
                        title={expandedContent.timelineConfig?.title}
                        subtitle={expandedContent.timelineConfig?.subtitle}
                    />

                    {/* 4. Action CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-[2.5rem] p-1 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-flo-orange/40 via-flo-orange/10 to-transparent opacity-50" />
                        <div className="relative bg-[#0d0d0d] rounded-[2.4rem] p-10 md:p-14 flex flex-col items-center text-center space-y-10 border border-white/10">
                            <div className="space-y-4 max-w-2xl">
                                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight whitespace-nowrap">
                                    Ready to {isFloOS ? 'Initialize Flo OS' : isFunnelBuilder ? 'Build Your Machine' : isMediaMarketing ? 'Scale Your Momentum' : suite.primaryCTA.label}?
                                </h3>
                                <p className="text-lg text-neutral-400 font-medium leading-relaxed">
                                    Skip the deliverables list. If you're here, you're ready for {isFloOS ? 'total operational synchronization' : 'unignorable market presence'}. Take the first step.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                <button
                                    onClick={() => (isFloOS || isFunnelBuilder || isMediaMarketing) && setShowApplicationForm(true)}
                                    className="group relative h-14 px-6 bg-flo-orange rounded-xl font-bold text-white shadow-[0_8px_30px_-6px_rgba(241,89,45,0.45)] hover:shadow-[0_12px_40px_-6px_rgba(241,89,45,0.55)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2.5">
                                        {isFloOS ? 'Begin Initialization' : isFunnelBuilder ? 'Build My System' : isMediaMarketing ? 'Start Growth Engine' : suite.primaryCTA.label}
                                        <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
                                </button>
                                <button
                                    onClick={scrollToSystem}
                                    className="group h-14 px-6 rounded-xl font-bold text-white/80 hover:text-white bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    {isFloOS ? 'Explore The System' : isFunnelBuilder ? 'See The Process' : 'See How It Works'}
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/25 uppercase tracking-[0.25em]">
                                <Sparkles className="w-3 h-3" />
                                <span>Takes less than 2 minutes</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 6. Investment & Outcome */}
                    {expandedContent.investment && expandedContent.valueDelivered && (
                        <motion.div variants={itemVariants} className="w-full space-y-0">
                            {/* Section Header - Eyebrow */}
                            <div className="flex items-center gap-6 py-10">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                <span className="text-[12px] font uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                                    Your Investment
                                </span>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                            </div>

                            {/* High-Impact Section Title */}
                            <div className="flex flex-col items-center text-center mt-2 pb-12">
                                <span className="text-xl md:text-2xl font text-white leading-tight">
                                    Performance Investment.
                                </span>
                                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                    STAKE & RESULT.
                                </span>
                            </div>

                            <div className="grid grid-cols-1 pb-12 md:grid-cols-3 gap-8 relative">
                                {/* Left Column: Investment Summary (Premium 10x) */}
                                <div className="md:col-span-1 relative group/invest">
                                    <div className="absolute inset-0 bg-gradient-to-br from-flo-orange/10 to-transparent opacity-0 group-hover/invest:opacity-100 transition-opacity duration-700 rounded-3xl" />
                                    <div className="relative h-full bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-500 overflow-hidden">
                                        {/* Subtle internal pulse */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-flo-orange/[0.03] rounded-full blur-3xl animate-pulse" />

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-flo-orange/80 mb-3 ml-1">
                                                {expandedContent.investment.label}
                                            </p>
                                            <h4 className="text-5xl font-black text-white leading-none mb-6 stroke-4 stroke-red">
                                                {expandedContent.investment.title}
                                            </h4>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="h-px w-full bg-gradient-to-r from-flo-orange/90 via-flo-orange/40 to-transparent" />
                                            <div className="space-y-4">
                                                <p className="text-5xl font-black text-white tracking-tight leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                                    {expandedContent.investment.price}
                                                    <span className="text-3xl font-medium text-flo-orange tracking-normal">
                                                        /month
                                                    </span>
                                                </p>
                                                {expandedContent.investment.description && (
                                                    <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2 px-1">
                                                        {expandedContent.investment.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Result Cards (Premium Stack) */}
                                <div className="md:col-span-2 flex flex-col justify-around">
                                    {expandedContent.valueDelivered.items.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group/item overflow-hidden"
                                        >
                                            {/* Dimmed Index */}
                                            <span className="absolute top-4 right-6 text-[10px] font-black text-white/5 uppercase tracking-widest group-hover/item:text-white/10 transition-colors">
                                                Outcome 0{i + 1}
                                            </span>

                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-flo-orange opacity-40 group-hover/item:opacity-100 transition-all duration-300 group-hover/item:scale-125 shadow-[0_0_8px_rgba(241,89,45,0.4)]" />
                                                </div>
                                                <span className="text-neutral-400 text-lg font-medium tracking-tight group-hover/item:text-white transition-all duration-300 leading-tight">
                                                    {item}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20 bg-black/50 backdrop-blur-3xl z-30 shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                    <p className="hidden md:block text-sm text-neutral-500 font-medium">
                        Ready to deploy this system?
                    </p>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={scrollToSystem}
                            className="flex-1 md:flex-none h-11 px-6 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 rounded-xl font-semibold text-sm text-white/80 hover:text-white transition-all duration-300"
                        >
                            {isFloOS ? 'Explore The System' : isFunnelBuilder ? 'See The Process' : 'See How It Works'}
                        </button>
                        <button
                            onClick={() => (isFloOS || isFunnelBuilder || isMediaMarketing) && setShowApplicationForm(true)}
                            className="flex-1 md:flex-none h-11 px-6 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_-4px_rgba(241,89,45,0.4)] hover:shadow-[0_6px_24px_-4px_rgba(241,89,45,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>
                                {isFloOS ? 'Apply for Flo OS' :
                                    isFunnelBuilder ? 'Build It' :
                                        suite.primaryCTA.label}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OfferExpandedView;
