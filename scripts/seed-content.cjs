const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const samplePosts = [
    // Marketing Blogs (6)
    {
        type: 'blog',
        title: 'The Future of Video Marketing in 2026',
        slug: 'future-video-marketing-2026',
        category: 'Marketing',
        cover_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        description: 'Why short-form video is dominating the digital landscape and how brands can adapt.',
        reading_time: '5 min read',
        published: true,
        content: {
            intro: "Video marketing is no longer just a tactic for awareness—it's the primary language of the modern internet. As we look toward 2026, the brands winning are those that treat video as a continuous conversation, not a one-off campaign.",
            sections: [
                {
                    heading: "The Shift to Algorithmic Discovery",
                    content: "Social platforms have evolved from social graphs (who you know) to interest graphs (what you like). This means your content is competing on its own merit, not just your follower count.",
                    bullets: [
                        " content must hook instantly",
                        "Production value signals authority",
                        "Frequency feeds the algorithm"
                    ]
                },
                {
                    heading: "Short-Form is the New Homepage",
                    content: "For many users, TikTok and Reels are the first touchpoint. They won't visit your website until they've consumed 3-5 pieces of vertical video content."
                }
            ],
            keyTakeaways: [
                "Prioritize vertical video for top-of-funnel",
                "Invest in high-velocity production",
                "Measure retention, not just views"
            ],
            floApplication: "We use high-frequency short-form video to build retargeting pools effectively."
        }
    },
    {
        type: 'blog',
        title: 'Optimizing Your Funnel for Conversion',
        slug: 'optimizing-funnel-conversion',
        category: 'Strategy',
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        description: 'Strategies to turn visitors into loyal customers using targeted video content.',
        reading_time: '7 min read',
        published: true,
        content: {
            intro: "A funnel is only as good as its weakest link. You can drive all the traffic in the world, but if your conversion mechanics are broken, you're just burning cash.",
            sections: [
                {
                    heading: "Frictionless Journeys",
                    content: "Every click costs you 50% of your traffic. The best funnels reduce the number of steps between interest and action."
                },
                {
                    heading: "Trust Mechanics",
                    content: "Social proof, case studies, and clear value propositions are the oil that keeps the funnel moving."
                }
            ],
            keyTakeaways: [
                "Reduce click depth",
                "Add video social proof at checkout",
                "Simplify your offer"
            ],
            floApplication: "Our funnels are architected to minimize friction and maximize trust signals."
        }
    },
    {
        type: 'blog',
        title: 'Behind the Scenes: High-End Production',
        slug: 'bts-high-end-production',
        category: 'Production',
        cover_image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop',
        description: 'What goes into a premium commercial shoot? A look at our studio workflow.',
        reading_time: '4 min read',
        published: true,
        content: {
            intro: "Lighting, camera, action - but first, planning. 80% of production value happens before we even roll camera. Pre-production is the secret sauce.",
            sections: [
                {
                    heading: "The Treatment",
                    content: "We never shoot without a visual treatment. This ensures the client, director, and DP are all visualizing the same film."
                },
                {
                    heading: "On Set Efficiency",
                    content: "Time is money. Our sets run on military precision to ensure we get the coverage we need without burning out the talent."
                }
            ],
            keyTakeaways: [
                "Pre-production saves budget",
                "Storyboards are non-negotiable",
                " Lighting makes the look"
            ],
            floApplication: "Our Studio team spends 2 days in pre-prod for every 1 day on set."
        }
    },
    {
        type: 'blog',
        title: 'Data-Driven Creative Decisions',
        slug: 'data-driven-creative',
        category: 'Analytics',
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        description: 'How analytics should inform your creative strategy for maximum ROI.',
        reading_time: '6 min read',
        published: true,
        content: {
            intro: "Creativity without data is just art. Marketing needs both. We use performance loops to inform our creative direction.",
            sections: [
                {
                    heading: "The Feedback Loop",
                    content: "We launch, we measure, we iterate. The data tells us which hooks work, which angles resonate, and where viewers drop off."
                }
            ],
            keyTakeaways: [
                "Test variables in isolation",
                "Let data dictate creative direction",
                "Iterate weekly"
            ],
            floApplication: "Marketing feeds performance data back to Studio to refine future shoots."
        }
    },
    {
        type: 'blog',
        title: 'Building a Brand Voice on Social Media',
        slug: 'building-brand-voice',
        category: 'Branding',
        cover_image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop',
        description: 'Consistency is key. How to maintain your brand identity across platforms.',
        reading_time: '5 min read',
        published: true,
        content: {
            intro: "Your brand voice is your personality online. It needs to be distinct, consistent, and authentic to cut through the noise.",
            sections: [
                {
                    heading: "Defining the Persona",
                    content: "Are you the helpful expert? The bold challenger? The luxury curator? Pick a lane and own it."
                }
            ],
            keyTakeaways: [
                "Consistency builds trust",
                "Tone matters more than topic",
                "Engage, don't just broadcast"
            ],
            floApplication: "We build brand bibles for every client to ensure voice consistency."
        }
    },
    {
        type: 'blog',
        title: 'The ROI of Premium Content',
        slug: 'roi-premium-content',
        category: 'Business',
        cover_image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
        description: 'Why investing in high-quality production pays off in the long run.',
        reading_time: '8 min read',
        published: true,
        content: {
            intro: "Quality signals trust. In a crowded market, premium production value is a shortcut to credibility. Ideally, your content should look more expensive than your product.",
            sections: [
                {
                    heading: "Perceived Value",
                    content: "If your marketing looks cheap, customers assume your product is cheap. Premium content allows for premium pricing."
                }
            ],
            keyTakeaways: [
                "Quality builds authority",
                "Trust drives conversion",
                "Brand equity compounds"
            ],
            floApplication: "We invest heavily in cinema optics to give our clients a premium edge."
        }
    },

    // Development Case Studies (3)
    {
        type: 'case_study',
        title: 'E-Commerce Platform Scale-Up',
        slug: 'ecommerce-scale-up',
        category: 'E-Commerce',
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
        description: 'Scaling a Shopify store to handle 10k concurrent users with custom headless architecture.',
        reading_time: '10 min read',
        published: true,
        content: {
            intro: "The challenge was clear: stability at scale. Our client was crashing during drops. We rebuilt their infrastructure to be unshakeable.",
            sections: [
                {
                    heading: "The Technical Solution",
                    content: "We moved from a monolithic theme to a headless Next.js frontend deployed on Vercel edge network, decoupling the storefront from the backend inventory logic."
                },
                {
                    heading: "Results",
                    content: "Zero downtime during Black Friday. 300% increase in load speed. 15% bump in conversion rate."
                }
            ],
            keyTakeaways: [
                "Headless improves speed",
                "Edge caching is critical",
                "UX drives revenue"
            ],
            floApplication: "We build all high-volume e-com sites on headless stacks."
        }
    },
    {
        type: 'case_study',
        title: 'FinTech App Security Overhaul',
        slug: 'fintech-security-overhaul',
        category: 'FinTech',
        cover_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop',
        description: 'Implementing biometric auth and encryptions for a next-gen banking app.',
        reading_time: '8 min read',
        published: true,
        content: {
            intro: "Security cannot compromise user experience. We implemented biometric login that feeels magic but is fortress-secure.",
            sections: [
                {
                    heading: "Encryption Standards",
                    content: "AES-256 encryption for all data at rest. TLS 1.3 for data in transit. We don't take chances with financial data."
                }
            ],
            keyTakeaways: [
                "Security first",
                "UX second",
                "Trust is everything"
            ],
            floApplication: "Dev team adheres to ISO 27001 standards."
        }
    },
    {
        type: 'case_study',
        title: 'AI-Powered Content Engine',
        slug: 'ai-content-engine',
        category: 'AI / ML',
        cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop',
        description: 'Building a custom LLM integration for automated marketing copy generation.',
        reading_time: '6 min read',
        published: true,
        content: {
            intro: "Automation should empower, not replace. We built a tool that generates 80% of the draft, leaving the final 20% for human polish.",
            sections: [
                {
                    heading: "The Stack",
                    content: "OpenAI GPT-4 Turbo API connected to a custom vector database of the brand's past high-performing copy."
                }
            ],
            keyTakeaways: [
                "AI as a co-pilot",
                "Context windows matter",
                "Proprietary data is the moat"
            ],
            floApplication: "We use this engine internally to speed up our own copywriting."
        }
    }
];

async function seed() {
    console.log('🌱 Seeding specific content structure...');

    for (const post of samplePosts) {
        const { data, error } = await supabase
            .from('posts')
            .upsert({
                ...post,
                updated_at: new Date().toISOString()
            }, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error(`❌ Failed to insert ${post.title}:`, error.message);
        } else {
            console.log(`✅ Upserted: ${post.title}`);
        }
    }

    console.log('✨ Seeding complete!');
}

seed();
