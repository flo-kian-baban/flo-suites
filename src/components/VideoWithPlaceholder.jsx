import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const VideoWithPlaceholder = React.forwardRef(({
    src,
    className = "",
    containerClassName = "",
    poster,
    ...props
}, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    const handleReady = useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
    }, []);

    const handleRetry = useCallback(() => {
        setHasError(false);
        setIsLoading(true);
        setRetryKey(k => k + 1);
    }, []);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Shimmer Loader */}
            <AnimatePresence>
                {isLoading && !hasError && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 z-10 bg-[#141414]"
                    >
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 60%, transparent 100%)',
                                    animation: 'shimmer 2s ease-in-out infinite',
                                }}
                            />
                        </div>
                        {/* Subtle border inset */}
                        <div className="absolute inset-0 border border-white/[0.04] rounded-[inherit]" />
                        {/* Centered loading label */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-medium text-white/20 tracking-widest uppercase">Loading</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Fallback */}
            {hasError && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#141414] border border-white/[0.04] rounded-[inherit]">
                    <span className="text-[12px] text-white/25 tracking-wide">Video unavailable</span>
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:border-flo-orange/30 hover:bg-white/[0.08] text-white/50 hover:text-white/70 transition-all duration-200 text-[11px] font-medium"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                    </button>
                </div>
            )}

            {/* Video Element */}
            <video
                key={retryKey}
                ref={ref}
                src={src}
                className={`w-full h-full object-cover transition-opacity duration-300 ease-out ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} ${className}`}
                onLoadedData={handleReady}
                onCanPlay={handleReady}
                onError={handleError}
                poster={poster}
                {...props}
            />

            {/* Shimmer keyframes (injected once) */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
});

VideoWithPlaceholder.displayName = 'VideoWithPlaceholder';

export default VideoWithPlaceholder;
