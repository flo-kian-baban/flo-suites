import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VideoWithPlaceholder = React.forwardRef(({
    src,
    className = "",
    containerClassName = "",
    poster,
    ...props
}, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoadedData = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`relative overflow-hidden bg-white/[0.02] ${containerClassName}`}>
            {/* Loading Placeholder */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-white/[0.05] backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-flo-orange animate-spin opacity-80" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Element */}
            <video
                ref={ref}
                src={src}
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                onLoadedData={handleLoadedData}
                onError={handleError}
                poster={poster}
                {...props}
            />

            {/* Fallback for error state if needed, though rarely shown for background videos */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white/50 text-xs">
                    Failed to load video
                </div>
            )}
        </div>
    );
});

VideoWithPlaceholder.displayName = 'VideoWithPlaceholder';

export default VideoWithPlaceholder;
