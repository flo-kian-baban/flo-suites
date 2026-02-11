import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const TRANSITION = {
    duration: 0.65,
    ease: [0.2, 0, 0, 1] // Custom "aggressive push" ease to ensure immediate yield
};

const SuiteWindow = ({ suite, onClose }) => {
    const isCenterpiece = suite.isCenterpiece;

    return (
        <motion.div
            layoutId={`suite-${suite.id}`}
            className={`fixed inset-4 md:inset-8 z-50 flex flex-col overflow-hidden rounded-3xl glass-effect border-2 border-flo-orange/50 shadow-2xl origin-center`}
            initial={{ borderRadius: 24 }}
            animate={{ borderRadius: 24 }}
            exit={{ borderRadius: 24 }}
            transition={TRANSITION}
        >
            <motion.div
                className="relative h-full p-8 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0 }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
                    <div className="flex-1">
                        {isCenterpiece && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flo-orange/20 border border-flo-orange/50 mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-flo-orange" />
                                <span className="text-xs font-semibold text-flo-orange uppercase tracking-wider">
                                    Core System
                                </span>
                            </div>
                        )}
                        <h2 className="text-4xl font-bold mb-2 text-white">
                            {suite.title}
                        </h2>
                        <p className="text-lg text-neutral-400">
                            {suite.tagline}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="ml-4 p-2 rounded-lg hover:bg-white/10 smooth-transition group cursor-pointer"
                    >
                        <X className="w-6 h-6 text-neutral-400 group-hover:text-flo-orange smooth-transition" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                    {/* What it is */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-flo-orange uppercase tracking-wider mb-3">
                            What it is
                        </h3>
                        <p className="text-neutral-300 text-lg leading-relaxed">
                            {suite.description}
                        </p>
                    </div>

                    {/* What it delivers */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-flo-orange uppercase tracking-wider mb-4">
                            What it delivers
                        </h3>
                        <ul className="space-y-3">
                            {suite.deliverables.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-neutral-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-flo-orange mt-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best for */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-flo-orange uppercase tracking-wider mb-3">
                            Best for
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {suite.bestFor.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Row */}
                <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                    <button className="flex-1 px-6 py-3.5 bg-flo-orange hover:bg-flo-orange-light rounded-lg font-semibold text-white smooth-transition orange-glow">
                        {suite.primaryCTA.label}
                    </button>
                    <button className="flex-1 px-6 py-3.5 glass-effect-light hover:bg-white/20 rounded-lg font-medium text-white smooth-transition">
                        {suite.secondaryCTA.label}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SuiteWindow;
