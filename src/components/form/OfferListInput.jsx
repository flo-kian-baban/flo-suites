import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfferListInput = ({
    values = [],
    onChange,
    maxOffers = 10,
    placeholder = "e.g. High-Ticket Coaching Program",
    label,
    required = false,
    error = '',
    helperText = ''
}) => {
    // Ensure we always have at least one empty string if values is empty
    const offers = values.length > 0 ? values : [''];

    const handleAddOffer = () => {
        if (offers.length < maxOffers) {
            onChange([...offers, '']);
        }
    };

    const handleRemoveOffer = (index) => {
        // Don't allow removing the last remaining input
        if (offers.length <= 1) {
            onChange(['']);
            return;
        }
        const newOffers = offers.filter((_, i) => i !== index);
        onChange(newOffers);
    };

    const handleChange = (index, value) => {
        const newOffers = [...offers];
        newOffers[index] = value;
        onChange(newOffers);
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                    <span className="ml-2 text-white/40 normal-case tracking-normal">
                        ({offers.length}/{maxOffers})
                    </span>
                </label>
            )}

            <div className="space-y-3">
                <AnimatePresence initial={false}>
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative flex items-center gap-2"
                        >
                            <div className="relative flex-1 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                                    <span className="text-xs font-mono">{index + 1}.</span>
                                </div>
                                <input
                                    type="text"
                                    value={offer}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    placeholder={index === 0 ? placeholder : "Another offer..."}
                                    className={`
                                        w-full h-12 pl-8 pr-10 rounded-xl
                                        bg-white/5 border transition-all duration-200
                                        text-white placeholder-white/30
                                        outline-none
                                        ${error && index === 0
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-white/10 focus:border-flo-orange/50 focus:bg-white/10 hover:border-white/20'
                                        }
                                    `}
                                    autoFocus={index === offers.length - 1 && index > 0}
                                />
                                {offers.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveOffer(index)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-white/5 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {offers.length < maxOffers && (
                    <button
                        onClick={handleAddOffer}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-flo-orange hover:bg-flo-orange/10 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add another offer</span>
                    </button>
                )}
            </div>

            {helperText && !error && (
                <p className="text-xs text-white/40">{helperText}</p>
            )}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

export default OfferListInput;
