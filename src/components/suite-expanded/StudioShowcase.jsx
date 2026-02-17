import React, { useState, useRef, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ReelsGrid from './ReelsGrid';

import { useSiteContent } from '@/hooks/useSiteContent';

// Showcase content structure (static)
const showcaseStatic = [
    {
        id: 'capture',
        step: '01',
        label: 'Capture',
        title: 'Production',
        description: 'From concept to camera. We capture the raw material that becomes your brand story.',
        poster: 'linear-gradient(135deg, #1a1a1a 0%, #F1592D 50%, #ff7d55 100%)',
    },
    {
        id: 'cut',
        step: '02',
        label: 'Cut',
        title: 'Post-Production',
        description: 'Precision editing, color grading, and motion design that elevates every frame.',
        poster: 'linear-gradient(135deg, #1a1a1a 0%, #F1592D 50%, #ff7d55 100%)',
    },
    {
        id: 'deploy',
        step: '03',
        label: 'Deploy',
        title: 'Delivery',
        description: 'Multi-format export and seamless handoff across all platforms and channels.',
        poster: 'linear-gradient(135deg, #1a1a1a 0%, #F1592D 50%, #ff7d55 100%)',
    }
];

// Shared spring transition for synchronized motion
const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 35,
    mass: 1
};

const StudioShowcase = () => {
    const { content } = useSiteContent();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // Autoplay by default
    const [isMuted, setIsMuted] = useState(true); // Muted by default
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false); // For showing controls on hover
    const videoRef = useRef(null);
    const inactiveVideoRefs = useRef({});

    // Merge static structure with dynamic video URLs
    const showcaseVideos = showcaseStatic.map(item => ({
        ...item,
        videoSrc: content.studio?.showcase?.[item.id] || null
    }));

    // Progress bar update using interval for reliable updates
    useEffect(() => {
        const video = videoRef.current;
        const currentVideo = showcaseVideos[activeIndex];
        if (!video || !currentVideo?.videoSrc) return;

        const updateProgress = () => {
            if (video.duration && video.duration > 0 && !isNaN(video.duration)) {
                const percent = (video.currentTime / video.duration) * 100;
                setProgress(percent || 0);
            }
        };

        // Update progress every 100ms for smooth animation
        const interval = setInterval(updateProgress, 100);

        // Also listen for timeupdate as backup
        video.addEventListener('timeupdate', updateProgress);

        return () => {
            clearInterval(interval);
            video.removeEventListener('timeupdate', updateProgress);
        };
    }, [activeIndex, showcaseVideos]);

    // Auto-play when active card changes or video loads
    useEffect(() => {
        const video = videoRef.current;
        if (video && showcaseVideos[activeIndex]?.videoSrc) {
            video.muted = isMuted;
            video.play().catch(() => { }); // Catch autoplay errors
            setIsPlaying(true);
        }
    }, [activeIndex]);

    // Auto-play inactive videos (muted, looped)
    useEffect(() => {
        showcaseVideos.forEach((v, i) => {
            if (i !== activeIndex && inactiveVideoRefs.current[i]) {
                const vid = inactiveVideoRefs.current[i];
                vid.muted = true;
                vid.play().catch(() => { });
            }
        });
    }, [activeIndex, showcaseVideos]);

    const handleCardClick = (index) => {
        if (index === activeIndex) {
            // Clicking active card toggles play/pause
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.pause();
                } else {
                    videoRef.current.play();
                }
            }
            setIsPlaying(!isPlaying);
        } else {
            // Clicking preview card swaps it to featured
            setIsPlaying(true);
            setProgress(0);
            setActiveIndex(index);
            setIsHovered(true); // Show controls by default when switching cards
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
        setIsMuted(!isMuted);
    };

    const handleProgressClick = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video || !video.duration) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    };

    return (
        <div className="space-y-12">
            {/* Section Header */}
            <div className="flex items-center gap-6 py-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    Work
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center text-center -mt-2 mb-10">
                <span className="text-xl md:text-2xl font-bold text-white mb-1">
                    Cinematic Excellence.
                </span>
                <h3 className="text-5xl md:text-7xl font-black text-flo-orange uppercase tracking-tight leading-none">
                    FEATURED WORK.
                </h3>
            </div>

            {/* Interactive Video Showcase - Unified Layout */}
            <LayoutGroup>
                <div className="flex gap-3 lg:gap-4 h-[320px] md:h-[400px] lg:h-[450px]">
                    {showcaseVideos.map((video, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <motion.div
                                key={video.id}
                                layout
                                layoutId={`video-card-${video.id}`}
                                onClick={() => handleCardClick(index)}
                                onMouseEnter={() => isActive && setIsHovered(true)}
                                onMouseLeave={() => isActive && setIsHovered(false)}
                                transition={springTransition}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${isActive ? 'flex-[6]' : 'flex-none'
                                    }`}
                                style={{
                                    width: isActive ? 'auto' : '60px',
                                    minWidth: isActive ? 0 : '60px',
                                    maxWidth: isActive ? '100%' : '60px'
                                }}
                            >
                                {/* Background/Poster - only show when no video */}
                                {!video.videoSrc && (
                                    <motion.div
                                        layout="position"
                                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                        style={{ background: video.poster }}
                                    />
                                )}

                                {/* Video Element - active card */}
                                {isActive && video.videoSrc && (
                                    <video
                                        ref={videoRef}
                                        src={video.videoSrc}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        loop
                                        muted={isMuted}
                                        playsInline
                                        autoPlay
                                    />
                                )}

                                {/* Video Element - inactive (stacked) cards */}
                                {!isActive && video.videoSrc && (
                                    <video
                                        ref={el => { inactiveVideoRefs.current[index] = el; }}
                                        src={video.videoSrc}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        loop
                                        muted
                                        playsInline
                                        autoPlay
                                    />
                                )}

                                {/* Overlay Gradient */}
                                <motion.div
                                    layout="position"
                                    className={`absolute inset-0 transition-colors duration-300 ${isActive
                                        ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
                                        : 'bg-black/50 group-hover:bg-black/30'
                                        }`}
                                />

                                {/* Border - Accent on active, subtle on inactive */}
                                <motion.div
                                    layout="position"
                                    className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isActive
                                        ? ''
                                        : ''
                                        }`}
                                />

                                {/* Active State Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(241,89,45,0.1)] pointer-events-none" />
                                )}

                                {/* Content - Different layout for active vs inactive */}
                                <div className="absolute inset-0 pt-4 pb-3 px-4 md:pt-6 md:pb-4 md:px-6 flex flex-col">
                                    {isActive ? (
                                        /* ACTIVE CARD CONTENT - Controls only */
                                        <>
                                            {/* Spacer - pushes content to bottom */}
                                            <div className="flex-1" />

                                            {/* Bottom Section - Controls only */}
                                            <div>
                                                {/* Video Controls - Only show on hover */}
                                                {video.videoSrc && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{
                                                            opacity: isHovered ? 1 : 0,
                                                            y: isHovered ? 0 : 10
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                        className="space-y-2"
                                                    >
                                                        {/* Progress Bar */}
                                                        <div
                                                            className="h-2 bg-black/50 cursor-pointer rounded-full overflow-hidden border border-white/20"
                                                            onClick={handleProgressClick}
                                                        >
                                                            <div
                                                                className="h-full bg-[#F1592D] rounded-full transition-[width] duration-200 ease-linear"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>

                                                        {/* Control Buttons Row */}
                                                        <div className="flex items-center justify-between">
                                                            {/* Play/Pause */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCardClick(activeIndex);
                                                                }}
                                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                            >
                                                                {isPlaying ? (
                                                                    <Pause className="w-4 h-4 text-white" />
                                                                ) : (
                                                                    <Play className="w-4 h-4 text-white ml-0.5" />
                                                                )}
                                                            </button>

                                                            {/* Title */}
                                                            <span className="text-xs font-bold text-white truncate mx-3 flex-1">
                                                                {video.label}
                                                            </span>
                                                            {/* Mute/Unmute */}
                                                            <button
                                                                onClick={toggleMute}
                                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                                            >
                                                                {isMuted ? (
                                                                    <VolumeX className="w-4 h-4 text-white" />
                                                                ) : (
                                                                    <Volume2 className="w-4 h-4 text-white" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        /* INACTIVE CARD CONTENT - Vertical Rail Style */
                                        <>
                                            {/* Step Chip - Top */}
                                            <motion.span
                                                layout="position"
                                                className="inline-flex self-center items-center px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider"
                                            >
                                                {video.step}
                                            </motion.span>

                                            {/* Vertical Label - Center */}
                                            <div className="flex-1 flex items-center justify-center">
                                                <motion.span
                                                    layout="position"
                                                    className="text-sm md:text-base font-black text-white uppercase tracking-widest [writing-mode:vertical-rl] rotate-180"
                                                >
                                                    {video.label}
                                                </motion.span>
                                            </div>

                                            {/* Expand Hint - Bottom */}
                                            <motion.div
                                                layout="position"
                                                className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-flo-orange/80 flex items-center justify-center">
                                                    <Play className="w-3 h-3 text-white ml-0.5" />
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </LayoutGroup>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 -mt-4">
                {showcaseVideos.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setIsPlaying(false);
                            setActiveIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex
                            ? 'w-6 bg-flo-orange'
                            : 'bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to video ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Reels Grid Section */}
            <ReelsGrid />
        </div>
    );
};

export default StudioShowcase;
