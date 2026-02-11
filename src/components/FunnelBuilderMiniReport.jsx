import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Layers, ArrowRight, X, User, Users } from 'lucide-react';

const FunnelBuilderMiniReport = ({ formData, onClose }) => {
    // Helper to determine readiness level based on inputs
    const getReadinessLevel = () => {
        const hasOffers = formData.offers && formData.offers[0]?.length > 0;
        const hasAudience = formData.audience && formData.audience.length > 0;
        const hasGoal = formData.desiredAction;

        if (hasOffers && hasAudience && hasGoal) {
            return {
                label: 'Ready to Build',
                color: 'text-green-400',
                bgColor: 'bg-green-400/10',
                borderColor: 'border-green-400/20',
                desc: 'You have the core clarity needed to launch a high-converting funnel.'
            };
        } else if (hasOffers || hasGoal) {
            return {
                label: 'Needs Refinement',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-400/10',
                borderColor: 'border-yellow-400/20',
                desc: 'We have a good starting point, but a few details need sharpening during the build.'
            };
        } else {
            return {
                label: 'Not Ready Yet',
                color: 'text-red-400',
                bgColor: 'bg-red-400/10',
                borderColor: 'border-red-400/20',
                desc: 'We likely need to clarify your offer before building infrastructure.'
            };
        }
    };

    const readiness = getReadinessLevel();

    // Key Frictions (Map from form data)
    const frictions = formData.frictions || [];
    const derivedFrictions = frictions.length > 0 ? frictions.slice(0, 3) : ['No specific friction identified'];

    // Teams Logic
    const teams = [
        {
            name: 'Studio Team',
            role: 'Creative & Content',
            focus: ['Visual assets', 'Ad creative', 'Landing page design'],
            icon: Users
        },
        {
            name: 'Marketing Team',
            role: 'Messaging & Targeting',
            focus: ['Offer articulation', 'Copywriting', 'Audience segmentation'],
            icon: Layers
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="flex flex-col h-full bg-[#0A0A0A] text-white overflow-hidden relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-flo-orange/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold text-white">Campaign Diagnostic</h2>
                        <p className="text-xs text-white/50 uppercase tracking-widest">Initial Assessment</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* 1. Readiness Header */}
                    <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Conversion Readiness</h3>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${readiness.bgColor} ${readiness.borderColor} ${readiness.color} text-sm font-bold uppercase tracking-wide mb-3`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{readiness.label}</span>
                                </div>
                                <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
                                    {readiness.desc}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 2. Campaign Snapshot */}
                        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-sm font-bold text-flo-orange uppercase tracking-widest">Campaign Snapshot</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Primary Offer</p>
                                    <p className="font-medium text-lg leading-tight">{formData.offers?.[0] || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Desired Action</p>
                                    <p className="font-medium text-lg text-white/90">{formData.desiredAction || 'Not specified'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Audience</p>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.audience?.slice(0, 2).map((a, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/5">{a}</span>
                                            ))}
                                            {formData.audience?.length > 2 && <span className="text-xs text-white/40">+{formData.audience.length - 2}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Platforms</p>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.platforms?.slice(0, 2).map((p, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/5">{p}</span>
                                            ))}
                                            {formData.platforms?.length > 2 && <span className="text-xs text-white/40">+{formData.platforms.length - 2}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. Key Frictions */}
                        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Observed Constraints</h3>
                            <ul className="space-y-3">
                                {derivedFrictions.map((friction, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400/80 shrink-0 mt-0.5" />
                                        <span className="text-neutral-300 text-sm leading-relaxed">{friction}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* 4. Funnel Opportunity */}
                    <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-gradient-to-br from-flo-orange/5 to-transparent border border-flo-orange/20 space-y-3">
                        <h3 className="text-sm font-bold text-flo-orange uppercase tracking-widest">The Opportunity</h3>
                        <p className="text-xl font-medium text-white leading-relaxed">
                            A focused funnel campaign here would specifically target <span className="text-flo-orange">{formData.audience?.[0] || 'your audience'}</span> to drive <span className="text-white border-b border-flo-orange/30">{formData.desiredAction?.toLowerCase() || 'action'}</span>, removing the friction of {derivedFrictions[0]?.toLowerCase() || 'current blockers'}.
                        </p>
                    </motion.div>

                    {/* 5. Teams Engaged */}
                    <motion.div variants={itemVariants} className="space-y-5">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-1">Teams Engaged For This Build</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teams.map((team, idx) => (
                                <div key={idx} className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
                                    <div className="p-3 bg-white/10 rounded-xl shrink-0">
                                        <team.icon className="w-6 h-6 text-flo-orange" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white mb-1">{team.name}</h4>
                                        <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-6">{team.role}</p>
                                        <ul className="space-y-2.5">
                                            {team.focus.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-flo-orange/50 mt-1.5 shrink-0" />
                                                    <span className="text-sm text-neutral-300 leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Footer Actions */}
            <motion.div
                className="p-6 border-t border-white/10 bg-[#0A0A0A] shrink-0 z-20"
                variants={itemVariants}
            >
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                    <p className="hidden md:block text-sm text-neutral-500">
                        Based on your inputs, we recommend proceeding.
                    </p>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            className="flex-1 md:flex-none px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors"
                            onClick={onClose}
                        >
                            Save for Later
                        </button>
                        <button className="flex-1 md:flex-none px-8 py-3.5 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40 transition-all flex items-center justify-center gap-2">
                            <span>Proceed with Funnel Builder</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FunnelBuilderMiniReport;
