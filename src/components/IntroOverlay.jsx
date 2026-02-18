import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const PHRASES = [
    'One partner.',
    'Multiple suites.',
    'Real growth.',
];

// Total intro duration target: ~2.5s
const CHAR_DELAY = 45;     // ms per character typed
const PHRASE_PAUSE = 180;  // ms pause between phrases
const HOLD_AFTER = 700;    // ms to hold after last character

const IntroOverlay = ({ onComplete }) => {
    const [displayedChars, setDisplayedChars] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const timerRef = useRef(null);

    const fullText = PHRASES.join('\n');
    const totalChars = fullText.length;

    // Phrase boundaries for pausing
    const phraseBoundaries = [];
    let cursor = 0;
    for (let i = 0; i < PHRASES.length - 1; i++) {
        cursor += PHRASES[i].length + 1;
        phraseBoundaries.push(cursor);
    }

    useEffect(() => {
        let charIndex = 0;

        const typeNext = () => {
            charIndex++;
            setDisplayedChars(charIndex);

            if (charIndex >= totalChars) {
                timerRef.current = setTimeout(() => {
                    setIsDone(true);
                }, HOLD_AFTER);
                return;
            }

            const atBoundary = phraseBoundaries.includes(charIndex);
            const delay = atBoundary ? PHRASE_PAUSE : CHAR_DELAY;
            timerRef.current = setTimeout(typeNext, delay);
        };

        timerRef.current = setTimeout(typeNext, 300);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (isDone && onComplete) {
            const t = setTimeout(onComplete, 600);
            return () => clearTimeout(t);
        }
    }, [isDone, onComplete]);

    const revealed = fullText.slice(0, displayedChars);

    return (
        <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: isDone ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Container is sized by the invisible full text so it never shifts */}
            <div className="intro-text-container">
                {/* Invisible full text to reserve exact size */}
                <span className="intro-text-sizer" aria-hidden="true">{fullText}</span>
                {/* Revealed text overlaid on top, cursor follows inline */}
                <span className="intro-text-revealed">{revealed}<span className="intro-cursor" /></span>
            </div>
        </motion.div>
    );
};

export default IntroOverlay;
