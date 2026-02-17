import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloInput, FloTextarea, FloDropdown } from '../form/FloInputs';

// ============================================================================
// Helpers & Constants
// ============================================================================
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate time slots (08:00 to 20:00)
const TIME_SLOTS = [];
for (let i = 8; i <= 20; i++) {
    const hour = i < 10 ? `0${i}` : i;
    TIME_SLOTS.push({ value: `${hour}:00`, label: `${hour}:00` });
    if (i < 20) TIME_SLOTS.push({ value: `${hour}:30`, label: `${hour}:30` });
}

// ============================================================================
// Internal Components
// ============================================================================

const Calendar = ({ onSelectDate }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const totalSlots = Math.ceil((daysInMonth + firstDayIndex) / 7) * 7;

    const navMonth = (dir) => {
        setViewDate(new Date(year, month + dir, 1));
    };

    return (
        <div className="w-full max-w-xl mx-auto py-4">
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-1">
                        {MONTHS[month]}
                    </h3>
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-flo-orange uppercase tracking-widest">
                            {year}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navMonth(-1)}
                        className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-flo-orange text-neutral-400 hover:text-white transition-all hover:scale-105 hover:border-white/20"
                        disabled={year === today.getFullYear() && month === today.getMonth()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navMonth(1)}
                        className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-flo-orange text-neutral-400 hover:text-white transition-all hover:scale-105 hover:border-white/20"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-4 border-b border-white/5 pb-2">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: totalSlots }).map((_, idx) => {
                    const dayNum = idx - firstDayIndex + 1;
                    const isValidDay = dayNum > 0 && dayNum <= daysInMonth;

                    if (!isValidDay) return <div key={idx} />;

                    const current = new Date(year, month, dayNum);
                    const isToday = current.toDateString() === today.toDateString();
                    const isPast = current < new Date(today.setHours(0, 0, 0, 0));

                    return (
                        <button
                            key={idx}
                            onClick={() => !isPast && onSelectDate(current)}
                            disabled={isPast}
                            className={`
                                aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative group
                                ${isPast
                                    ? 'text-neutral-800 cursor-not-allowed opacity-30'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }
                                ${isToday && !isPast ? 'text-flo-orange' : ''}
                            `}
                        >
                            <span className="relative z-10">{dayNum}</span>

                            {isToday && (
                                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-flo-orange opacity-60" />
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-center text-neutral-600 text-xs mt-8 font-medium">
                Select a date to verify availability
            </p>
        </div>
    );
};

// ============================================================================
// Main Component
// ============================================================================

const StudioBookingSection = () => {
    const [step, setStep] = useState('calendar'); // 'calendar' | 'form' | 'success'
    const [selectedDate, setSelectedDate] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        startTime: '',
        endTime: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Computed total hours
    const totalHours = useMemo(() => {
        if (!form.startTime || !form.endTime) return null;
        const [startH, startM] = form.startTime.split(':').map(Number);
        const [endH, endM] = form.endTime.split(':').map(Number);
        const start = startH + startM / 60;
        const end = endH + endM / 60;
        const diff = end - start;
        return diff > 0 ? diff.toFixed(1) : null;
    }, [form.startTime, form.endTime]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setStep('form');
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
        if (!form.phone.trim()) newErrors.phone = "Phone is required";
        if (!form.startTime) newErrors.startTime = "Start time required";
        if (!form.endTime) newErrors.endTime = "End time required";

        if (form.startTime && form.endTime) {
            const [startH, startM] = form.startTime.split(':').map(Number);
            const [endH, endM] = form.endTime.split(':').map(Number);
            if (endH < startH || (endH === startH && endM <= startM)) {
                newErrors.endTime = "End time must be after start time";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Booking Request:", { date: selectedDate, ...form });
        setIsSubmitting(false);
        setStep('success');
    };

    const handleReset = () => {
        setForm({
            name: '',
            email: '',
            phone: '',
            startTime: '',
            endTime: '',
            reason: ''
        });
        setSelectedDate(null);
        setErrors({});
        setStep('calendar');
    };

    return (
        <div className="w-full flex flex-col md:px-8 pb-12 transition-all duration-500 min-h-[500px]">
            {/* Section Header */}
            <div className="flex items-center gap-6 py-4 mb-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/90 whitespace-nowrap">
                    Booking
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-flo-orange/50 to-transparent" />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center text-center mt-6 mb-12">
                <span className="text-xl md:text-2xl font-bold text-white mb-1">
                    Ready to Capture?
                </span>
                <h3 className="text-5xl md:text-7xl font-black text-flo-orange uppercase tracking-tight leading-none">
                    BOOK A SESSION.
                </h3>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {step === 'calendar' && (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <Calendar onSelectDate={handleDateSelect} />
                    </motion.div>
                )}

                {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.3 }}
                        className="max-w-xl mx-auto w-full pt-4"
                    >
                        <button
                            onClick={() => setStep('calendar')}
                            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Choose a different date
                        </button>

                        <div className="flex flex-col items-center text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Booking for {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <p className="text-neutral-500 text-sm">
                                Enter your details below to confirm this slot.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <FloInput
                                label="Full Name"
                                value={form.name}
                                onChange={(v) => handleChange('name', v)}
                                error={errors.name}
                                required
                            />

                            <div className="space-y-5">
                                <FloInput
                                    label="Email"
                                    value={form.email}
                                    onChange={(v) => handleChange('email', v)}
                                    error={errors.email}
                                    required
                                />
                                <FloInput
                                    label="Phone"
                                    value={form.phone}
                                    onChange={(v) => handleChange('phone', v)}
                                    error={errors.phone}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FloDropdown
                                    label="Start Time"
                                    value={form.startTime}
                                    onChange={(v) => handleChange('startTime', v)}
                                    options={TIME_SLOTS}
                                    placeholder="09:00"
                                    error={errors.startTime}
                                    required
                                />
                                <FloDropdown
                                    label="End Time"
                                    value={form.endTime}
                                    onChange={(v) => handleChange('endTime', v)}
                                    options={TIME_SLOTS}
                                    placeholder="17:00"
                                    error={errors.endTime}
                                    required
                                />
                            </div>

                            {totalHours && (
                                <div className="flex justify-end -mt-2">
                                    <span className="text-xs text-flo-orange font-medium flex items-center gap-1.5 bg-flo-orange/5 px-2 py-1 rounded">
                                        <Clock className="w-3 h-3" />
                                        Total: {totalHours} hrs
                                    </span>
                                </div>
                            )}

                            <FloTextarea
                                label="Reason for Booking"
                                value={form.reason}
                                onChange={(v) => handleChange('reason', v)}
                                placeholder="What are we shooting? (Optional context)"
                                rows={3}
                            />

                            <div className="pt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-flo-orange hover:bg-flo-orange/90 text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(241,89,45,0.2)] hover:shadow-[0_0_40px_rgba(241,89,45,0.4)]"
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Request'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20"
                    >
                        <div className="w-24 h-24 rounded-full bg-flo-orange/5 border border-flo-orange/20 flex items-center justify-center mb-8 text-flo-orange shadow-[0_0_40px_rgba(241,89,45,0.1)]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4">Request Received</h3>
                        <p className="text-neutral-400 leading-relaxed mb-12">
                            We've received your booking request for <strong className="text-white">{selectedDate?.toLocaleDateString()}</strong>.
                            Our studio team will review the availability and confirm with you shortly.
                        </p>

                        <button
                            onClick={handleReset}
                            className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-sm font-bold"
                        >
                            Book Another Session
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudioBookingSection;
