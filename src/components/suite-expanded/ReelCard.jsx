import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const ReelCard = ({ reel, isHovered, onMouseEnter, onMouseLeave }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);

    const hasVideo = !!reel.videoUrl;

    // Update progress bar using interval for reliable updates
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !hasVideo) return;

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
    }, [hasVideo]);

    // Handle play/pause
    const togglePlay = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle mute/unmute
    const toggleMute = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    };

    return (
        <motion.div
            className="relative aspect-[9/16] rounded-xl overflow-hidden"
            style={{
                transformOrigin: 'center center',
                isolation: 'isolate'
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            animate={{
                scale: isHovered ? 1.0 : 1
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
            }}
        >
            {/* Video or Poster Background */}
            {hasVideo ? (
                <video
                    ref={videoRef}
                    src={reel.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                />
            ) : (
                <motion.div
                    className="absolute inset-0"
                    style={{ background: reel.poster }}
                    animate={{
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Glass Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                animate={{
                    opacity: isHovered ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Duration Chip */}
            <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                    {reel.duration}
                </span>
            </div>

            {/* Play Icon for empty slots */}
            {!hasVideo && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isHovered ? 1 : 0.6 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                </motion.div>
            )}

            {/* Video Controls - Only show for videos on hover */}
            {hasVideo && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 z-20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Progress Bar - Click to seek */}
                    <div
                        className="h-2 bg-black/50 cursor-pointer mx-4 rounded-full overflow-hidden border border-white/20"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-[#F1592D] rounded-full transition-[width] duration-200 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
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
                            {reel.title}
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

            {/* Bottom Content - Title (only for non-video or non-hovered) */}
            {(!hasVideo || !isHovered) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h4 className="text-sm font-bold text-white truncate">
                        {reel.title}
                    </h4>
                    <motion.p
                        className="text-xs text-white/70 leading-relaxed mt-1 line-clamp-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            height: isHovered ? 'auto' : 0
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {reel.description}
                    </motion.p>
                </div>
            )}

            {/* Border */}
            <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
        </motion.div>
    );
};

export default ReelCard;
