import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import SuiteHeader from './SuiteHeader';
import TeamCard from './TeamCard';
import CapabilitiesGrid from './CapabilitiesGrid';
import MarketingFunnel from './MarketingFunnel';
import DevSolutionsSection from './DevSolutionsSection';
import StudioProcessStrip from './StudioProcessStrip';
import ProcessSteps from './ProcessSteps';
import StudioShowcase from './StudioShowcase';
import ScrollTimeline from './ScrollTimeline';
import EngagementInvestment from './EngagementInvestment';
import StudioBookingSection from './StudioBookingSection';

import SuiteCTA from './SuiteCTA';
import KnowledgeGrid from './KnowledgeGrid';
import { usePosts } from '@/hooks/usePosts';
import { useSiteContent } from '@/hooks/useSiteContent';

const SuiteExpandedLayout = ({ suite, onClose }) => {
    const { teamPage, title, expandedContent, id } = suite;
    const { content } = useSiteContent();
    const headerVideo = content.suites?.[id]?.headerVideo;



    // Determine CMS post type based on suite ID
    const postType = id === 'marketing' ? 'blog' : id === 'dev' ? 'case_study' : undefined;
    const { posts } = usePosts(postType);

    // Map DB posts (snake_case) to Frontend components (camelCase)
    const displayArticles = posts.map(p => ({
        ...p,
        id: p.slug, // Use slug as ID for routing/keys
        coverImage: p.cover_image,
        readingTime: p.reading_time,
        body: p.content
    }));

    if (!teamPage) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            className="absolute inset-0 flex flex-col bg-[#0A0A0A] text-white overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-flo-orange/5 rounded-full blur-[140px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            {/* Top Nav (Reusing style from OfferExpandedView for consistency) */}
            <div className="flex items-center justify-between px-8 py-6 z-30 shrink-0 bg-black/40 backdrop-blur-3xl border-b border-white/20 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-white/20 rounded-full" /> {/* Neutral indicator for suites */}
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white/90">{title}</h2>
                        <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Team Suite</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 pb-12 z-10">
                <div className="max-w-5xl mx-auto space-y-16 pt-10 pb-8">

                    {/* Header + Team Section */}
                    <motion.div variants={itemVariants} className="space-y-10">
                        <SuiteHeader
                            title={title}
                            tagline={teamPage.tagline}
                            summary={teamPage.summary}
                            outcomes={teamPage.outcomes}
                            videoUrl={headerVideo}
                        />
                        <TeamCard team={teamPage.team} />
                        {id === 'marketing' && (
                            <CapabilitiesGrid capabilities={teamPage.capabilities} hideHeader />
                        )}
                    </motion.div>

                    {/* Capabilities / Process Strip (non-marketing suites) */}
                    {id !== 'marketing' && (
                        <motion.div variants={itemVariants}>
                            {id === 'studio' ? (
                                <StudioProcessStrip />
                            ) : id === 'dev' ? (
                                <DevSolutionsSection />
                            ) : (
                                <CapabilitiesGrid capabilities={teamPage.capabilities} />
                            )}
                        </motion.div>
                    )}

                    {/* Scroll-Activated Timeline (check both teamPage and expandedContent) */}
                    {(teamPage?.timeline || expandedContent?.timeline) && (
                        <motion.div variants={itemVariants}>
                            <ScrollTimeline
                                steps={teamPage?.timeline || expandedContent.timeline}
                                eyebrow={id === 'marketing' ? "Architecture" : undefined}
                                title={id === 'marketing' ? "Strategic Foundation." : undefined}
                                highlightTitle={id === 'marketing' ? "THE ARCHITECTURE." : undefined}
                            />
                        </motion.div>
                    )}

                    {/* Marketing Funnel — only for marketing suite */ id === 'marketing' && (
                        <div className="space-y-16">
                            <motion.div variants={itemVariants}>
                                <MarketingFunnel />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <KnowledgeGrid articles={displayArticles} suiteId="marketing" />
                            </motion.div>
                        </div>
                    )}

                    {/* Process Section - Studio gets interactive showcase, Dev/Others get Knowledge Grid or Process */}
                    {id === 'studio' ? (
                        <motion.div variants={itemVariants}>
                            <StudioShowcase />
                        </motion.div>
                    ) : id === 'dev' ? (
                        <motion.div variants={itemVariants}>
                            <KnowledgeGrid
                                articles={displayArticles}
                                suiteId="dev"
                                title="Project Case Studies"
                            />
                        </motion.div>
                    ) : id !== 'marketing' && (
                        <motion.div variants={itemVariants}>
                            <ProcessSteps steps={teamPage.process} />
                        </motion.div>
                    )}

                    {/* Engagement Investment & Results (if expandedContent has investment/value data) */}
                    {(expandedContent?.investment || expandedContent?.valueDelivered) && (
                        <motion.div variants={itemVariants}>
                            <EngagementInvestment
                                investment={expandedContent.investment}
                                outcomes={expandedContent.valueDelivered?.items}
                            />
                        </motion.div>
                    )}

                    {/* Studio Booking Section */}
                    {id === 'studio' && (
                        <motion.div variants={itemVariants}>
                            <StudioBookingSection />
                        </motion.div>
                    )}

                </div>
            </div>

            {/* Footer CTA */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <SuiteCTA suiteName={title} suiteId={id} />
            </motion.div>
        </motion.div>
    );
};

export default SuiteExpandedLayout;
