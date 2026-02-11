import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import FloOSApplicationForm from './FloOSApplicationForm';
import FunnelBuilderForm from './FunnelBuilderForm';
import AboutFloChat from './AboutFloChat';
import ScrollTimeline from './suite-expanded/ScrollTimeline';
import EngagementInvestment from './suite-expanded/EngagementInvestment';

const ExpandedContent = ({ suite, onClose }) => {
    console.log('ExpandedContent suite:', suite.id, suite.title);
    const [showApplication, setShowApplication] = useState(false);

    // Determines which form to show based on suite ID
    const renderApplicationForm = () => {
        if (suite.id === 'flo-os') {
            return (
                <FloOSApplicationForm
                    onClose={onClose}
                    onBack={() => setShowApplication(false)}
                />
            );
        }
        if (suite.id === 'Funnel Builder') {
            return (
                <FunnelBuilderForm
                    onClose={onClose}
                    onBack={() => setShowApplication(false)}
                />
            );
        }

        return null;
    };

    const handlePrimaryAction = () => {
        if (suite.primaryCTA.action === 'apply') {
            setShowApplication(true);
        } else {
            // Handle other actions or default behavior
            console.log('Action:', suite.primaryCTA.action);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-8 z-50 flex items-center justify-center pointer-events-none"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="relative w-full max-w-4xl h-full max-h-[85vh] glass-effect rounded-2xl overflow-hidden pointer-events-auto flex flex-col shadow-2xl border border-white/10 bg-[#0a0a0a]"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)'
                }}
            >
                {/* Close Button */}
                <div className="absolute top-6 right-6 z-20">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 smooth-transition group bg-black/20 backdrop-blur-md"
                    >
                        <X className="w-6 h-6 text-neutral-400 group-hover:text-flo-orange smooth-transition" />
                    </button>
                </div>

                {(suite.id === 'about-flo' || suite.id === 'consultation') ? (
                    <AboutFloChat onClose={onClose} />
                ) : showApplication ? (
                    // Render Application Form Swapped In
                    <div className="flex-1 h-full overflow-hidden">
                        {renderApplicationForm()}
                    </div>
                ) : (
                    // Render Standard Expanded Content
                    <div className="flex flex-col h-full p-8 md:p-12 overflow-hidden">
                        {/* Header */}
                        <div className="mb-8 pb-8 border-b border-white/10 pr-12">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                {suite.title}
                            </h2>
                            <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                                {suite.tagline}
                            </p>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                            {/* Expanded Content Data */}
                            {suite.expandedContent && (
                                <>
                                    {/* What it is */}
                                    <div className="mb-20">
                                        {/* Section Header - Eyebrow */}
                                        <div className="flex items-center gap-6 py-4">
                                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                                                What It Is
                                            </span>
                                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                        </div>

                                        {/* High-Impact Section Title */}
                                        <div className="flex flex-col items-center text-center mt-2 mb-10">
                                            <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                                                Value Proposition.
                                            </span>
                                            <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                                THE OFFERING.
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {suite.expandedContent.whatItIs.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-flo-orange mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(255,107,53,0.6)]" />
                                                    <span className="text-neutral-300 leading-relaxed">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* System / Process */}
                                    {suite.expandedContent.system && (
                                        <div className="mb-20">
                                            {/* Section Header - Eyebrow */}
                                            <div className="flex items-center gap-6 py-4">
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                                                    The System
                                                </span>
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                                            </div>

                                            {/* High-Impact Section Title */}
                                            <div className="flex flex-col items-center text-center mt-2 mb-10">
                                                <span className="text-xl md:text-2xl font-bold text-white leading-tight">
                                                    Operational Architecture.
                                                </span>
                                                <span className="text-3xl md:text-6xl font-black text-flo-orange uppercase tracking-tight mt-1 leading-[0.9]">
                                                    THE INFRASTRUCTURE.
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                {suite.expandedContent.system.map((step, idx) => (
                                                    <div key={idx} className="relative group/card overflow-hidden p-6 md:p-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-500">
                                                        {/* Background Step Number - Right Top */}
                                                        <span className="absolute top-2 right-6 text-7xl md:text-9xl font-black text-white/[0.03] leading-none pointer-events-none transition-all duration-500 group-hover/card:text-white/[0.07] group-hover/card:scale-110">
                                                            {idx + 1}
                                                        </span>

                                                        <div className="relative z-10">
                                                            <div className="mb-4">
                                                                <h4 className="text-xl md:text-2xl font-black text-flo-orange uppercase leading-none">
                                                                    {step.title}.
                                                                </h4>
                                                                {step.timeframe && (
                                                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2">
                                                                        {step.timeframe}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-white/90 font-bold text-lg leading-tight">{step.desc}</p>
                                                                <p className="text-neutral-400 text-sm leading-relaxed max-w-[85%]">{step.detail}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Scroll-Activated Process Timeline */}
                                    {suite.expandedContent.timeline && (
                                        <div className="mb-12">
                                            <ScrollTimeline steps={suite.expandedContent.timeline} />
                                        </div>
                                    )}

                                    {/* Engagement Investment & Results */}
                                    {(suite.expandedContent.investment || suite.expandedContent.valueDelivered) && (
                                        <div className="mb-12">
                                            <EngagementInvestment
                                                investment={suite.expandedContent.investment}
                                                outcomes={suite.expandedContent.valueDelivered?.items}
                                            />
                                        </div>
                                    )}

                                    {/* Service Action CTA */}
                                    <div className="relative overflow-hidden rounded-2xl p-1 shadow-xl mb-12">
                                        <div className="absolute inset-0 bg-gradient-to-br from-flo-orange/30 via-flo-orange/5 to-transparent opacity-40" />
                                        <div className="relative bg-white/5 rounded-2xl p-8 flex flex-col items-center text-center space-y-6 border border-white/10">
                                            <div className="space-y-3">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                                    Ready to Get Started?
                                                </h3>
                                                <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
                                                    If you're ready to deploy this system, take the first step and let's coordinate the implementation.
                                                </p>
                                            </div>

                                            <button
                                                onClick={handlePrimaryAction}
                                                className="group flex items-center gap-2 px-8 py-4 bg-flo-orange hover:bg-flo-orange-light rounded-xl font-bold text-white smooth-transition shadow-lg shadow-flo-orange/20"
                                            >
                                                <span>{suite.primaryCTA.label}</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                                                <Sparkles className="w-3 h-3" />
                                                <span>Application takes less than 2 minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* CTA Row */}
                        <div className="flex gap-4 mt-8 pt-8 border-t border-white/10 shrink-0">
                            <button
                                onClick={handlePrimaryAction}
                                className="flex-1 px-8 py-4 bg-flo-orange hover:bg-flo-orange-light rounded-xl font-bold text-white smooth-transition shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40 transform hover:-translate-y-0.5"
                            >
                                {suite.primaryCTA.label}
                            </button>
                            <button className="px-8 py-4 glass-effect-light hover:bg-white/10 rounded-xl font-semibold text-white smooth-transition border border-white/10 hover:border-white/20">
                                {suite.secondaryCTA.label}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ExpandedContent;
