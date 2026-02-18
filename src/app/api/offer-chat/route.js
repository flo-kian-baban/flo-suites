import { NextResponse } from 'next/server';

const OFFER_KNOWLEDGE = {
    flo_os: {
        title: 'Flo OS',
        whatItIs: 'Flo OS is a business growth operating system. It aligns your brand, content, distribution, and conversion into one synchronized organism — replacing the chaos of disconnected vendors with a single operating layer for growth.',
        whatYouGet: 'You get clear growth direction, structured execution across all channels, reduced randomness, compounding results over time, a single operating layer that connects everything, and decision-making clarity.',
        pricing: 'Flo OS is a system-level engagement. Pricing is structured around the scope of your ecosystem and the number of active suites. Book a call to discuss your specific needs and get a tailored proposal.',
        timeline: 'Month 1 is Architecture — business positioning, offer clarity, and growth priorities. Month 2 is System Activation — content systems, funnels, distribution, and workflows. Month 3+ is Optimization & Compounding — iteration, refinement, and scaling.',
        whoFor: 'Businesses tired of disconnected marketing. Founders who want systems, not tactics. Teams ready for long-term growth. Companies investing in clarity and scale.',
    },
    funnel_builder: {
        title: 'Funnel Builder',
        whatItIs: 'Funnel Builder is a dedicated service to build high-converting paths for specific offers. We design, build, and connect the entire journey from click to close — a structured conversion system that turns attention into leads or actions.',
        whatYouGet: 'You get lead generation or conversion infrastructure, clear measurable outcomes, an optimized customer journey, reusable conversion assets, complete tracking and analytics, and a scalable campaign foundation.',
        pricing: 'Funnel Builder is a purposeful engagement scoped around your specific offer or campaign. Pricing depends on the complexity of the funnel and the number of touchpoints. Book a call to get a proposal.',
        timeline: 'Week 1 is Offer Definition — goal clarity and target audience alignment. Week 2 is Journey Design — mapping the complete customer path. Weeks 3–4 are Build & Connect — landing pages, creative assets, tracking, and automation.',
        whoFor: 'Businesses launching a new offer, scaling an existing service, adding conversion to existing traffic, or needing results — not just visibility.',
    },
    media_marketing: {
        title: 'Media Marketing',
        whatItIs: 'Media Marketing is a content and distribution engine. We combine high-velocity content production with strategic distribution to keep your brand consistently visible, relevant, and top-of-mind for your ideal customers.',
        whatYouGet: 'You get consistent brand presence across channels, regular high-quality content output, data-driven distribution, performance tracking and optimization, and growing organic and paid reach.',
        pricing: 'Media Marketing is an ongoing monthly service. Pricing is based on content volume, platform coverage, and whether paid media management is included. Book a call to discuss your growth goals.',
        timeline: 'Each month follows a cycle: Content Planning (themes, angles, targets) → Production (platform-appropriate creative) → Distribution (publishing and optimization) → Performance Review (data-driven iteration).',
        whoFor: 'Brands that need consistent visibility, businesses scaling content production, teams without in-house creative capacity, and companies ready to invest in sustained growth.',
    },
};

const KEYWORD_MAP = [
    { keywords: ['get', 'include', 'deliver', 'receive', 'come with'], field: 'whatYouGet' },
    { keywords: ['price', 'pricing', 'cost', 'much', 'pay', 'investment', 'budget'], field: 'pricing' },
    { keywords: ['timeline', 'long', 'time', 'when', 'duration', 'start', 'schedule', 'week', 'month'], field: 'timeline' },
    { keywords: ['who', 'for me', 'right for', 'fit', 'good for', 'ideal'], field: 'whoFor' },
    { keywords: ['what is', 'what\'s', 'about', 'explain', 'tell me', 'overview', 'describe'], field: 'whatItIs' },
];

function findBestMatch(message, knowledge) {
    const lower = message.toLowerCase();

    for (const { keywords, field } of KEYWORD_MAP) {
        if (keywords.some(kw => lower.includes(kw))) {
            return knowledge[field];
        }
    }

    return null;
}

export async function POST(request) {
    try {
        const { offerKey, message } = await request.json();

        if (!message || !offerKey) {
            return NextResponse.json(
                { error: 'Both offerKey and message are required.' },
                { status: 400 }
            );
        }

        const knowledge = OFFER_KNOWLEDGE[offerKey];
        if (!knowledge) {
            return NextResponse.json(
                { error: `Unknown offer: ${offerKey}` },
                { status: 400 }
            );
        }

        const matched = findBestMatch(message, knowledge);

        const reply = matched
            ? matched
            : `Great question! Here's a quick overview of ${knowledge.title}: ${knowledge.whatItIs}`;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Offer Chat Error:', error);
        return NextResponse.json({
            reply: "I'd be happy to help — could you rephrase your question?",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}
