import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfferExpandedView from './OfferExpandedView';
import AboutFloChat from './AboutFloChat';
import { Sparkles, X, Maximize2, ArrowRight, ExternalLink, Send } from 'lucide-react';
const floLogo = '/assets/FLO.png';
const osLogo = '/assets/OS.png';
const connexLogo = '/assets/Connex2.png';

const SuiteTile = ({ suite, isSelected, isOtherSelected, onClick, onClose, highlightMode = 'none', hoveredType, onMouseEnter, onMouseLeave }) => {
    const isCenterpiece = suite.isCenterpiece;
    const tileRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const closingTimerRef = useRef(null);
    const prevIsSelected = useRef(isSelected);

    // Track when tile is closing to keep dark during animation, then revert to default
    useEffect(() => {
        // When tile transitions from selected to not selected (closing)
        if (prevIsSelected.current && !isSelected) {
            setIsClosing(true);

            // Clear any existing timer
            if (closingTimerRef.current) {
                clearTimeout(closingTimerRef.current);
            }

            // Reset closing state after animation completes (800ms > 700ms animation)
            closingTimerRef.current = setTimeout(() => {
                setIsClosing(false);
            }, 800);
        }

        prevIsSelected.current = isSelected;

        return () => {
            if (closingTimerRef.current) {
                clearTimeout(closingTimerRef.current);
            }
        };
    }, [isSelected]);

    // Handle mouse enter - don't reset isClosing here to prevent issues
    const handleMouseEnterWrapper = () => {
        onMouseEnter?.();
    };

    // Mouse Follow Logic (Subtle and only when needed)
    const handleMouseMove = (e) => {
        if (!tileRef.current) return;
        const rect = tileRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tileRef.current.style.setProperty('--mouse-x', `${x}px`);
        tileRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    // Determine visual styles based on Highlight Mode
    // For offer tiles, don't suppress during closing to maintain dark background
    const isOfferTile = suite.type === 'offer';
    const shouldSuppressHighlight = isClosing && !isOfferTile;
    const isActive = highlightMode === 'active' && !shouldSuppressHighlight && !isSelected;
    const isRelated = highlightMode === 'related' && !shouldSuppressHighlight && !isSelected;
    const isHighlighted = isActive || isRelated;

    // Style Definition - Dark Mode Liquid Glass with New Hover Logic
    // Default: Dark liquid-glass panels
    // Hovered: Full black
    // Related SERVICE tiles (when hovering suite): Full Flo Orange
    // Related SUITE/About tiles (when hovering offer): Near-black
    const getStyles = () => {
        // Determine if the hovered tile is a suite type (for relationship coloring)
        const hoveredIsOffer = hoveredType === 'offer';
        const hoveredIsSuite = !hoveredIsOffer && hoveredType !== null;

        // Define which tile IDs are "service" tiles (offers)
        const serviceTileIds = ['flo-os', 'media-marketing', 'Funnel Builder'];
        const isThisTileService = serviceTileIds.includes(suite.id);

        // Define which tiles are "suite" tiles (Studio, Marketing, Development)
        const suiteTileIds = ['studio', 'marketing', 'development', 'dev'];
        const isThisTileSuite = suiteTileIds.includes(suite.id?.toLowerCase());

        // ACTIVE STATE: This tile is being hovered
        if (isActive) {
            // Suite tiles get orange background on hover
            if (isThisTileSuite) {
                return {
                    bg: 'bg-[#F1592D]',
                    border: 'border-[rgba(255,255,255,0.2)]',
                    title: 'text-white',
                    tagline: 'text-white',
                    icon: 'text-white',
                    iconBg: 'bg-white/20 border-white/20',
                    shadow: 'shadow-[0_4px_24px_rgba(241,89,45,0.4)]',
                    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                    glowOpacity: 0
                };
            }
            // Other tiles get black background on hover
            return {
                bg: 'bg-black',
                border: 'border-white/20',
                title: 'text-white',
                tagline: 'text-white/90',
                icon: 'text-white',
                iconBg: 'bg-white/20 border-white/20',
                shadow: 'shadow-2xl shadow-black/50',
                innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                glowOpacity: 0
            };
        }

        // RELATED STATE: All related tiles turn orange with subtle 3D glass effect
        if (isRelated) {
            if (suite.id === 'connex') {
                return {
                    bg: 'bg-[#1A1A1A] backdrop-blur-[24px]',
                    border: 'border-[rgba(255,255,255,0.08)]',
                    title: 'text-white',
                    tagline: 'text-white',
                    icon: 'text-white/80',
                    iconBg: 'bg-white/10 border-white/15',
                    shadow: 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
                    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)',
                    glowOpacity: 0
                };
            }
            return {
                bg: 'bg-[#F1592D]/90',
                border: 'border-[rgba(255,255,255,0.15)]',
                title: 'text-white',
                tagline: 'text-white/90',
                icon: 'text-white',
                iconBg: 'bg-white/20 border-white/20',
                shadow: 'shadow-[0_4px_24px_rgba(241,89,45,0.3)]',
                innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                glowOpacity: 0
            };
        }

        // DEFAULT STATE: Uniform Dark Glass with Subtle 3D Depth
        return {
            bg: 'bg-[#1A1A1A] backdrop-blur-[24px]',
            border: 'border-[rgba(255,255,255,0.08)]',
            title: 'text-white',
            tagline: 'text-white',
            icon: 'text-white/80',
            iconBg: 'bg-white/10 border-white/15',
            shadow: 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
            innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)',
            glowOpacity: 0
        };
    };

    const styles = getStyles();

    // Typography & Content Rendering Logic
    const renderTitle = () => {
        // Special Case: Flo OS (Double Image)
        if (suite.id === 'flo-os') {
            return (
                <div className="flex items-end justify-center gap-3 pointer-events-none w-full px-4 mb-2">
                    <img
                        src={floLogo}
                        alt="FLO"
                        className="h-12 md:h-20 w-auto object-contain transition-all duration-300"
                        style={{
                            filter: isHighlighted ? 'brightness(0) invert(1)' : 'none'
                        }}
                    />
                    <img
                        src={osLogo}
                        alt="OS"
                        className="h-10 md:h-10 w-auto object-contain transition-all duration-300 mb-1"
                        style={{
                            filter: 'brightness(0) invert(1)'
                        }}
                    />
                </div>
            );
        }

        // Special Case: About Flo (Text + Logo)
        if (suite.title === 'About Flo') {
            return (
                <div className="flex flex-col items-center justify-center pointer-events-none w-full px-4">
                    <span className={`text-3xl md:text-4xl mr-14 mb-3 font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] mb-2 ${styles.title}`}>
                        About
                    </span>
                    <img
                        src={floLogo}
                        alt="Flo"
                        className="h-16 md:h-20 w-auto object-contain transition-all duration-300"
                        style={{
                            filter: 'brightness(0) invert(1)'
                        }}
                    />
                </div>
            );
        }

        // Special Case: Connex Logo
        if (suite.title === 'Connex') {
            return (
                <div className="flex items-center justify-center pointer-events-none w-full px-8">
                    <img
                        src={connexLogo}
                        alt="Connex"
                        className="w-full max-w-[130px] h-auto object-contain transition-all duration-300"
                        style={{
                            filter: ''
                        }}
                    />
                </div>
            );
        }

        const suiteTypes = ['Studio', 'Marketing', 'Dev', 'Development'];
        const isSuiteType = suiteTypes.includes(suite.title);

        if (isSuiteType) {
            let mainWord = suite.title;

            const suffixStyle = !isHighlighted ? {
                WebkitTextStroke: '0.75px #F1592D',
                color: 'transparent'
            } : {
                WebkitTextStroke: '0px',
                color: 'white'
            };

            return (
                <div className="flex flex-col items-center justify-center pointer-events-none w-full">
                    <motion.span
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`text-5xl md:text-5xl font-black tracking-tighter mb-0.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${styles.title}`}>
                        {mainWord}
                    </motion.span>

                    <motion.span
                        animate={{
                            opacity: isActive ? 0 : 1,
                            y: isActive ? -6 : 0,
                            overflow: 'hidden',
                            height: isActive ? 0 : 'auto'
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="text-xl md:text-2xl font-[900] uppercase tracking-[0.2em] leading-tight overflow-hidden"
                        style={suffixStyle}
                    >
                        SUITE
                    </motion.span>
                </div>
            );
        }

        // Special handling for Media Marketing - split into two lines
        if (suite.title === 'Media Marketing') {
            return (
                <div className="flex flex-col items-center justify-center pointer-events-none w-full">
                    <span className={`text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${styles.title}`}>
                        Media
                    </span>
                    <span className={`text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${styles.title}`}>
                        Marketing
                    </span>
                </div>
            );
        }

        const standardTitleColor = 'text-white';

        return (
            <div className="text-center pointer-events-none px-2 w-full">
                <span className={`text-4xl md:text-5xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${standardTitleColor}`}>
                    {suite.title}
                </span>
            </div>
        );
    };


    return (
        <motion.div
            layout
            ref={tileRef}
            onClick={(!isOtherSelected && suite.id !== 'connex') ? onClick : undefined}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnterWrapper}
            onMouseLeave={onMouseLeave}
            className={`
                relative rounded-[2rem] overflow-hidden group
                transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                ${!isSelected && !isOtherSelected && suite.id !== 'connex' ? 'cursor-pointer' : ''}
                
                ${highlightMode === 'none' && !isSelected && !isOtherSelected && !isClosing && suite.id !== 'connex' ? 'hover:-translate-y-1 hover:shadow-2xl' : ''}
                
                ${styles.border}
                border
                ${!isSelected ? styles.bg : ''}
                
                ${isSelected ? 'z-50 shadow-2xl border-2 border-flo-orange/20 cursor-default' : 'z-0'}
            `}
            style={{
                gridColumn: `${suite.gridConfig.colStart} / span ${suite.gridConfig.colSpan}`,
                gridRow: `${suite.gridConfig.rowStart} / span ${suite.gridConfig.rowSpan}`,
                boxShadow: `${styles.innerShadow}${styles.shadow ? `, ${styles.shadow.replace('shadow-', '')}` : ''}`
            }}
            animate={{
                opacity: isOtherSelected ? 0 : 1
            }}
            transition={{
                duration: 0.7,
                ease: [0.2, 0, 0, 1],
                delay: 0
            }}
        >
            <div className="w-full h-full relative z-10">
                <AnimatePresence>
                    {!isSelected && (
                        <motion.div
                            key="tile-content"
                            className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center"
                            initial={false}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.3, delay: 0.15, ease: [0.2, 0, 0, 1] }
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
                            }}
                        >
                            {/* Expand Icon - Absolutely Positioned */}
                            {!isCenterpiece && suite.id !== 'connex' && (
                                <div className={`absolute top-6 right-6 z-20 w-8 h-8 rounded-full flex items-center justify-center smooth-transition shadow-sm ${styles.iconBg} ${isActive || isRelated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                    <Maximize2 className={`w-4 h-4 ${styles.icon}`} />
                                </div>
                            )}

                            {/* Center Content */}
                            <div className="flex flex-col items-center justify-center w-full">
                                {renderTitle()}

                                {/* Tagline / Subtitle - Reveal on Hover */}
                                <div className={`overflow-hidden transition-all duration-500 ease-out ${isActive ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                                    <p className={`text-sm font-medium leading-relaxed max-w-[200px] mx-auto ${styles.tagline} transition-colors duration-300`}>
                                        {suite.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* Teaser Chat Input - Wide & Bottom Aligned */}
                            {suite.id === 'about-flo' && (
                                <div className={`absolute flex justify-center bottom-10 left-6 right-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                                    <motion.div
                                        layoutId="about-flo-input-field"
                                        className="relative w-[90%] h-11 bg-white/5 border border-white/10 rounded-full flex items-center px-4 overflow-hidden shadow-lg group-hover:border-white/20 transition-colors"
                                    >
                                        <span className="text-xs text-neutral-500 font-medium whitespace-nowrap overflow-hidden">Ask about Flo...</span>
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-flo-orange/20 flex items-center justify-center">
                                            <Send className="w-3.5 h-3.5 text-flo-orange opacity-40" />
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {isSelected && (
                        <motion.div
                            key="app-content"
                            className={`absolute inset-0 flex flex-col overflow-hidden bg-[#0A0A0A]`}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.3, delay: 0.15, ease: [0.2, 0, 0, 1] }
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.3, delay: 0, ease: [0.2, 0, 0, 1] } // Immediate exit on close
                            }}
                        >
                            {suite.id === 'about-flo' || suite.id === 'consultation' ? (
                                <AboutFloChat onClose={onClose} />
                            ) : suite.type === 'offer' || suite.teamPage ? (
                                <OfferExpandedView suite={suite} onClose={onClose} />
                            ) : (
                                <>
                                    {/* App Window Header */}
                                    <div className={`flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black shrink-0`}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <h2 className={`text-2xl font-bold tracking-tight text-white`}>
                                                        {suite.title}
                                                    </h2>
                                                    {isCenterpiece && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-flo-orange text-white uppercase tracking-wider">
                                                            OS
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium mt-0.5 text-neutral-400`}>
                                                    {suite.tagline}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className={`p-2 rounded-full smooth-transition hover:bg-white/10 text-neutral-400 hover:text-white`}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Main Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                        <div className="max-w-3xl mx-auto space-y-12">
                                            {/* Description */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-flo-orange uppercase tracking-widest pl-1">
                                                    Summary
                                                </h4>
                                                <p className={`text-xl font-medium leading-relaxed text-neutral-200`}>
                                                    {suite.description}
                                                </p>
                                            </div>
                                            {/* Two Column Layout */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">
                                                        Capabilities
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {suite.deliverables && suite.deliverables.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 group/item">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-flo-orange/40 mt-2 group-hover/item:bg-flo-orange smooth-transition" />
                                                                <span className={`font-medium text-neutral-400`}>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">
                                                        Designed For
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {suite.bestFor && suite.bestFor.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-neutral-300`}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sticky Footer CTA */}
                                    <div className={`p-6 border-t border-white/10 bg-black shrink-0`}>
                                        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 w-full">
                                                <button className="flex-1 h-12 bg-flo-orange hover:bg-[#FF8559] text-white rounded-xl font-semibold shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/40 active:scale-[0.98] smooth-transition flex items-center justify-center gap-2">
                                                    <span>{suite.primaryCTA.label}</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                                <button className={`flex-1 h-12 rounded-xl font-medium flex items-center justify-center gap-2 smooth-transition bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white`}>
                                                    <span>{suite.secondaryCTA.label}</span>
                                                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div >
    );
};

export default SuiteTile;
