import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    X,
    Palette,
    TrendingUp,
    Code,
    Users,
    Target,
    Zap,
    BarChart3,
    AlertCircle,
    CheckCircle2,
    Clock,
    Building2,
    Layers,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

// ============================================================================
// DATA INTERPRETATION HELPERS
// ============================================================================

const getStatusFromScore = (score) => {
    if (!score || score <= 2) return { label: 'Weak', color: 'text-red-400', bgColor: 'bg-red-400', level: 'weak' };
    if (score === 3) return { label: 'Developing', color: 'text-amber-400', bgColor: 'bg-amber-400', level: 'developing' };
    return { label: 'Strong', color: 'text-emerald-400', bgColor: 'bg-emerald-400', level: 'strong' };
};

const getIndustryLabel = (value) => {
    const map = {
        'ecommerce': 'E-commerce / DTC',
        'saas': 'SaaS / Software',
        'agency': 'Agency / Services',
        'coaching': 'Coaching / Consulting',
        'healthcare': 'Healthcare / Wellness',
        'real-estate': 'Real Estate',
        'finance': 'Finance / FinTech',
        'education': 'Education / EdTech',
        'media': 'Media / Entertainment',
        'other': 'Other'
    };
    return map[value] || value;
};

const getRevenueLabel = (value) => {
    const map = {
        'pre-revenue': 'Pre-revenue',
        '0-10k': '$0 – $10k/mo',
        '10-50k': '$10k – $50k/mo',
        '50-100k': '$50k – $100k/mo',
        '100-500k': '$100k – $500k/mo',
        '500k+': '$500k+/mo'
    };
    return map[value] || value;
};

const getTeamSizeLabel = (value) => {
    const map = {
        'small': 'Small Team (1–10)',
        'growing': 'Growing Team (10–50)',
        'scaled': 'Scaled Org (50+)'
    };
    return map[value] || value;
};

const getYearsLabel = (value) => {
    const map = {
        'pre-launch': 'Pre-launch',
        '0-1': 'Less than 1 year',
        '1-3': '1–3 years',
        '3-5': '3–5 years',
        '5-10': '5–10 years',
        '10+': '10+ years'
    };
    return map[value] || value;
};

const getTimeHorizonLabel = (value) => {
    const map = {
        '3-months': '3 months',
        '6-12-months': '6–12 months',
        'long-term': 'Long-term system'
    };
    return map[value] || value;
};

const getSituationLabel = (value) => {
    const map = {
        'know-blocking': 'Knows what\'s blocking growth',
        'stuck-unsure': 'Stuck but unsure why',
        'growing-inefficient': 'Growing but inefficient'
    };
    return map[value] || value;
};

const getIntentLabel = (value) => {
    const map = {
        'full-operating-system': 'FLO OS',
        'funnel-conversion': 'Funnel & Conversion System',
        'media-content': 'Media & Content Marketing',
        'not-sure': 'Not sure yet'
    };
    return map[value] || value;
};

const getDecisionLabel = (value) => {
    const map = {
        'decision-maker': 'Decision maker',
        'influencer': 'Influences the decision'
    };
    return map[value] || value;
};

const getReadinessLabel = (value) => {
    const map = {
        'execution': 'Wants execution',
        'structure': 'Wants structure first',
        'partnership': 'Wants long-term partnership'
    };
    return map[value] || value;
};

const getGoalLabel = (value) => {
    const map = {
        'increase-revenue': 'Increase Revenue',
        'stabilize-leads': 'Stabilize Lead Flow',
        'improve-conversion': 'Improve Conversion',
        'build-authority': 'Build Brand Authority',
        'scale-operations': 'Scale Operations'
    };
    return map[value] || value;
};

const getBottleneckLabel = (value) => {
    const map = {
        'inconsistent-leads': 'Inconsistent leads',
        'low-quality-leads': 'Low-quality leads',
        'poor-conversion': 'Poor conversion',
        'team-confusion': 'Team confusion',
        'content-not-working': 'Content not working',
        'ads-not-converting': 'Ads not converting',
        'no-visibility': 'No visibility on performance'
    };
    return map[value] || value;
};

// System area metadata for friction/opportunity generation
const SYSTEM_AREAS = {
    brandClarity: {
        name: 'Brand & Positioning',
        frictionTitle: 'Unclear market positioning',
        frictionReason: 'Your brand lacks the differentiation needed to stand out in a crowded market.',
        opportunityTitle: 'Brand Positioning Refinement',
        opportunityWhy: 'Your positioning has room to sharpen—messaging that resonates drives higher conversion.',
        opportunityUnlock: 'Clearer differentiation, stronger resonance with ideal clients',
        leverageTitle: 'Brand Authority Amplification',
        leverageWhy: 'Your strong positioning is an asset ready to be leveraged at scale.',
        leverageUnlock: 'Market leadership perception, premium positioning',
        team: 'studio',
        relatedGoals: ['build-authority', 'improve-conversion']
    },
    contentSystem: {
        name: 'Content System',
        frictionTitle: 'Inconsistent content output',
        frictionReason: 'Sporadic content is limiting audience trust and authority-building.',
        opportunityTitle: 'Content System Activation',
        opportunityWhy: 'Your content has potential—a structured system will multiply its impact.',
        opportunityUnlock: 'Predictable audience growth, compounding organic reach',
        leverageTitle: 'Content Engine Scaling',
        leverageWhy: 'Your content engine is working—time to amplify distribution.',
        leverageUnlock: 'Scaled authority, multi-channel presence',
        team: 'studio',
        relatedGoals: ['build-authority', 'stabilize-leads']
    },
    leadGeneration: {
        name: 'Lead Generation',
        frictionTitle: 'Unpredictable lead flow',
        frictionReason: 'Your demand generation lacks the consistency to support reliable growth.',
        opportunityTitle: 'Lead System Optimization',
        opportunityWhy: 'Your lead flow is developing—systematic optimization will stabilize acquisition.',
        opportunityUnlock: 'Predictable pipeline, reduced revenue volatility',
        leverageTitle: 'Demand Scaling',
        leverageWhy: 'Your lead system is strong—ready for volume increase.',
        leverageUnlock: 'Higher throughput, expanded market reach',
        team: 'marketing',
        relatedGoals: ['stabilize-leads', 'increase-revenue']
    },
    conversionSystem: {
        name: 'Conversion System',
        frictionTitle: 'Conversion inefficiencies',
        frictionReason: 'Leads are leaking through gaps in your funnel and follow-up process.',
        opportunityTitle: 'Funnel Tightening',
        opportunityWhy: 'Your conversion has room to improve—small fixes can yield significant gains.',
        opportunityUnlock: 'Higher close rates, better unit economics',
        leverageTitle: 'Conversion Scaling',
        leverageWhy: 'Your conversion is solid—time to increase volume without sacrificing rates.',
        leverageUnlock: 'Revenue acceleration without proportional cost increase',
        team: 'development',
        relatedGoals: ['improve-conversion', 'increase-revenue']
    },
    dataVisibility: {
        name: 'Data Visibility',
        frictionTitle: 'Limited performance visibility',
        frictionReason: 'You can\'t optimize what you can\'t measure—blind spots are costly.',
        opportunityTitle: 'Analytics Infrastructure',
        opportunityWhy: 'Your data setup is developing—structured tracking will unlock insights.',
        opportunityUnlock: 'Data-driven decisions, faster iteration cycles',
        leverageTitle: 'Intelligence Layer',
        leverageWhy: 'Your data foundation is strong—ready for advanced insights.',
        leverageUnlock: 'Predictive capabilities, proactive optimization',
        team: 'development',
        relatedGoals: ['scale-operations', 'improve-conversion']
    },
    executionProcess: {
        name: 'Execution Process',
        frictionTitle: 'Operational friction',
        frictionReason: 'Team confusion and unclear processes are slowing down execution.',
        opportunityTitle: 'Process Standardization',
        opportunityWhy: 'Your operations need structure—clear workflows will accelerate output.',
        opportunityUnlock: 'Faster execution, reduced bottlenecks',
        leverageTitle: 'Execution Optimization',
        leverageWhy: 'Your processes are solid—time to fine-tune for efficiency.',
        leverageUnlock: 'Higher throughput, scalable operations',
        team: 'consultation',
        relatedGoals: ['scale-operations', 'increase-revenue']
    }
};

// Team metadata
const TEAMS = {
    studio: { name: 'Studio Team', icon: Palette, description: 'Brand, content, creative systems' },
    marketing: { name: 'Marketing Team', icon: TrendingUp, description: 'Demand generation, campaigns' },
    development: { name: 'Development Team', icon: Code, description: 'Funnels, automation, data systems' },
    consultation: { name: 'Consultation Team', icon: Users, description: 'Strategy, architecture, guidance' }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Section wrapper with consistent styling
const Section = ({ children, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${className}`}
    >
        {children}
    </motion.div>
);

// Section title
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-3 mb-4">
        {Icon && (
            <div className="p-2 rounded-lg bg-flo-orange/10 text-flo-orange shrink-0">
                <Icon className="w-5 h-5" />
            </div>
        )}
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

// System health bar
const HealthBar = ({ label, score, lowLabel, highLabel }) => {
    const status = getStatusFromScore(score);
    const percentage = score ? (score / 5) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">{label}</span>
                <span className={`text-xs font-semibold ${status.color}`}>
                    {status.label}
                </span>
            </div>
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
                    className={`absolute inset-y-0 left-0 rounded-full ${status.bgColor}`}
                />
            </div>
            <div className="flex justify-between text-xs text-white/30">
                <span>{lowLabel}</span>
                <span>{highLabel}</span>
            </div>
        </div>
    );
};

// Snapshot card
const SnapshotCard = ({ icon: Icon, label, value }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
                <Icon className="w-4 h-4 text-white/60" />
            </div>
            <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Enhanced Friction Point Card (Upgrade #1)
const FrictionPointCard = ({ index, title, reason, systemArea }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-red-400">{index}</span>
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{reason}</p>
                <span className="inline-block mt-2 text-xs text-white/30 uppercase tracking-wider">
                    {systemArea}
                </span>
            </div>
        </div>
    </div>
);

// Growth Opportunity Card (Upgrade #2) - Now includes gaps, immediate, and leverage
const OpportunityCard = ({ title, whyApplies, whatUnlocks, type }) => {
    // Determine styling based on type
    const styles = {
        gap: {
            bg: 'bg-flo-orange/5 border-flo-orange/20 hover:border-flo-orange/30',
            iconBg: 'bg-flo-orange/20',
            textColor: 'text-flo-orange',
            label: 'Growth Gap',
            icon: <Zap className="w-4 h-4 text-flo-orange" />
        },
        immediate: {
            bg: 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30',
            iconBg: 'bg-amber-500/20',
            textColor: 'text-amber-400',
            label: 'Immediate Opportunity',
            icon: <Sparkles className="w-4 h-4 text-amber-400" />
        },
        leverage: {
            bg: 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30',
            iconBg: 'bg-emerald-500/20',
            textColor: 'text-emerald-400',
            label: 'Leverage Opportunity',
            icon: <ArrowUpRight className="w-4 h-4 text-emerald-400" />
        }
    };
    const style = styles[type] || styles.immediate;

    return (
        <div className={`p-5 rounded-xl border transition-all ${style.bg}`}>
            <div className="flex items-start gap-3 mb-3">
                <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
                    {style.icon}
                </div>
                <div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${style.textColor}`}>
                        {style.label}
                    </span>
                </div>
            </div>
            <h4 className="font-semibold text-white mb-2">{title}</h4>
            <p className="text-sm text-white/60 mb-3">{whyApplies}</p>

        </div>
    );
};


// Phase card for the roadmap
const PhaseCard = ({ phase, title, description, isActive }) => (
    <div className={`p-4 rounded-xl border transition-all ${isActive
        ? 'bg-flo-orange/10 border-flo-orange/30'
        : 'bg-white/5 border-white/10'
        }`}>
        <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-flo-orange' : 'text-white/40'
                }`}>
                Phase {phase}
            </span>
            {isActive && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-flo-orange/20 text-flo-orange rounded-full">
                    Priority
                </span>
            )}
        </div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/50">{description}</p>
    </div>
);

// Team Assignment Card (Upgrade #3)
const TeamCard = ({ icon: Icon, name, focusAreas, isEngaged }) => (
    <div className={`p-5 rounded-xl border transition-all ${isEngaged
        ? 'bg-white/5 border-white/20'
        : 'bg-white/[0.02] border-white/5 opacity-40'
        }`}>
        <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-xl ${isEngaged ? 'bg-flo-orange/10 text-flo-orange' : 'bg-white/5 text-white/30'
                }`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-white">{name}</h4>
                    {isEngaged && (
                        <CheckCircle2 className="w-4 h-4 text-flo-orange" />
                    )}
                </div>
                {isEngaged && focusAreas.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Focus in your case</p>
                        <ul className="space-y-1">
                            {focusAreas.map((focus, idx) => (
                                <li key={idx} className="text-sm text-white/60 flex items-center gap-2">
                                    <span className="text-flo-orange">•</span>
                                    <span>{focus}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// Readiness Score Component (Clean, readable version)
const ReadinessScore = ({ systemScores, formData }) => {
    // Multi-factor Readiness calculation:
    // 1. System gap opportunity (40% weight) — lower maturity = more opportunity
    // 2. Goal-bottleneck alignment (30% weight) — do stated goals match bottlenecks?
    // 3. Engagement readiness (30% weight) — decision authority + readiness preference
    const avgScore = Object.values(systemScores).reduce((a, b) => a + b, 0) / 6;

    // Factor 1: System gap opportunity (0-100)
    const gapScore = Math.max(10, Math.round(100 - ((avgScore - 1) * 22.5)));

    // Factor 2: Goal-bottleneck alignment (0-100)
    const goals = formData.growthGoals || [];
    const bottlenecks = formData.bottlenecks || [];
    const goalBottleneckMap = {
        'increase-revenue': ['poor-conversion', 'inconsistent-leads', 'low-quality-leads'],
        'stabilize-leads': ['inconsistent-leads', 'low-quality-leads'],
        'improve-conversion': ['poor-conversion', 'ads-not-converting'],
        'build-authority': ['content-not-working'],
        'scale-operations': ['team-confusion', 'no-visibility']
    };
    let alignmentHits = 0;
    goals.forEach(g => {
        const relatedBottlenecks = goalBottleneckMap[g] || [];
        if (bottlenecks.some(b => relatedBottlenecks.includes(b))) alignmentHits++;
    });
    const alignmentScore = goals.length > 0 ? Math.round((alignmentHits / goals.length) * 80) + 20 : 50;

    // Factor 3: Engagement readiness (0-100)
    let engagementScore = 50;
    if (formData.decisionAuthority === 'decision-maker') engagementScore += 20;
    if (formData.readiness === 'execution') engagementScore += 20;
    else if (formData.readiness === 'partnership') engagementScore += 15;
    else if (formData.readiness === 'structure') engagementScore += 10;
    if (formData.timeHorizon === '3-months') engagementScore += 10;
    else if (formData.timeHorizon === '6-12-months') engagementScore += 5;
    engagementScore = Math.min(100, engagementScore);

    // Weighted final score
    const percentage = Math.round(
        gapScore * 0.4 + alignmentScore * 0.3 + engagementScore * 0.3
    );

    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col items-center py-10">
            {/* Clean Readiness Gauge */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Arc */}
                    <motion.circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="#F97316"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white tracking-tight mb-1">{percentage}%</span>
                    <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Readiness</span>
                </div>
            </div>

            {/* System Status Card */}
            <div className="w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-flo-orange/10 rounded-lg shrink-0">
                        <Zap className="w-5 h-5 text-flo-orange" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-1">System Optimization Active</h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Your diagnostic inputs have been securely captured. Our team is currently modeling your custom
                            <span className="text-white font-medium"> Flo Operating System</span> architecture based on these parameters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const FloOSDiagnosticReport = ({ formData, onClose, referenceId }) => {

    // Calculate system health scores
    const systemScores = useMemo(() => ({
        brandClarity: formData.brandClarity || 1,
        contentSystem: formData.contentSystem || 1,
        leadGeneration: formData.leadGeneration || 1,
        conversionSystem: formData.conversionSystem || 1,
        dataVisibility: formData.dataVisibility || 1,
        executionProcess: formData.executionProcess || 1
    }), [formData]);

    const avgScore = useMemo(() => {
        const scores = Object.values(systemScores);
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }, [systemScores]);

    // ========================================================================
    // UPGRADE #1: Enhanced Friction Points (2-3 based on weak ratings + bottlenecks + goals)
    // ========================================================================
    const frictionPoints = useMemo(() => {
        const points = [];
        const userGoals = formData.growthGoals || [];
        const bottlenecks = formData.bottlenecks || [];

        // Score each system area for friction priority
        // Lower score = higher friction, also boost if aligned with goals or bottlenecks
        const scoredAreas = Object.entries(systemScores).map(([key, score]) => {
            const area = SYSTEM_AREAS[key];
            let priority = 5 - score; // Invert: lower score = higher priority

            // Boost priority if user's goals align with this area
            if (area.relatedGoals.some(g => userGoals.includes(g))) {
                priority += 1;
            }

            // Boost priority if bottlenecks relate to this area
            const bottleneckMap = {
                'inconsistent-leads': 'leadGeneration',
                'low-quality-leads': 'leadGeneration',
                'poor-conversion': 'conversionSystem',
                'content-not-working': 'contentSystem',
                'ads-not-converting': 'marketing', // mapped to marketing but affects lead gen
                'no-visibility': 'dataVisibility',
                'team-confusion': 'executionProcess'
            };
            if (bottlenecks.some(b => bottleneckMap[b] === key)) {
                priority += 1.5;
            }

            return { key, score, priority, area };
        });

        // Sort by priority (highest first) and take top 2-3 weak areas (score <= 3)
        const weakAreas = scoredAreas
            .filter(({ score }) => score <= 3)
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 3);

        weakAreas.forEach(({ key, area }) => {
            points.push({
                title: area.frictionTitle,
                reason: area.frictionReason,
                systemArea: area.name,
                team: area.team
            });
        });

        return points;
    }, [systemScores, formData]);

    // Generate interpretation text based on top friction
    const interpretationText = useMemo(() => {
        if (frictionPoints.length === 0) {
            return "Your systems are well-developed. Focus on optimization and scaling what's already working.";
        }
        if (frictionPoints.length === 1) {
            return `Your growth is primarily constrained by ${frictionPoints[0].systemArea.toLowerCase()} gaps.`;
        }
        const areas = frictionPoints.slice(0, 2).map(f => f.systemArea.toLowerCase()).join(' and ');
        return `Your growth is currently constrained by friction in ${areas}.`;
    }, [frictionPoints]);

    // ========================================================================
    // UPGRADE #2: Growth Opportunities (includes ALL areas - gaps, developing, and strong)
    // ========================================================================
    const growthOpportunities = useMemo(() => {
        const opportunities = [];
        const userGoals = formData.growthGoals || [];
        const timeHorizon = formData.timeHorizon;

        // Categorize each system area - now includes ALL areas
        Object.entries(systemScores).forEach(([key, score]) => {
            const area = SYSTEM_AREAS[key];
            const status = getStatusFromScore(score);

            // Calculate opportunity priority based on goals and time horizon
            let priority = 0;
            if (area.relatedGoals.some(g => userGoals.includes(g))) {
                priority += 2;
            }
            // Weak areas get highest priority (they're the biggest opportunities)
            if (status.level === 'weak') {
                priority += 3;
            }
            // Short-term focus: weak + developing areas (quick wins)
            if (timeHorizon === '3-months' && (status.level === 'weak' || status.level === 'developing')) {
                priority += 1;
            }
            // Long-term focus: leverage areas (compound growth)
            if (timeHorizon === 'long-term' && status.level === 'strong') {
                priority += 1;
            }

            // Weak areas = Gap opportunities (highest impact)
            if (status.level === 'weak') {
                opportunities.push({
                    title: area.opportunityTitle,
                    whyApplies: area.frictionReason, // Use friction reason but it's still an opportunity
                    whatUnlocks: area.opportunityUnlock,
                    type: 'gap', // New type for gaps
                    priority,
                    team: area.team
                });
            } else if (status.level === 'developing') {
                opportunities.push({
                    title: area.opportunityTitle,
                    whyApplies: area.opportunityWhy,
                    whatUnlocks: area.opportunityUnlock,
                    type: 'immediate',
                    priority,
                    team: area.team
                });
            } else if (status.level === 'strong') {
                opportunities.push({
                    title: area.leverageTitle,
                    whyApplies: area.leverageWhy,
                    whatUnlocks: area.leverageUnlock,
                    type: 'leverage',
                    priority,
                    team: area.team
                });
            }
        });

        // Sort by priority and return all (no limit - show all 6 areas)
        return opportunities.sort((a, b) => b.priority - a.priority);
    }, [systemScores, formData]);

    // ========================================================================
    // UPGRADE #3: Team Assignments (with specific focus areas)
    // ========================================================================
    const teamAssignments = useMemo(() => {
        const assignments = {};

        // Initialize all teams
        Object.keys(TEAMS).forEach(teamKey => {
            assignments[teamKey] = {
                ...TEAMS[teamKey],
                isEngaged: false,
                focusAreas: []
            };
        });

        // Map friction points to team focus areas
        frictionPoints.forEach(friction => {
            const teamKey = friction.team;
            if (assignments[teamKey]) {
                assignments[teamKey].isEngaged = true;
                assignments[teamKey].focusAreas.push(
                    `Address ${friction.title.toLowerCase()}`
                );
            }
        });

        // Map opportunities to team focus areas
        growthOpportunities.forEach(opp => {
            const teamKey = opp.team;
            if (assignments[teamKey]) {
                assignments[teamKey].isEngaged = true;
                const prefix = opp.type === 'leverage' ? 'Scale' : 'Activate';
                assignments[teamKey].focusAreas.push(
                    `${prefix} ${opp.title.toLowerCase()}`
                );
            }
        });

        // Consultation is always engaged for architecture
        assignments.consultation.isEngaged = true;
        if (assignments.consultation.focusAreas.length === 0) {
            assignments.consultation.focusAreas.push('System architecture & strategic alignment');
        }

        // Limit focus areas to 2 per team for readability
        Object.keys(assignments).forEach(key => {
            assignments[key].focusAreas = assignments[key].focusAreas.slice(0, 2);
        });

        return Object.values(assignments);
    }, [frictionPoints, growthOpportunities]);

    // Determine phase priorities
    const phasePriorities = useMemo(() => {
        const p1Active = systemScores.brandClarity <= 3 || systemScores.contentSystem <= 2;
        const p2Active = systemScores.leadGeneration <= 3 || systemScores.conversionSystem <= 3;
        const p3Active = avgScore >= 3;

        return {
            phase1: p1Active,
            phase2: !p1Active && p2Active,
            phase3: !p1Active && !p2Active && p3Active
        };
    }, [systemScores, avgScore]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col h-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-lg font-bold text-white">Your Flo OS Diagnostic</h2>
                        <p className="text-xs text-white/50">Reference: {referenceId}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-8 py-8 space-y-10">

                    {/* Section 1: Readiness Score */}
                    <Section>
                        <ReadinessScore systemScores={systemScores} formData={formData} />
                    </Section>

                    {/* Section 2: Business Snapshot */}
                    <Section>
                        <SectionTitle
                            icon={Building2}
                            title="Business Snapshot"
                            subtitle="Your baseline context as provided"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <SnapshotCard icon={Building2} label="Industry" value={getIndustryLabel(formData.industry)} />
                            <SnapshotCard icon={Clock} label="Years Operating" value={getYearsLabel(formData.yearsInOperation)} />
                            <SnapshotCard icon={Users} label="Team Size" value={getTeamSizeLabel(formData.teamSize)} />
                            <SnapshotCard icon={TrendingUp} label="Monthly Revenue" value={getRevenueLabel(formData.monthlyRevenue)} />
                            <SnapshotCard icon={Target} label="Primary Interest" value={getIntentLabel(formData.primaryIntent)} />
                            <SnapshotCard icon={Clock} label="Time Horizon" value={getTimeHorizonLabel(formData.timeHorizon)} />
                        </div>
                        {formData.primaryOffers && formData.primaryOffers.length > 0 && (
                            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Primary Offers</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.primaryOffers.map((offer, idx) => (
                                        <span key={idx} className="px-3 py-1 text-sm bg-white/10 text-white/80 rounded-full">
                                            {offer}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Section>


                    {/* Section 3: System Health Overview */}
                    <Section>
                        <SectionTitle
                            icon={BarChart3}
                            title="System Health Overview"
                            subtitle="Your current operational baseline"
                        />
                        <p className="text-xs text-white/40 mb-4 italic">
                            Based on your self-assessed maturity ratings across 6 system areas.
                        </p>
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
                            <HealthBar
                                label="Brand & Positioning Clarity"
                                score={systemScores.brandClarity}
                                lowLabel="Unclear"
                                highLabel="Crystal"
                            />
                            <HealthBar
                                label="Content System"
                                score={systemScores.contentSystem}
                                lowLabel="Sporadic"
                                highLabel="Systematic"
                            />
                            <HealthBar
                                label="Lead Generation"
                                score={systemScores.leadGeneration}
                                lowLabel="Dry"
                                highLabel="Flowing"
                            />
                            <HealthBar
                                label="Conversion System"
                                score={systemScores.conversionSystem}
                                lowLabel="Leaky"
                                highLabel="Tight"
                            />
                            <HealthBar
                                label="Data & Performance Visibility"
                                score={systemScores.dataVisibility}
                                lowLabel="Blind"
                                highLabel="Full View"
                            />
                            <HealthBar
                                label="Internal Execution Process"
                                score={systemScores.executionProcess}
                                lowLabel="Chaos"
                                highLabel="Clarity"
                            />
                        </div>

                        {/* Interpretation — now references goals + bottlenecks */}
                        <div className="mt-4 p-4 rounded-xl bg-flo-orange/5 border border-flo-orange/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-flo-orange shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {interpretationText}
                                    </p>
                                    {(formData.growthGoals || []).length > 0 && (
                                        <p className="text-xs text-white/50 mt-2">
                                            Your stated goals — {(formData.growthGoals || []).map(getGoalLabel).join(', ').toLowerCase()} —
                                            {(formData.bottlenecks || []).length > 0
                                                ? ` are compounded by bottlenecks in ${(formData.bottlenecks || []).map(getBottleneckLabel).join(', ').toLowerCase()}.`
                                                : ' inform the priorities below.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Section 4: Growth Opportunities (gaps + immediate only) */}
                    {growthOpportunities.filter(o => o.type !== 'leverage').length > 0 && (
                        <Section>
                            <SectionTitle
                                icon={Sparkles}
                                title="Growth Opportunities Identified"
                                subtitle="Areas where we can help you grow"
                            />
                            <p className="text-xs text-white/40 mb-4 italic">
                                Based on your system maturity gaps, {(formData.growthGoals || []).map(getGoalLabel).join(' & ').toLowerCase() || 'stated goals'},
                                and a {getTimeHorizonLabel(formData.timeHorizon).toLowerCase()} time horizon.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {growthOpportunities
                                    .filter(opp => opp.type !== 'leverage')
                                    .map((opp, idx) => (
                                        <OpportunityCard
                                            key={idx}
                                            title={opp.title}
                                            whyApplies={opp.whyApplies}
                                            whatUnlocks={opp.whatUnlocks}
                                            type={opp.type}
                                        />
                                    ))}
                            </div>
                        </Section>
                    )}

                    {/* Section 5: Strategic Leverage (strong areas) */}
                    {growthOpportunities.filter(o => o.type === 'leverage').length > 0 && (
                        <Section>
                            <SectionTitle
                                icon={ArrowUpRight}
                                title="Your Strategic Leverage"
                                subtitle="Strengths we can amplify for growth"
                            />
                            <p className="text-xs text-white/40 mb-4 italic">
                                These are areas you rated highly — they represent existing strengths to build on.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {growthOpportunities
                                    .filter(opp => opp.type === 'leverage')
                                    .map((opp, idx) => (
                                        <OpportunityCard
                                            key={idx}
                                            title={opp.title}
                                            whyApplies={opp.whyApplies}
                                            whatUnlocks={opp.whatUnlocks}
                                            type={opp.type}
                                        />
                                    ))}
                            </div>
                        </Section>
                    )}


                    {/* Section 6: Teams Engaged */}
                    <Section>
                        <SectionTitle
                            icon={Users}
                            title="Teams Engaged in Your Case"
                            subtitle="Who would be working on your system"
                        />
                        <p className="text-xs text-white/40 mb-4 italic">
                            Team assignments are based on your friction points, growth opportunities, and stated interest in {getIntentLabel(formData.primaryIntent).toLowerCase()}.
                        </p>
                        <div className="space-y-3">
                            {teamAssignments.filter(t => t.isEngaged).map((team, idx) => (
                                <TeamCard
                                    key={idx}
                                    icon={team.icon}
                                    name={team.name}
                                    focusAreas={team.focusAreas}
                                    isEngaged={team.isEngaged}
                                />
                            ))}
                        </div>
                    </Section>

                    {/* Section 7: Fit & Readiness */}
                    <Section>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 space-y-3">
                            <p className="text-white/70 leading-relaxed text-center">
                                Based on your inputs, Flo OS is designed for businesses at your stage
                                that are ready to replace fragmented execution with a structured growth system.
                            </p>
                            {(formData.decisionAuthority || formData.readiness) && (
                                <p className="text-xs text-white/40 text-center">
                                    {formData.decisionAuthority && `You indicated: ${getDecisionLabel(formData.decisionAuthority).toLowerCase()}`}
                                    {formData.decisionAuthority && formData.readiness && ' · '}
                                    {formData.readiness && getReadinessLabel(formData.readiness).toLowerCase()}
                                    {formData.situation && ` · ${getSituationLabel(formData.situation).toLowerCase()}`}
                                </p>
                            )}
                        </div>
                    </Section>

                    {/* Section 9: Next Step CTA */}
                    <Section>
                        <div className="text-center space-y-4 pb-4">
                            <p className="text-sm text-white/50">
                                Ready to discuss your architecture?
                            </p>
                            <button className="px-8 py-4 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-bold shadow-lg shadow-flo-orange/25 hover:shadow-flo-orange/40 transition-all inline-flex items-center gap-3">
                                <span>Book Your Architecture Call</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="text-xs text-white/30">
                                Review this diagnosis with our team • No obligation
                            </p>
                        </div>
                    </Section>

                </div>
            </div>
        </motion.div>
    );
};

export default FloOSDiagnosticReport;
