import React, { useState } from 'react';
import { saveApplication } from '../lib/applications';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import {
    FloInput,
    FloTextarea,
    FloMultiSelect,
    FloSegmentedControl,
} from './form/FloInputs';

// ============================================================================
// Constants & Options
// ============================================================================

const STEP_1_OPTIONS = [
    { value: 'awareness', label: 'To get more awareness' },
    { value: 'customers', label: 'To attract new customers' },
    { value: 'visible', label: 'To stay active and visible' },
    { value: 'support-offer', label: 'To support an offer or service' },
    { value: 'competitors', label: 'Because competitors are doing it' },
    { value: 'unsure', label: 'Not fully sure yet' }
];

const STEP_2_OPTIONS = [
    { value: 'inquiries', label: 'Bring in inquiries' },
    { value: 'educate', label: 'Educate my audience' },
    { value: 'trust', label: 'Build trust and credibility' },
    { value: 'top-of-mind', label: 'Stay top of mind' },
    { value: 'explain', label: 'Explain what we do better' }
];

const STEP_3_OPTIONS = [
    { value: 'new-people', label: 'New people who don’t know us' },
    { value: 'following', label: 'People already following us' },
    { value: 'customers', label: 'Existing customers' },
    { value: 'specific', label: 'A very specific group' }
];

const STEP_4_OPTIONS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'google', label: 'Google' },
    { value: 'not-sure', label: 'Not sure yet' }
];

const STEP_5_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'few-times', label: 'A few times a week' },
    { value: 'daily', label: 'Daily' },
    { value: 'not-sure', label: 'Not sure yet' }
];

const STEP_6_OPTIONS = [
    { value: 'what-to-post', label: 'Don’t know what to post' },
    { value: 'consistency', label: 'Hard to stay consistent' },
    { value: 'engagement', label: 'Content doesn’t get engagement' },
    { value: 'results', label: 'Content doesn’t bring results' },
    { value: 'direction', label: 'No clear direction' },
    { value: 'not-started', label: 'We haven’t really started yet' }
];

// ============================================================================
// Helper Components
// ============================================================================

const StepHeader = ({ stepNumber, title, subtitle }) => (
    <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-flo-orange uppercase tracking-widest">
                Step {stepNumber}
            </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {subtitle && (
            <p className="text-white/50 text-sm">{subtitle}</p>
        )}
    </div>
);

const SuccessScreen = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center h-full max-w-lg mx-auto py-12"
    >
        <div className="w-20 h-20 rounded-full bg-flo-orange/20 flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-flo-orange" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Application Submitted</h2>
        <p className="text-lg text-white/60 mb-8 leading-relaxed">
            We’ve received your Media Marketing application. Our team will review your submission and reach out if it’s a fit.
        </p>
        {/* Optional secondary action if needed later */}
    </motion.div>
);

// ============================================================================
// Main Component
// ============================================================================

const MediaMarketingForm = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const totalSteps = 7;

    const [formData, setFormData] = useState({
        // Step 1: Why
        whyContent: [],
        // Step 2: What to help with (max 2)
        helpWith: [],
        // Step 3: Who to reach
        whoToReach: [],
        whoSpecific: '',
        // Step 4: Where
        platforms: [],
        // Step 5: Consistency
        consistency: '',
        // Step 6: Hard parts
        challenges: [],
        // Step 7: Personal Info
        fullName: '',
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
        } else if (onClose) {
            // Optional: confirm before closing or just close
            onClose();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await saveApplication('media-marketing', formData);
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

    if (isSubmitted) {
        return <SuccessScreen />;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={1}
                            title="Why do you want to create content?"
                            subtitle="Clarify your intent."
                        />
                        <FloMultiSelect
                            label="Why do you want to start creating and sharing content?"
                            values={formData.whyContent}
                            onChange={(v) => updateFormData('whyContent', v)}
                            options={STEP_1_OPTIONS}
                        />
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={2}
                            title="What do you want content to help with?"
                            subtitle="Define your expectations."
                        />
                        <FloMultiSelect
                            label="What do you want content to help with the most?"
                            values={formData.helpWith}
                            onChange={(v) => updateFormData('helpWith', v)}
                            options={STEP_2_OPTIONS}
                            maxSelections={2}
                            helperText="Choose up to 2"
                        />
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={3}
                            title="Who do you want to reach?"
                            subtitle="Audience clarity."
                        />
                        <FloMultiSelect
                            label="Who do you want this content to speak to?"
                            values={formData.whoToReach}
                            onChange={(v) => updateFormData('whoToReach', v)}
                            options={STEP_3_OPTIONS}
                        />
                        {formData.whoToReach.includes('specific') && (
                            <FloInput
                                label="If specific, tell us who."
                                value={formData.whoSpecific}
                                onChange={(v) => updateFormData('whoSpecific', v)}
                                placeholder="e.g. Dentists in Chicago..."
                            />
                        )}
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key="step4"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={4}
                            title="Where do you want to show up?"
                            subtitle="Platform selection."
                        />
                        <FloMultiSelect
                            label="Where do you want to be active?"
                            values={formData.platforms}
                            onChange={(v) => updateFormData('platforms', v)}
                            options={STEP_4_OPTIONS}
                        />
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div
                        key="step5"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={5}
                            title="How consistent can you realistically be?"
                            subtitle="Readiness check."
                        />
                        <FloSegmentedControl
                            label="How consistent can you realistically be with content?"
                            value={formData.consistency}
                            onChange={(v) => updateFormData('consistency', v)}
                            options={STEP_5_OPTIONS}
                        />
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div
                        key="step6"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={6}
                            title="What feels hard about content right now?"
                            subtitle="Surface blockers."
                        />
                        <FloMultiSelect
                            label="What feels hard about content right now?"
                            values={formData.challenges}
                            onChange={(v) => updateFormData('challenges', v)}
                            options={STEP_6_OPTIONS}
                        />
                    </motion.div>
                );
            case 7:
                return (
                    <motion.div
                        key="step7"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-6"
                    >
                        <StepHeader
                            stepNumber={7}
                            title="Personal Information"
                            subtitle="Where should we send the details?"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloInput
                                label="Full Name"
                                value={formData.fullName}
                                onChange={(v) => updateFormData('fullName', v)}
                                placeholder="Your name"
                                required
                            />
                            <FloInput
                                label="Business Name"
                                value={formData.businessName}
                                onChange={(v) => updateFormData('businessName', v)}
                                placeholder="Business name"
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
                                placeholder="Optional"
                            />
                            <FloInput
                                label="Website or Instagram"
                                value={formData.website}
                                onChange={(v) => updateFormData('website', v)}
                                placeholder="Optional"
                            />
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header / Nav */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Media Marketing Application</h2>
                        <p className="text-xs text-white/50">Step {currentStep} of {totalSteps}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/30 backdrop-blur-lg shrink-0">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        className="px-6 py-3 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-semibold shadow-lg shadow-flo-orange/25 hover:shadow-flo-orange/40 transition-all flex items-center gap-2"
                        >
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-semibold shadow-lg shadow-flo-orange/25 hover:shadow-flo-orange/40 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Application</span>
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

export default MediaMarketingForm;
