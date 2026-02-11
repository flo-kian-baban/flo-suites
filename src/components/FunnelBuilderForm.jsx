import React, { useState } from 'react';
import { saveApplication } from '../lib/applications';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Zap } from 'lucide-react';
import OfferListInput from './form/OfferListInput';
import FunnelBuilderMiniReport from './FunnelBuilderMiniReport';
import {
    FloInput,
    FloTextarea,
    FloMultiSelect,
    FloSegmentedControl,
    FloSelectCard
} from './form/FloInputs';

// ============================================================================
// Step Data / Options
// ============================================================================

const DESIRED_ACTIONS = [
    { value: 'book-call', label: 'Book a call / appointment', description: 'Drive qualified meetings' },
    { value: 'capture-lead', label: 'Leave their contact info', description: 'Build your email/SMS list' },
    { value: 'buy-now', label: 'Buy something directly', description: 'Immediate revenue generation' },
    { value: 'learn-service', label: 'Learn about a service', description: 'Education-first approach' },
    { value: 'unsure', label: 'I’m not fully sure yet', description: 'We’ll help you define this' }
];

const AUDIENCE_OPTIONS = [
    { value: 'new-customers', label: 'New customers' },
    { value: 'existing-customers', label: 'Existing customers' },
    { value: 'followers', label: 'People already following us' },
    { value: 'cold-traffic', label: 'People who don’t know us yet' }
];

const FRICTION_OPTIONS = [
    { value: 'watch-no-action', label: 'People watch but don’t take action' },
    { value: 'attention-no-leads', label: 'We get attention, but not inquiries' },
    { value: 'low-quality', label: 'We get inquiries, but they’re low quality' },
    { value: 'hard-to-explain', label: 'Our offer feels hard to explain' },
    { value: 'unconvincing', label: 'Our content doesn’t feel convincing' },
    { value: 'no-page', label: 'We don’t really have a clear page for this' },
    { value: 'not-working', label: 'Not sure — it just doesn’t work' }
];

const PLATFORM_OPTIONS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'google', label: 'Google' },
    { value: 'email', label: 'Email' },
    { value: 'word-of-mouth', label: 'Word of mouth' },
    { value: 'not-sure', label: 'Not sure yet' }
];

const TIMELINE_OPTIONS = [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'next-month', label: 'Within the next month' },
    { value: 'flexible', label: 'I’m flexible' }
];

const READINESS_OPTIONS = [
    { value: 'yes-build', label: 'Yes, I want to get this built', description: 'Ready for execution' },
    { value: 'review-plan', label: 'I want to review the plan first', description: 'Need validation' },
    { value: 'exploring', label: 'I’m exploring options', description: 'Just looking' }
];

// ============================================================================
// Progress Bar
// ============================================================================
const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;
    return (
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-flo-orange"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
};

// ============================================================================
// Main Form Component
// ============================================================================
const FunnelBuilderForm = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const totalSteps = 8; // Increased from 7

    const [formData, setFormData] = useState({
        desiredAction: '',        // Step 1
        offers: [''],             // Step 2
        audience: [],             // Step 3
        audienceNotes: '',        // Step 3 (optional)
        frictions: [],            // Step 4
        platforms: [],            // Step 5
        timeline: '',             // Step 6
        readiness: '',            // Step 6
        finalNotes: '',           // Step 7
        // Step 8: Contact Info
        name: '',
        businessName: '',
        email: '',
        phone: '',
        website: ''
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            onClose();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await saveApplication('funnel-builder', formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to submit application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation Variants
    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // Render Report if Submitted
    if (isSubmitted) {
        return <FunnelBuilderMiniReport formData={formData} onClose={onClose} />;
    }

    // Step Rendering Logic
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">What do you want people to do?</h2>
                            <p className="text-white/50">Define the core outcome without marketing jargon.</p>
                        </div>
                        <FloSelectCard
                            value={formData.desiredAction}
                            onChange={(v) => updateFormData('desiredAction', v)}
                            options={DESIRED_ACTIONS}
                            required
                        />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">What are you promoting?</h2>
                            <p className="text-white/50">Add up to 10 offers. Put the most important one first.</p>
                        </div>
                        <OfferListInput
                            values={formData.offers}
                            onChange={(v) => updateFormData('offers', v)}
                            maxOffers={10}
                        />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Who is this for?</h2>
                            <p className="text-white/50">Audience clarity without complexity.</p>
                        </div>
                        <FloMultiSelect
                            label="Target Audience"
                            values={formData.audience}
                            onChange={(v) => updateFormData('audience', v)}
                            options={AUDIENCE_OPTIONS}
                        />
                        <FloTextarea
                            label="Anything specific about them?"
                            value={formData.audienceNotes}
                            onChange={(v) => updateFormData('audienceNotes', v)}
                            placeholder="e.g. They are busy professionals..."
                            rows={3}
                            helperText="Optional"
                        />
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">What feels frustrating?</h2>
                            <p className="text-white/50">Identify conversion friction.</p>
                        </div>
                        <FloMultiSelect
                            values={formData.frictions}
                            onChange={(v) => updateFormData('frictions', v)}
                            options={FRICTION_OPTIONS}
                        />
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div key="step5" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Where do usually people find you?</h2>
                            <p className="text-white/50">Distribution channels.</p>
                        </div>
                        <FloMultiSelect
                            values={formData.platforms}
                            onChange={(v) => updateFormData('platforms', v)}
                            options={PLATFORM_OPTIONS}
                        />
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div key="step6" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Timing & Readiness</h2>
                            <p className="text-white/50">When do we launch?</p>
                        </div>
                        <FloSegmentedControl
                            label="How soon do you want this set up?"
                            value={formData.timeline}
                            onChange={(v) => updateFormData('timeline', v)}
                            options={TIMELINE_OPTIONS}
                        />
                        <FloSelectCard
                            label="If this makes sense, are you ready to move forward?"
                            value={formData.readiness}
                            onChange={(v) => updateFormData('readiness', v)}
                            options={READINESS_OPTIONS}
                            columns={1}
                        />
                    </motion.div>
                );
            case 7:
                return (
                    <motion.div key="step7" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Final Notes</h2>
                            <p className="text-white/50">Anything else we should know?</p>
                        </div>
                        <FloTextarea
                            value={formData.finalNotes}
                            onChange={(v) => updateFormData('finalNotes', v)}
                            placeholder="Share any other context or goals..."
                            rows={5}
                            helperText="Optional"
                        />
                    </motion.div>
                );
            case 8:
                return (
                    <motion.div key="step8" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Final Details</h2>
                            <p className="text-white/50">Where should we send your report?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloInput
                                label="Name"
                                value={formData.name}
                                onChange={(v) => updateFormData('name', v)}
                                placeholder="Full name"
                                required
                            />
                            <FloInput
                                label="Business Name"
                                value={formData.businessName}
                                onChange={(v) => updateFormData('businessName', v)}
                                placeholder="Company name"
                                required
                            />
                        </div>

                        <FloInput
                            label="Email"
                            value={formData.email}
                            onChange={(v) => updateFormData('email', v)}
                            placeholder="you@company.com"
                            type="email"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloInput
                                label="Phone"
                                value={formData.phone}
                                onChange={(v) => updateFormData('phone', v)}
                                placeholder="+1 (555) 000-0000"
                                helperText="Optional"
                            />
                            <FloInput
                                label="Website"
                                value={formData.website}
                                onChange={(v) => updateFormData('website', v)}
                                placeholder="yoursite.com"
                                helperText="Optional"
                            />
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0 bg-[#0A0A0A]/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-flo-orange/10 rounded-lg">
                        <Zap className="w-4 h-4 text-flo-orange" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Funnel Builder</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-white/40">Step {currentStep} of {totalSteps}</span>
                        </div>
                    </div>
                </div>
                <div className="w-32 hidden md:block">
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#0A0A0A]/80 backdrop-blur-lg shrink-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        className="px-6 py-3 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue with Funnel Builder</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunnelBuilderForm;
