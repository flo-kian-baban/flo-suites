import React, { useState, useEffect } from 'react';
import BentoGrid from './components/BentoGrid';

function App() {
    const [expandedSuite, setExpandedSuite] = useState(null);

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
            />
        </div>
    );
}

export default App;
