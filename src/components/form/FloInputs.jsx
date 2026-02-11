import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';

// ============================================================================
// FloInput - Text input with consistent styling
// ============================================================================
export const FloInput = ({
    label,
    value,
    onChange,
    placeholder = '',
    type = 'text',
    required = false,
    error = '',
    helperText = '',
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    w-full h-12 px-4 rounded-xl
                    bg-white/5 border transition-all duration-200
                    text-white placeholder-white/30
                    outline-none
                    ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : isFocused
                            ? 'border-flo-orange/50 bg-white/10'
                            : 'border-white/10 hover:border-white/20'
                    }
                `}
            />
            {helperText && !error && (
                <p className="text-xs text-white/40">{helperText}</p>
            )}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloTextarea - Multi-line text input
// ============================================================================
export const FloTextarea = ({
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    required = false,
    error = '',
    helperText = '',
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    w-full px-4 py-3 rounded-xl resize-none
                    bg-white/5 border transition-all duration-200
                    text-white placeholder-white/30
                    outline-none
                    ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : isFocused
                            ? 'border-flo-orange/50 bg-white/10'
                            : 'border-white/10 hover:border-white/20'
                    }
                `}
            />
            {helperText && !error && (
                <p className="text-xs text-white/40">{helperText}</p>
            )}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloDropdown - Custom styled dropdown
// ============================================================================
export const FloDropdown = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    required = false,
    error = '',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full h-12 px-4 rounded-xl flex items-center justify-between
                        bg-white/5 border transition-all duration-200
                        outline-none text-left
                        ${error
                            ? 'border-red-500/50'
                            : isOpen
                                ? 'border-flo-orange/50 bg-white/10'
                                : 'border-white/10 hover:border-white/20'
                        }
                    `}
                >
                    <span className={selectedOption ? 'text-white' : 'text-white/30'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full px-4 py-3 text-left flex items-center justify-between
                                            transition-colors duration-150
                                            ${value === option.value
                                                ? 'bg-flo-orange/20 text-flo-orange'
                                                : 'text-white/80 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <span>{option.label}</span>
                                        {value === option.value && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloMultiSelect - Chip-based multi-select
// ============================================================================
export const FloMultiSelect = ({
    label,
    values = [],
    onChange,
    options = [],
    maxSelections = null,
    helperText = '',
    required = false,
    error = '',
    className = ''
}) => {
    const toggleOption = (optionValue) => {
        if (values.includes(optionValue)) {
            onChange(values.filter(v => v !== optionValue));
        } else {
            if (maxSelections && values.length >= maxSelections) {
                // Remove first selection and add new one
                onChange([...values.slice(1), optionValue]);
            } else {
                onChange([...values, optionValue]);
            }
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                    {maxSelections && (
                        <span className="ml-2 text-white/40 normal-case tracking-normal">
                            (choose up to {maxSelections})
                        </span>
                    )}
                </label>
            )}
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = values.includes(option.value);
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleOption(option.value)}
                            className={`
                                px-4 py-2.5 rounded-xl text-sm font-medium
                                border transition-all duration-200
                                ${isSelected
                                    ? 'bg-flo-orange border-flo-orange text-white'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    );
                })}
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

// ============================================================================
// FloSegmentedControl - Button group for single selection
// ============================================================================
export const FloSegmentedControl = ({
    label,
    value,
    onChange,
    options = [],
    required = false,
    error = '',
    className = ''
}) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`
                                relative px-4 py-2.5 text-sm font-medium rounded-lg
                                transition-all duration-200
                                ${isSelected
                                    ? 'text-white'
                                    : 'text-white/50 hover:text-white/80'
                                }
                            `}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="segmented-bg"
                                    className="absolute inset-0 bg-flo-orange rounded-lg"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-10">{option.label}</span>
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-2">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloSelectCard - Card-based single selection
// ============================================================================
export const FloSelectCard = ({
    label,
    value,
    onChange,
    options = [],
    required = false,
    error = '',
    columns = 1,
    className = ''
}) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <div className={`grid gap-3 ${columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`
                                relative p-4 rounded-xl text-left
                                border-2 transition-all duration-200
                                ${isSelected
                                    ? 'bg-flo-orange/10 border-flo-orange'
                                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                                    transition-colors duration-200
                                    ${isSelected ? 'border-flo-orange bg-flo-orange' : 'border-white/30'}
                                `}>
                                    {isSelected && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                        {option.label}
                                    </p>
                                    {option.description && (
                                        <p className="text-sm text-white/40 mt-1">{option.description}</p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloSlider - Custom draggable slider for ratings
// ============================================================================
export const FloSlider = ({
    label,
    value,
    onChange,
    min = 1,
    max = 5,
    lowLabel = 'Low',
    highLabel = 'High',
    helperText = '',
    required = false,
    error = '',
    className = ''
}) => {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate percentage for visual fill
    // Default value logic: if value is null/undefined, treat it as middle for visual purposes if you want it to look like it's in the middle,
    // BUT the prompt says "default those bars should be in the middle".
    // If I change the `value` prop passed to input to be middle when null, it will visually be there.
    // The actual state update happens on change.
    const effectiveValue = value || Math.ceil((max - min) / 2 + min);
    const percentage = ((effectiveValue - min) / (max - min)) * 100;


    const handleSliderChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        onChange(newValue);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                        {label}
                        {required && <span className="text-flo-orange ml-1">*</span>}
                    </label>
                </div>
            )}
            {helperText && (
                <p className="text-sm text-white/40">{helperText}</p>
            )}
            <div className="flex items-center gap-4">
                <span className="text-xs text-white/40 w-16 shrink-0">{lowLabel}</span>
                <div className="flex-1 relative">
                    {/* Track background */}
                    <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10" />

                    {/* Filled track */}
                    <div
                        className="absolute h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-flo-orange/60 to-flo-orange transition-all duration-150"
                        style={{ width: `${percentage}%` }}
                    />

                    {/* Range input */}
                    <input
                        ref={sliderRef}
                        type="range"
                        min={min}
                        max={max}
                        step={1}
                        value={value || Math.ceil((max - min) / 2 + min)} // Default to middle if null
                        onChange={handleSliderChange}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        className="relative w-full h-8 appearance-none bg-transparent cursor-pointer z-10
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-5
                            [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-flo-orange
                            [&::-webkit-slider-thumb]:border-2
                            [&::-webkit-slider-thumb]:border-white/20
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-webkit-slider-thumb]:shadow-flo-orange/30
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:duration-150
                            [&::-webkit-slider-thumb]:hover:scale-125
                            [&::-webkit-slider-thumb]:active:scale-110
                            [&::-webkit-slider-thumb]:active:scale-110 
                            [&::-moz-range-thumb]:appearance-none
                            [&::-moz-range-thumb]:w-5
                            [&::-moz-range-thumb]:h-5
                            [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:bg-flo-orange
                            [&::-moz-range-thumb]:border-2
                            [&::-moz-range-thumb]:border-white/20
                            [&::-moz-range-thumb]:shadow-lg
                            [&::-moz-range-thumb]:cursor-pointer
                            [&::-moz-range-track]:bg-transparent
                        "
                    />
                </div>
                <span className="text-xs text-white/40 w-16 text-right shrink-0">{highLabel}</span>
            </div>
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloRatingScale - 5-level rating scale buttons (keeping for backwards compatibility)
// ============================================================================
export const FloRatingScale = ({
    label,
    value,
    onChange,
    lowLabel = 'Low',
    highLabel = 'High',
    helperText = '',
    required = false,
    error = '',
    className = ''
}) => {
    const levels = [1, 2, 3, 4, 5];

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            {helperText && (
                <p className="text-sm text-white/50">{helperText}</p>
            )}
            <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 w-12">{lowLabel}</span>
                <div className="flex-1 flex gap-2">
                    {levels.map((level) => {
                        const isSelected = value === level;
                        const isFilled = value && level <= value;
                        return (
                            <button
                                key={level}
                                type="button"
                                onClick={() => onChange(level)}
                                className={`
                                    flex-1 h-10 rounded-lg
                                    border transition-all duration-200 font-medium text-sm
                                    ${isSelected
                                        ? 'bg-flo-orange border-flo-orange text-white scale-105'
                                        : isFilled
                                            ? 'bg-flo-orange/30 border-flo-orange/50 text-white'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:bg-white/10'
                                    }
                                `}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
                <span className="text-xs text-white/40 w-12 text-right">{highLabel}</span>
            </div>
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

// ============================================================================
// FloTagInput - Multi-input tag entry
// ============================================================================
export const FloTagInput = ({
    label,
    values = [],
    onChange,
    placeholder = 'Type and press Enter',
    maxTags = null,
    required = false,
    error = '',
    helperText = '',
    className = ''
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (maxTags && values.length >= maxTags) return;
            if (!values.includes(inputValue.trim())) {
                onChange([...values, inputValue.trim()]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
            onChange(values.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(values.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <div
                className={`
                    min-h-[48px] px-3 py-2 rounded-xl
                    bg-white/5 border transition-all duration-200
                    flex flex-wrap gap-2 items-center
                    ${error
                        ? 'border-red-500/50'
                        : isFocused
                            ? 'border-flo-orange/50 bg-white/10'
                            : 'border-white/10 hover:border-white/20'
                    }
                `}
            >
                {values.map((tag, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-flo-orange/20 text-flo-orange text-sm font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-flo-orange/30 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={values.length === 0 ? placeholder : ''}
                    disabled={maxTags && values.length >= maxTags}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-white/30"
                />
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

// ============================================================================
// FloSearchableDropdown - Combobox with filtering and custom value support
// ============================================================================
export const FloSearchableDropdown = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select or type...',
    required = false,
    error = '',
    helperText = '',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    // Initialize search term when value changes externally
    useEffect(() => {
        // If the value matches an option label, show that label (or value if no label)
        // If it's a custom value, show it directly
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption) {
            setSearchTerm(selectedOption.label);
        } else if (value) {
            setSearchTerm(value);
        }
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                // If closing and we have a search term but no value set (or mismatch),
                // we should stick with what's typed as a custom value or reset if empty
                if (searchTerm && searchTerm !== value) {
                    // logic handled by onChange in input, but ensure state sync
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [containerRef, searchTerm, value]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(newValue); // Allow custom values immediately
        setIsOpen(true);
    };

    const handleSelectOption = (option) => {
        onChange(option.value); // Store the value (ID)
        setSearchTerm(option.label); // Show the label
        setIsOpen(false);
    };

    return (
        <div className={`space-y-2 ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                    {required && <span className="text-flo-orange ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className={`
                            w-full h-12 px-4 pr-10 rounded-xl
                            bg-white/5 border transition-all duration-200
                            text-white placeholder-white/30
                            outline-none
                            ${error
                                ? 'border-red-500/50 focus:border-red-500'
                                : isOpen
                                    ? 'border-flo-orange/50 bg-white/10'
                                    : 'border-white/10 hover:border-white/20'
                            }
                        `}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/50">
                        {isOpen ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelectOption(option)}
                                            className={`
                                                w-full px-4 py-3 text-left flex items-center justify-between
                                                transition-colors duration-150
                                                ${value === option.value
                                                    ? 'bg-flo-orange/20 text-flo-orange'
                                                    : 'text-white/80 hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </div>
                                            {value === option.value && (
                                                <Check className="w-4 h-4" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-white/40 italic">
                                        No matches found. Using "{searchTerm}" as custom value.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
