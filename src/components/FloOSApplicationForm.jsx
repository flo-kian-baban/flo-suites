import React, { useState, useRef, useMemo } from 'react';
import { saveApplication } from '../lib/applications';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import FloOSDiagnosticReport from './FloOSDiagnosticReport';
import {
    FloInput,
    FloTextarea,
    FloDropdown,
    FloMultiSelect,
    FloSegmentedControl,
    FloSelectCard,
    FloTagInput,
    FloSlider,
    FloSearchableDropdown
} from './form/FloInputs';
import { INDUSTRIES } from '@/data/industries';



// ============================================================================
// Step Data Constants
// ============================================================================


const PRIMARY_INTENT_OPTIONS = [
    { value: 'full-operating-system', label: 'Full Operating System', description: 'End-to-end growth infrastructure: brand, content, funnels, and data' },
    { value: 'funnel-conversion', label: 'Funnel & Conversion System', description: 'Landing pages, lead capture, and conversion optimization' },
    { value: 'media-content', label: 'Media & Content Marketing', description: 'Content strategy, production, and distribution at scale' },
    { value: 'not-sure', label: 'Not sure yet', description: 'I want Flo to assess my situation and recommend next steps' }
];

const SOURCE_TO_INTENT = {
    'flo-os': 'full-operating-system',
    'Funnel Builder': 'funnel-conversion',
    'media-marketing': 'media-content'
};

const YEARS_OPTIONS = [
    { value: 'pre-launch', label: 'Pre-launch' },
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1–3 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '5-10', label: '5–10 years' },
    { value: '10+', label: '10+ years' }
];

const TEAM_SIZE_OPTIONS = [
    { value: 'small', label: 'Small team (1–10)' },
    { value: 'growing', label: 'Growing team (10–50)' },
    { value: 'scaled', label: 'Scaled org (50+)' }
];

const REVENUE_OPTIONS = [
    { value: 'pre-revenue', label: 'Pre-revenue' },
    { value: '0-10k', label: '$0 – $10k/mo' },
    { value: '10-50k', label: '$10k – $50k/mo' },
    { value: '50-100k', label: '$50k – $100k/mo' },
    { value: '100-500k', label: '$100k – $500k/mo' },
    { value: '500k+', label: '$500k+/mo' }
];

const GROWTH_GOALS_OPTIONS = [
    { value: 'increase-revenue', label: 'Increase revenue' },
    { value: 'stabilize-leads', label: 'Stabilize lead flow' },
    { value: 'improve-conversion', label: 'Improve conversion' },
    { value: 'build-authority', label: 'Build brand authority' },
    { value: 'scale-operations', label: 'Scale operations' }
];

const TIME_HORIZON_OPTIONS = [
    { value: '3-months', label: '3 months' },
    { value: '6-12-months', label: '6–12 months' },
    { value: 'long-term', label: 'Long-term system' }
];

const SITUATION_OPTIONS = [
    { value: 'know-blocking', label: 'I know what\'s blocking us', description: 'We\'ve identified bottlenecks, just need execution help' },
    { value: 'stuck-unsure', label: 'We\'re stuck but unsure why', description: 'Growth has stalled and we need clarity' },
    { value: 'growing-inefficient', label: 'We\'re growing but inefficient', description: 'Scaling but systems are breaking down' }
];

const BOTTLENECK_OPTIONS = [
    { value: 'inconsistent-leads', label: 'Inconsistent leads' },
    { value: 'low-quality-leads', label: 'Low-quality leads' },
    { value: 'poor-conversion', label: 'Poor conversion' },
    { value: 'team-confusion', label: 'Team confusion' },
    { value: 'content-not-working', label: 'Content not working' },
    { value: 'ads-not-converting', label: 'Ads not converting' },
    { value: 'no-visibility', label: 'No visibility on performance' }
];

const BUDGET_OPTIONS = [
    { value: 'entry', label: 'Entry-level systems', description: 'Getting started with structured growth' },
    { value: 'mid-range', label: 'Mid-range growth investment', description: 'Ready for serious implementation' },
    { value: 'long-term', label: 'Long-term system partner', description: 'Building infrastructure for scale' }
];

const DECISION_OPTIONS = [
    { value: 'decision-maker', label: 'I\'m the decision maker' },
    { value: 'influencer', label: 'I influence the decision' }
];

// ============================================================================
// Validation Helpers
// ============================================================================
const trim = (v) => (typeof v === 'string' ? v.trim() : v);
const isEmpty = (v) => {
    if (v === null || v === undefined) return true;
    if (typeof v === 'string') return v.trim().length === 0;
    if (Array.isArray(v)) return v.length === 0;
    return false;
};
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trim(v));
const isValidPhone = (v) => {
    const digits = v.replace(/[^\d]/g, '');
    return digits.length >= 7 && digits.length <= 15;
};
const isValidUrl = (v) => {
    const trimmed = trim(v);
    if (trimmed.startsWith('@')) return trimmed.length > 1; // Instagram handle
    return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed);
};

/**
 * Per-step validation rules.
 * Each step maps to an array of { field, label, validate? } objects.
 * If `validate` is omitted the field is just checked for non-empty.
 */
const STEP_VALIDATION_RULES = {
    1: [
        { field: 'industry', label: 'Industry' },
        { field: 'yearsInOperation', label: 'Years in operation' },
        { field: 'teamSize', label: 'Team size' },
        { field: 'monthlyRevenue', label: 'Monthly revenue' },
        {
            field: 'primaryOffers',
            label: 'Primary offers',
            validate: (v) => {
                if (!v || v.length === 0) return 'Add at least one product or service';
                return null;
            },
        },
    ],
    2: [
        { field: 'primaryIntent', label: 'Primary interest' },
    ],
    3: [
        { field: 'growthGoals', label: 'Growth goals' },
        { field: 'timeHorizon', label: 'Time horizon' },
        { field: 'situation', label: 'Situation' },
    ],
    4: [], // Slider confirmation handled separately below
    5: [
        {
            field: 'bottlenecks',
            label: 'Bottlenecks',
            validate: (v) => {
                if (!v || v.length === 0) return 'Select at least one bottleneck';
                if (v.length > 3) return 'Select up to 3 bottlenecks to prioritize';
                return null;
            },
        },
    ],
    6: [
        { field: 'decisionAuthority', label: 'Decision authority' },
        { field: 'readiness', label: 'Readiness' },
    ],
    7: [
        { field: 'name', label: 'Name' },
        { field: 'businessName', label: 'Business name' },
        {
            field: 'email',
            label: 'Email',
            validate: (v) => {
                if (isEmpty(v)) return 'Email is required';
                if (!isValidEmail(v)) return 'Enter a valid email address';
                return null;
            },
        },
        {
            field: 'phone',
            label: 'Phone',
            required: false, // optional but validated if filled
            validate: (v) => {
                if (isEmpty(v)) return null; // optional
                if (!isValidPhone(v)) return 'Enter a valid phone number';
                return null;
            },
        },
        {
            field: 'website',
            label: 'Website / Instagram',
            required: false,
            validate: (v) => {
                if (isEmpty(v)) return null; // optional
                if (!isValidUrl(v)) return 'Enter a valid URL or @handle';
                return null;
            },
        },
    ],
};

const READINESS_OPTIONS = [
    { value: 'execution', label: 'We want execution', description: 'Ready to implement, need hands to do it' },
    { value: 'structure', label: 'We want structure', description: 'Need systems and process first' },
    { value: 'partnership', label: 'We want long-term partnership', description: 'Looking for ongoing collaboration' }
];

// ============================================================================
// Progress Indicator Component
// ============================================================================
const ProgressIndicator = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <div
                        key={idx}
                        className={`
                            h-1.5 rounded-full transition-all duration-300
                            ${isCurrent ? 'w-8 bg-flo-orange' : 'w-4'}
                            ${isCompleted ? 'bg-flo-orange/60' : !isCurrent ? 'bg-white/10' : ''}
                        `}
                    />
                );
            })}
        </div>
    );
};

// ============================================================================
// Step Header Component
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

// ============================================================================
// Main Form Component
// ============================================================================
const FloOSApplicationForm = ({ onClose, onBack, source = 'flo-os' }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [stepErrors, setStepErrors] = useState({});
    const [sliderConfirmed, setSliderConfirmed] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const contentRef = useRef(null);
    const totalSteps = 7;

    // Stable reference ID — generated once per form session
    const referenceId = useMemo(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return 'FLO-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        // Source tracking
        source: source,
        primaryIntent: SOURCE_TO_INTENT[source] || '',

        // Step 1: Business Snapshot
        industry: '',
        yearsInOperation: '',
        teamSize: '',
        monthlyRevenue: '',
        primaryOffers: [],

        // Step 3: Growth Intent
        growthGoals: [],
        timeHorizon: '',
        situation: '',

        // Step 4: System Maturity
        brandClarity: 3,
        contentSystem: 3,
        leadGeneration: 3,
        conversionSystem: 3,
        dataVisibility: 3,
        executionProcess: 3,

        // Step 5: Bottlenecks
        bottlenecks: [],
        frustrationText: '',

        // Step 6: Fit & Commitment
        decisionAuthority: '',
        readiness: '',

        // Step 7: Final Details
        name: '',
        businessName: '',
        email: '',
        phone: '',
        website: '',
        finalQuestion: ''
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ====================================================================
    // Validation
    // ====================================================================
    const validateStep = (step) => {
        const rules = STEP_VALIDATION_RULES[step] || [];
        const errors = {};

        rules.forEach(({ field, label, validate, required: isReq }) => {
            const value = formData[field];

            if (validate) {
                const msg = validate(value);
                if (msg) errors[field] = msg;
            } else if (isReq !== false && isEmpty(value)) {
                errors[field] = `${label} is required`;
            }
        });

        // Step 4: require slider confirmation
        if (step === 4 && !sliderConfirmed) {
            errors._sliderConfirm = 'Please confirm your ratings are accurate before continuing';
        }

        setStepErrors(errors);

        // Scroll to first error
        if (Object.keys(errors).length > 0 && contentRef.current) {
            const firstErrorField = Object.keys(errors)[0];
            const el = contentRef.current.querySelector(`[data-field="${firstErrorField}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const focusable = el.querySelector('input, textarea, select, button');
                focusable?.focus();
            }
        }

        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
            setStepErrors({});
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setStepErrors({});
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else if (onBack) {
            onBack();
        }
    };

    const handleSubmit = async () => {
        // Client-side final step validation
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        setSubmitError('');
        try {
            // Server-side validation gate: re-check critical fields
            const trimmedEmail = trim(formData.email);
            const trimmedName = trim(formData.name);
            if (!trimmedName || !isValidEmail(trimmedEmail)) {
                setStepErrors({
                    ...(!trimmedName ? { name: 'Name is required' } : {}),
                    ...(!isValidEmail(trimmedEmail) ? { email: 'Enter a valid email address' } : {}),
                });
                setIsSubmitting(false);
                return;
            }

            await saveApplication('flo-os', {
                ...formData,
                referenceId,
                name: trimmedName,
                email: trimmedEmail,
                businessName: trim(formData.businessName),
                phone: trim(formData.phone),
                website: trim(formData.website),
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Failed to submit application:', error);
            setSubmitError('Something went wrong submitting your application. Please try again.');
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

    // ========================================================================
    // Diagnostic Report (after submission)
    // ========================================================================
    if (isSubmitted) {
        return (
            <FloOSDiagnosticReport
                formData={formData}
                onClose={onClose}
                referenceId={referenceId}
            />
        );
    }

    // ========================================================================
    // Step Content Renderer
    // ========================================================================
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
                            title="Business Snapshot"
                            subtitle="Help us understand your baseline context."
                        />

                        <div data-field="industry">
                            <FloSearchableDropdown
                                label="Industry / Business Type"
                                value={formData.industry}
                                onChange={(v) => updateFormData('industry', v)}
                                options={INDUSTRIES}
                                placeholder="Search or type your industry..."
                                required
                                error={stepErrors.industry}
                            />
                        </div>

                        <div data-field="yearsInOperation">
                            <FloDropdown
                                label="Years in Operation"
                                value={formData.yearsInOperation}
                                onChange={(v) => updateFormData('yearsInOperation', v)}
                                options={YEARS_OPTIONS}
                                placeholder="How long have you been operating?"
                                required
                                error={stepErrors.yearsInOperation}
                            />
                        </div>

                        <div data-field="teamSize">
                            <FloSegmentedControl
                                label="Team Size"
                                value={formData.teamSize}
                                onChange={(v) => updateFormData('teamSize', v)}
                                options={TEAM_SIZE_OPTIONS}
                                required
                                error={stepErrors.teamSize}
                            />
                        </div>

                        <div data-field="monthlyRevenue">
                            <FloDropdown
                                label="Average Monthly Revenue"
                                value={formData.monthlyRevenue}
                                onChange={(v) => updateFormData('monthlyRevenue', v)}
                                options={REVENUE_OPTIONS}
                                placeholder="Select revenue range"
                                required
                                error={stepErrors.monthlyRevenue}
                            />
                        </div>

                        <div data-field="primaryOffers">
                            <FloTagInput
                                label="Primary Offer(s)"
                                values={formData.primaryOffers}
                                onChange={(v) => updateFormData('primaryOffers', v)}
                                placeholder="Type your offer and press Enter"
                                helperText="Add your main products or services"
                                maxTags={5}
                                required
                                error={stepErrors.primaryOffers}
                            />
                        </div>
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
                            title="Primary Interest"
                            subtitle="What are you most interested in? You can always adjust this later."
                        />

                        <div data-field="primaryIntent">
                            <FloSelectCard
                                label="What brings you to Flo?"
                                value={formData.primaryIntent}
                                onChange={(v) => updateFormData('primaryIntent', v)}
                                options={PRIMARY_INTENT_OPTIONS}
                                required
                                error={stepErrors.primaryIntent}
                            />
                        </div>
                    </motion.div>
                );

            case 3:
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
                            stepNumber={3}
                            title="Growth Intent"
                            subtitle="Where are you trying to go?"
                        />

                        <div data-field="growthGoals">
                            <FloMultiSelect
                                label="Primary Growth Goals"
                                values={formData.growthGoals}
                                onChange={(v) => updateFormData('growthGoals', v)}
                                options={GROWTH_GOALS_OPTIONS}
                                maxSelections={2}
                                required
                                error={stepErrors.growthGoals}
                            />
                        </div>

                        <div data-field="timeHorizon">
                            <FloSegmentedControl
                                label="Time Horizon"
                                value={formData.timeHorizon}
                                onChange={(v) => updateFormData('timeHorizon', v)}
                                options={TIME_HORIZON_OPTIONS}
                                required
                                error={stepErrors.timeHorizon}
                            />
                        </div>

                        <div data-field="situation">
                            <FloSelectCard
                                label="What best describes your situation?"
                                value={formData.situation}
                                onChange={(v) => updateFormData('situation', v)}
                                options={SITUATION_OPTIONS}
                                required
                                error={stepErrors.situation}
                            />
                        </div>
                    </motion.div>
                );

            case 4:
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
                            stepNumber={4}
                            title="System Maturity"
                            subtitle="Slide to rate your current system health."
                        />

                        <div className="space-y-8">
                            <FloSlider
                                label="Brand & Positioning Clarity"
                                value={formData.brandClarity}
                                onChange={(v) => updateFormData('brandClarity', v)}
                                helperText="How clear is your market positioning?"
                                lowLabel="Unclear"
                                highLabel="Crystal"
                            />

                            <FloSlider
                                label="Content System Consistency"
                                value={formData.contentSystem}
                                onChange={(v) => updateFormData('contentSystem', v)}
                                helperText="How consistent is your content output?"
                                lowLabel="Sporadic"
                                highLabel="Systematic"
                            />

                            <FloSlider
                                label="Lead Generation System"
                                value={formData.leadGeneration}
                                onChange={(v) => updateFormData('leadGeneration', v)}
                                helperText="How reliable is your lead flow?"
                                lowLabel="Dry"
                                highLabel="Flowing"
                            />

                            <FloSlider
                                label="Conversion System"
                                value={formData.conversionSystem}
                                onChange={(v) => updateFormData('conversionSystem', v)}
                                helperText="Funnel, booking, follow-up effectiveness"
                                lowLabel="Leaky"
                                highLabel="Tight"
                            />

                            <FloSlider
                                label="Data & Performance Visibility"
                                value={formData.dataVisibility}
                                onChange={(v) => updateFormData('dataVisibility', v)}
                                helperText="Can you see what's working?"
                                lowLabel="Blind"
                                highLabel="Full view"
                            />

                            <FloSlider
                                label="Internal Execution Process"
                                value={formData.executionProcess}
                                onChange={(v) => updateFormData('executionProcess', v)}
                                helperText="Chaos vs. clarity in operations"
                                lowLabel="Chaos"
                                highLabel="Clarity"
                            />
                        </div>

                        {/* Slider confirmation gate */}
                        <div data-field="_sliderConfirm" className="mt-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={sliderConfirmed}
                                        onChange={(e) => setSliderConfirmed(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${sliderConfirmed
                                            ? 'bg-flo-orange border-flo-orange'
                                            : stepErrors._sliderConfirm
                                                ? 'border-red-400 bg-red-400/10'
                                                : 'border-white/30 group-hover:border-white/50'
                                        }`}>
                                        {sliderConfirmed && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </div>
                                <span className={`text-sm leading-relaxed ${stepErrors._sliderConfirm ? 'text-red-400' : 'text-white/60'
                                    }`}>
                                    These ratings reflect our honest assessment of current capabilities.
                                </span>
                            </label>
                            {stepErrors._sliderConfirm && (
                                <p className="text-xs text-red-400 mt-2 ml-8">{stepErrors._sliderConfirm}</p>
                            )}
                        </div>
                    </motion.div>
                );

            case 5:
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
                            stepNumber={5}
                            title="Bottlenecks & Friction"
                            subtitle="Where do revenue leaks exist?"
                        />

                        <div data-field="bottlenecks">
                            <FloMultiSelect
                                label="What feels hardest right now?"
                                values={formData.bottlenecks}
                                onChange={(v) => updateFormData('bottlenecks', v)}
                                options={BOTTLENECK_OPTIONS}
                                maxSelections={3}
                                helperText="Select up to 3"
                                required
                                error={stepErrors.bottlenecks}
                            />
                        </div>

                        <FloTextarea
                            label="What feels broken or frustrating right now?"
                            value={formData.frustrationText}
                            onChange={(v) => updateFormData('frustrationText', v)}
                            placeholder="Tell us more about your current challenges..."
                            helperText="Optional — be as specific as you'd like"
                            rows={4}
                        />
                    </motion.div>
                );

            case 6:
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
                            stepNumber={6}
                            title="Fit & Commitment"
                            subtitle="Help us understand your readiness."
                        />



                        <div data-field="decisionAuthority">
                            <FloSegmentedControl
                                label="Decision Authority"
                                value={formData.decisionAuthority}
                                onChange={(v) => updateFormData('decisionAuthority', v)}
                                options={DECISION_OPTIONS}
                                required
                                error={stepErrors.decisionAuthority}
                            />
                        </div>

                        <div data-field="readiness">
                            <FloSelectCard
                                label="What are you looking for?"
                                value={formData.readiness}
                                onChange={(v) => updateFormData('readiness', v)}
                                options={READINESS_OPTIONS}
                                required
                                error={stepErrors.readiness}
                            />
                        </div>
                    </motion.div>
                );

            case 7:
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
                            stepNumber={7}
                            title="Final Details"
                            subtitle="Let's get your contact information."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div data-field="name">
                                <FloInput
                                    label="Your Name"
                                    value={formData.name}
                                    onChange={(v) => updateFormData('name', v)}
                                    placeholder="Full name"
                                    required
                                    error={stepErrors.name}
                                />
                            </div>

                            <div data-field="businessName">
                                <FloInput
                                    label="Business Name"
                                    value={formData.businessName}
                                    onChange={(v) => updateFormData('businessName', v)}
                                    placeholder="Company name"
                                    required
                                    error={stepErrors.businessName}
                                />
                            </div>
                        </div>

                        <div data-field="email">
                            <FloInput
                                label="Email"
                                value={formData.email}
                                onChange={(v) => updateFormData('email', v)}
                                placeholder="you@company.com"
                                type="email"
                                required
                                error={stepErrors.email}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div data-field="phone">
                                <FloInput
                                    label="Phone"
                                    value={formData.phone}
                                    onChange={(v) => updateFormData('phone', v)}
                                    placeholder="+1 (555) 000-0000"
                                    helperText="Optional"
                                    error={stepErrors.phone}
                                />
                            </div>

                            <div data-field="website">
                                <FloInput
                                    label="Website / Instagram"
                                    value={formData.website}
                                    onChange={(v) => updateFormData('website', v)}
                                    placeholder="yoursite.com or @handle"
                                    helperText="Optional"
                                    error={stepErrors.website}
                                />
                            </div>
                        </div>

                        <FloTextarea
                            label="If nothing changes in the next 12 months, what happens?"
                            value={formData.finalQuestion}
                            onChange={(v) => updateFormData('finalQuestion', v)}
                            placeholder="Be honest with yourself..."
                            helperText="Optional, but helps us understand your urgency"
                            rows={3}
                        />
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Progress */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Apply to Flo</h2>
                        <p className="text-xs text-white/50">Step {currentStep} of {totalSteps}</p>
                    </div>
                </div>
                <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* Scrollable Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 flex flex-col">
                <div className="max-w-2xl mx-auto w-full my-auto">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-white/10 bg-black/30 backdrop-blur-lg shrink-0">
                {submitError && (
                    <div className="max-w-2xl mx-auto mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3">
                        <p className="text-sm text-red-400">{submitError}</p>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors shrink-0"
                        >
                            Retry
                        </button>
                    </div>
                )}
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        className="px-6 py-3 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{currentStep === 1 ? 'Back' : 'Previous'}</span>
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
                            className="px-8 py-3 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-semibold shadow-lg shadow-flo-orange/25 hover:shadow-flo-orange/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default FloOSApplicationForm;
