import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import BentoGrid from './components/BentoGrid';
import IntroOverlay from './components/IntroOverlay';

function App() {
    const [expandedSuite, setExpandedSuite] = useState(null);

    // Intro state machine: 'intro' → 'tilesIn'
    // Check prefers-reduced-motion to skip animation
    const [phase, setPhase] = useState(() => {
        if (typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return 'tilesIn';
        }
        return 'intro';
    });

    const handleIntroComplete = () => {
        setPhase('tilesIn');
    };

    // Handle ESC key to close expanded tile
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && expandedSuite) {
                setExpandedSuite(null);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [expandedSuite]);

    const handleTileClick = (suite) => {
        setExpandedSuite(suite);
    };

    const handleClose = () => {
        setExpandedSuite(null);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#111111]">
            <BentoGrid
                expandedSuite={expandedSuite}
                onTileClick={handleTileClick}
                onClose={handleClose}
                tilesReady={phase === 'tilesIn'}
            />
            <AnimatePresence>
                {phase === 'intro' && (
                    <IntroOverlay onComplete={handleIntroComplete} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
