import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SuiteTile from './SuiteTile';
import { suites } from '../data/suites';

const BentoGrid = ({ expandedSuite, onTileClick, onClose }) => {
    const isAnyExpanded = expandedSuite !== null;
    const [hoveredId, setHoveredId] = useState(null);

    // Track Animation Config
    // EXPANDED_WEIGHT: Size of the expanded tile tracks (e.g. 100fr)
    // COLLAPSED_WEIGHT: Size of the compressed tile tracks (e.g. 0.0001fr to be effectively zero)
    const EXPANDED_WEIGHT = 100;
    const COLLAPSED_WEIGHT = 0.0001;

    // Reset hovered state when expansion changes to prevent stuck states
    React.useEffect(() => {
        setHoveredId(null);
    }, [expandedSuite]);

    // Generate dynamic grid definition
    const gridDefinition = useMemo(() => {
        // Default 12-col x 8-row uniform grid
        const cols = Array(12).fill('1fr');
        const rows = Array(8).fill('1fr');

        if (expandedSuite) {
            const { colStart, colSpan, rowStart, rowSpan } = expandedSuite.gridConfig;

            // Calculate target weights
            // Expanded tracks get EXPANDED_WEIGHT
            // Other tracks get COLLAPSED_WEIGHT

            // Update Columns
            for (let i = 0; i < 12; i++) {
                // i+1 because grid is 1-based, config is 1-based
                const colIndex = i + 1;
                if (colIndex >= colStart && colIndex < colStart + colSpan) {
                    cols[i] = `${EXPANDED_WEIGHT}fr`;
                } else {
                    cols[i] = `${COLLAPSED_WEIGHT}fr`;
                }
            }

            // Update Rows
            for (let i = 0; i < 8; i++) {
                const rowIndex = i + 1;
                if (rowIndex >= rowStart && rowIndex < rowStart + rowSpan) {
                    rows[i] = `${EXPANDED_WEIGHT}fr`;
                } else {
                    rows[i] = `${COLLAPSED_WEIGHT}fr`;
                }
            }
        }

        return {
            gridTemplateColumns: cols.join(' '),
            gridTemplateRows: rows.join(' '),
            gap: expandedSuite ? 0 : '1rem' // Animate gap to 0 to remove unused space
        };
    }, [expandedSuite]);

    // Relationship Logic
    const getRelatedIds = (id) => {
        if (id === 'media-marketing') return ['studio', 'marketing'];
        if (id === 'Funnel Builder') return ['studio', 'marketing', 'dev'];
        if (id === 'connex') return ['marketing', 'dev'];
        if (id === 'flo-os') return suites.map(s => s.id).filter(sid => sid !== 'flo-os');
        return [];
    };

    const relatedIds = useMemo(() => {
        if (!hoveredId || isAnyExpanded) return [];
        return getRelatedIds(hoveredId);
    }, [hoveredId, isAnyExpanded]);

    // Calculate the type of the hovered suite
    const hoveredType = useMemo(() => {
        if (!hoveredId || isAnyExpanded) return null;
        const hoveredSuite = suites.find(s => s.id === hoveredId);
        return hoveredSuite?.type || null;
    }, [hoveredId, isAnyExpanded]);

    return (
        <div className="w-full h-full p-4 relative overflow-hidden">
            {/* 
        The Physical Constraint Grid 
        We animate the track definitions themselves.
      */}
            <motion.div
                className="h-full w-full grid gap-4 relative z-0"
                initial={false}
                animate={gridDefinition}
                transition={{
                    duration: 0.7,
                    ease: [0.2, 0, 0, 1] // Aggressive push
                }}
            >
                {suites.map((suite) => {
                    const isSelected = expandedSuite?.id === suite.id;
                    const isOtherSelected = isAnyExpanded && !isSelected;
                    const isHovered = hoveredId === suite.id;
                    const isRelated = relatedIds.includes(suite.id);

                    // Determine Highlight Mode: 'active' (hovered), 'related', or 'none'
                    // If expanded, disable hover highlights to avoid visual noise
                    const highlightMode = (isAnyExpanded) ? 'none' : (isHovered ? 'active' : (isRelated ? 'related' : 'none'));

                    return (
                        <SuiteTile
                            key={suite.id}
                            suite={suite}
                            isSelected={isSelected}
                            isOtherSelected={isOtherSelected}
                            highlightMode={highlightMode}
                            hoveredType={hoveredType}
                            onMouseEnter={() => setHoveredId(suite.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => {
                                if (isSelected) return; // Don't re-trigger
                                onTileClick(suite);
                            }}
                            onClose={(e) => {
                                e?.stopPropagation();
                                onClose();
                            }}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
};

export default BentoGrid;
