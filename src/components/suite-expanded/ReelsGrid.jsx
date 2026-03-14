import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ReelCard from './ReelCard';

// Gap between cards in pixels
const GAP = 12;
const COLUMNS_VISIBLE = 3;

const ReelsGrid = () => {
    const reelsData = [
        {
            id: 1,
            title: 'Brand Reveal',
            description: 'Cinematic brand identity unveiling for maximum impact.',
            duration: '0:24',
            poster: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
            videoUrl: '/assets/media/studio/reels/reel-1-1770452555926.mp4'
        },
        {
            id: 2,
            title: 'Product Launch',
            description: 'Dynamic product showcase with premium production quality.',
            duration: '0:18',
            poster: 'linear-gradient(135deg, #16213e 0%, #F1592D 100%)',
            videoUrl: '/assets/media/studio/reels/reel-2-1770408370678.mp4'
        },
        {
            id: 3,
            title: 'BTS Session',
            description: 'Behind-the-scenes look at our creative process.',
            duration: '0:32',
            poster: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
            videoUrl: '/assets/media/studio/reels/reel-3-1770417276088.mp4'
        },
        {
            id: 4,
            title: 'Client Story',
            description: 'Authentic testimonial capturing real results.',
            duration: '0:45',
            poster: 'linear-gradient(135deg, #533483 0%, #e94560 100%)',
            videoUrl: '/assets/media/studio/reels/reel-4-1770417358007.mp4'
        },
        {
            id: 5,
            title: 'Creative Process',
            description: 'Deep dive into our ideation and execution workflow.',
            duration: '0:28',
            poster: 'linear-gradient(135deg, #e94560 0%, #ff7d55 100%)',
            videoUrl: '/assets/media/studio/reels/reel-5-1770417483959.mp4'
        },
        {
            id: 6,
            title: 'Social Highlight',
            description: 'Optimized vertical content for social platforms.',
            duration: '0:15',
            poster: 'linear-gradient(135deg, #F1592D 0%, #1a1a2e 100%)',
            videoUrl: '/assets/media/studio/reels/reel-6-1770419067078.mp4'
        },
        {
            id: 7,
            title: 'Campaign Teaser',
            description: 'High-energy preview building anticipation.',
            duration: '0:21',
            poster: 'linear-gradient(135deg, #ff7d55 0%, #16213e 100%)',
            videoUrl: '/assets/media/studio/reels/reel-7-1770452348511.mp4'
        },
        {
            id: 8,
            title: 'Event Recap',
            description: 'Highlights and key moments from live events.',
            duration: '0:38',
            poster: 'linear-gradient(135deg, #0f3460 0%, #F1592D 100%)',
            videoUrl: '/assets/media/studio/reels/reel-8-1770452639407.mp4'
        }
    ];
    const [scrollIndex, setScrollIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState(null);

    const maxScrollIndex = Math.max(0, reelsData.length - COLUMNS_VISIBLE);
    const showArrows = reelsData.length > COLUMNS_VISIBLE;

    const canScrollLeft = scrollIndex > 0;
    const canScrollRight = scrollIndex < maxScrollIndex;

    const handleScrollLeft = () => {
        if (canScrollLeft) {
            setScrollIndex(prev => prev - 1);
        }
    };

    const handleScrollRight = () => {
        if (canScrollRight) {
            setScrollIndex(prev => prev + 1);
        }
    };

    return (
        <div className="space-y-6">

            {/* Reels Carousel - Viewport Container */}
            <div className="relative">
                {/* Overflow Hidden Viewport */}
                <div className="overflow-hidden rounded-2xl">
                    {/* Sliding Track */}
                    <motion.div
                        className="flex"
                        style={{ gap: `${GAP}px` }}
                        animate={{
                            x: `calc(-${scrollIndex} * (100% / ${COLUMNS_VISIBLE} + ${GAP}px / ${COLUMNS_VISIBLE} * ${COLUMNS_VISIBLE - 1} / ${COLUMNS_VISIBLE}))`
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                    >
                        {reelsData.map((reel) => {
                            const isHovered = hoveredId === reel.id;

                            return (
                                <div
                                    key={reel.id}
                                    className="flex-shrink-0"
                                    style={{
                                        width: `calc((100% - ${GAP * (COLUMNS_VISIBLE - 1)}px) / ${COLUMNS_VISIBLE})`
                                    }}
                                >
                                    <ReelCard
                                        reel={reel}
                                        isHovered={isHovered}
                                        onMouseEnter={() => setHoveredId(reel.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    />
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Navigation Arrows - Absolutely positioned on sides */}
                {showArrows && (
                    <>
                        {/* Left Arrow */}
                        <AnimatePresence>
                            {canScrollLeft && (
                                <motion.button
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={handleScrollLeft}
                                    className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-flo-orange/80 hover:border-flo-orange transition-all duration-300 "
                                    aria-label="Previous reel"
                                >
                                    <ChevronLeft className="w-8 h-8 mr-0.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Right Arrow */}
                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={handleScrollRight}
                                    className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-flo-orange/80 hover:border-flo-orange transition-all duration-300"
                                    aria-label="Next reel"
                                >
                                    <ChevronRight className="w-8 h-8 ml-0.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            {/* Scroll Progress Indicator */}
            {showArrows && (
                <div className="flex justify-center gap-1">
                    {Array.from({ length: maxScrollIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setScrollIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === scrollIndex
                                ? 'w-6 bg-flo-orange'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Go to position ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default ReelsGrid;
