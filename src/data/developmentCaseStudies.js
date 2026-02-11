export const developmentCaseStudies = [
    {
        id: 'fintech-dashboard-react',
        title: 'Modernizing Fintech UI',
        description: 'Rebuilding a legacy financial dashboard with Next.js for 400% faster data visualization.',
        coverImage: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
        readingTime: 'Case Study',
        category: 'SaaS Dev',
        body: {
            intro: 'The client, a mid-sized fintech firm, was struggling with a jQuery-based dashboard that took 8+ seconds to load. We rebuilt the core infrastructure using React and Next.js.',
            sections: [
                {
                    heading: 'The Challenge',
                    content: 'Users were abandoning the platform due to laggy interaction times. The monolithic backend was tightly coupled with the frontend, making feature updates risky and slow.'
                },
                {
                    heading: 'The Solution',
                    content: 'We decoupled the frontend, implementing a headless architecture. We used TanStack Query for efficient server state management and AG Grid for high-performance data tables handling millions of rows.'
                }
            ],
            keyTakeaways: [
                'Reduced load time from 8s to 1.2s.',
                'Implemented real-time WebSocket data updates.',
                'Modular component system for faster future dev.'
            ],
            floApplication: 'We apply this same performant architecture to all our dashboard builds, ensuring your data tools never slow your business down.'
        }
    },
    {
        id: 'ecommerce-headless-shopify',
        title: 'Headless E-Commerce Scale',
        description: 'Migrating a $50M/yr brand to Shopify Hydrogen for ultimate customizability.',
        coverImage: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
        readingTime: 'Case Study',
        category: 'E-Commerce',
        body: {
            intro: 'Standard Shopify themes were limiting this luxury brand\'s ability to create immersive storytelling experiences. They needed the power of Shopify with the freedom of custom code.',
            sections: [
                {
                    heading: 'The Challenge',
                    content: 'The brand wanted "scrollytelling" product pages that mixed rich video content with purchasing functionality. Liquid themes broke under the weight of these assets.'
                },
                {
                    heading: 'The Solution',
                    content: 'We built a bespoke headless storefront using Shopify Hydrogen (React) and Sanity CMS. This allowed marketing to build complex layouts while inventory remained synced perfectly with Shopify.'
                }
            ],
            keyTakeaways: [
                '30% increase in conversion rate.',
                'Seamless 3D product previews.',
                'Global CDN deployment for sub-second page loads.'
            ],
            floApplication: 'We bridge the gap between content and commerce, building stores that feel like experiences, not catalogs.'
        }
    },
    {
        id: 'mobile-app-fitness',
        title: 'Cross-Platform Fitness App',
        description: 'Launching a React Native app for iOS and Android in 12 weeks.',
        coverImage: 'linear-gradient(135deg, #d63031 0%, #ff7675 100%)',
        readingTime: 'Case Study',
        category: 'Mobile App',
        body: {
            intro: 'A fitness influencer needed a companion app for their program. Native development was too expensive and slow. We chose React Native to hit both platforms simultaneously.',
            sections: [
                {
                    heading: 'The Challenge',
                    content: 'The app needed complex offline sync capabilities so users could track workouts in gyms without service, then sync when back online.'
                },
                {
                    heading: 'The Solution',
                    content: 'We utilized WatermelonDB for local-first architectural, ensuring the app felt instant regardless of network status. Background sync jobs handled the data consistency seamlessly.'
                }
            ],
            keyTakeaways: [
                'Shared 95% of code between iOS and Android.',
                'Offline-first architecture.',
                'Integrated Apple Health and Google Fit.'
            ],
            floApplication: '我们 build mobile experiences that feel truly native, without the double cost of maintaining two separate codebases.'
        }
    }
];
