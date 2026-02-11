import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Layers, Cpu, Palette, TrendingUp, Brain, Info, Sparkles, Plus, Minus } from 'lucide-react';
import FloOSApplicationForm from './FloOSApplicationForm';
import SuiteExpandedLayout from './suite-expanded/SuiteExpandedLayout';
import { suites } from '../data/suites';
import { useSiteContent } from '../hooks/useSiteContent';

// Map suite IDs to icons for the "Powered By" section
const SUITE_ICONS = {
    'studio': Palette,
    'marketing': TrendingUp,
    'dev': Cpu,
    'about-flo': Brain,
    'consultation': Brain,
    'media-marketing': Layers
};

const SuiteAccordionItem = ({ title, subtitle, children, isStandard = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen
            ? 'bg-white/[0.03] border-white/10'
            : 'bg-transparent border-white/5 hover:bg-white/[0.02] hover:border-white/10'
            } ${isStandard ? 'mt-4 border-flo-orange/20 bg-flo-orange/[0.02]' : ''}`}>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left group"
            >
                <div className="flex flex-col gap-1 pr-4">
                    <h4 className={`text-xl font-bold ${isStandard ? 'text-flo-orange' : 'text-white group-hover:text-flo-orange'} transition-colors`}>
                        {title}
                    </h4>
                    <p className="text-sm text-neutral-400 font-medium">
                        {subtitle}
                    </p>
                </div>
                <div className={`p-2 rounded-full border shrink-0 transition-all duration-300 ${isOpen
                    ? 'bg-white/10 border-white/20 rotate-45'
                    : 'bg-transparent border-white/10 group-hover:border-white/20'
                    }`}>
                    <Plus className={`w-5 h-5 ${isStandard ? 'text-flo-orange' : 'text-white'}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                    >
                        <div className="px-6 pb-6 pt-0">
                            <div className="pt-6 border-t border-white/5 text-neutral-300 text-sm leading-relaxed space-y-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TimelineStep = ({ step, index }) => {
    const isLeft = index % 2 === 0;

    return (
        <div className={`relative flex items-center justify-between md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} mb-12 last:mb-0 group`}>
            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px -10% 0px", once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-[44%] pl-12 md:pl-0"
            >
                <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-500 backdrop-blur-sm overflow-hidden group/card">
                    {/* Background Step Number - Right Top */}
                    <span className="absolute top-0 right-2 text-7xl md:text-9xl font-black text-white/[0.03] leading-none pointer-events-none transition-all duration-500 group-hover/card:text-white/[0.07] group-hover/card:scale-110">
                        {index + 1}
                    </span>

                    <div className="flex flex-col gap-0 relative z-10">
                        <div className={`flex flex-col items-start`}>
                            <span className="text-3xl md:text-5xl font-black text-flo-orange uppercase tracking-tight mt-0 leading-[0.9]">
                                {step.title}
                            </span>
                            {step.timeframe && (
                                <span className="text-[14px] font-bold text-flo-orange/40 uppercase tracking-[0.2em] mt-3">
                                    {step.timeframe}
                                </span>
                            )}
                        </div>
                        <p className="text-neutral-300 text-sm leading-relaxed max-w-[80%] mt-3">
                            {step.description}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block w-[45%]" />

            {/* Bullet - Absolute Center - STATIC ORANGE */}
            <div className="absolute left-[19px] md:left-1/2 top-1/2 -translate-y-1/2 w-4 h-4 -translate-x-1/2 z-10">
                <div className="absolute inset-0 rounded-full bg-flo-orange shadow-[0_0_12px_rgba(241,89,45,1)] border-2 border-[#0A0A0A]" />
            </div>
        </div>
    );
};

const TimelineSection = ({ timeline }) => {
    return (
        <div className="relative w-full max-w-5xl mx-auto py-12 md:py-24">
            {/* Line - STATIC ORANGE */}
            <div className="absolute left-[19px] md:left-1/2 top-12 bottom-12 w-[2px] bg-white/5 md:-translate-x-1/2">
                <div className="w-full h-full bg-flo-orange shadow-[0_0_15px_rgba(241,89,45,0.6)]" />
            </div>

            <div className="flex flex-col gap-8">
                {timeline.map((step, idx) => (
                    <TimelineStep key={idx} step={step} index={idx} />
                ))}
            </div>
        </div>
    );
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
                    {content.suites?.[suite.id]?.walkthroughVideo && (
                        <motion.div variants={itemVariants} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r mx-auto w-2/3 from-flo-orange/20 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative aspect-video w-2/3 mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                                <video
                                    className="w-full h-full object-cover"
                                    src={content.suites[suite.id].walkthroughVideo}
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

                        <div className="flex flex-col gap-4">
                            {/* Suite Containers */}
                            {(expandedContent.poweredBy || []).map((suiteId) => {
                                const suiteData = suites.find(s => s.id === suiteId);
                                if (!suiteData) return null;

                                return (
                                    <SuiteAccordionItem
                                        key={suiteId}
                                        title={suiteData.title}
                                        subtitle={`Contributes: ${suiteData.tagline}`}
                                    >
                                        <p className="mb-4 text-neutral-300">
                                            {suiteData.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(suiteData.deliverables || []).slice(0, 4).map((item, idx) => (
                                                <span key={idx} className="px-2 py-1 rounded bg-white/5 text-xs font-medium text-neutral-400 border border-white/5">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </SuiteAccordionItem>
                                );
                            })}

                            <SuiteAccordionItem
                                title="Flo Standard"
                                subtitle="Where the real power is unlocked."
                                isStandard={true}
                            >
                                <p className="font-medium text-white/90 mb-2">
                                    The Value of Usage Compounding
                                </p>
                                <p>
                                    Isolated efforts create friction. By bundling these suites together through Flo Standard, we align strategy, content, and technology into a single efficient workflow.
                                </p>
                                <p>
                                    This alignment creates leverage—where every piece of content, every funnel, and every ad dollar works together to multiply your results for long-term impact.
                                </p>
                            </SuiteAccordionItem>
                        </div>
                    </motion.div>

                    {/* 5. Process Timeline */}
                    {expandedContent.timeline && (
                        <motion.div variants={itemVariants} className="w-full space-y-0">
                            {/* Section Header - Eyebrow */}
                            <div className="flex items-center gap-6 py-12">
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                <span className="text-[12px] font uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                                    The Process
                                </span>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                            </div>

                            {/* High-Impact Section Title */}
                            <div className="flex flex-col items-center text-center mt-2 pb-10">
                                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                                    Strategic Rollout.
                                </span>
                                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                    THE TIMELINE.
                                </span>
                            </div>
                            <TimelineSection timeline={expandedContent.timeline} />
                        </motion.div>
                    )}

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
