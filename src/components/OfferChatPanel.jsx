import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Loader2, MessageSquare } from 'lucide-react';

const OfferChatPanel = ({ offerKey, offerTitle }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const isUserScrolledUp = useRef(false);

    // Only auto-scroll if user hasn't scrolled up manually
    const scrollToBottom = useCallback(() => {
        if (!isUserScrolledUp.current && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    // Detect if user has scrolled away from the bottom
    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const threshold = 40;
        isUserScrolledUp.current = el.scrollHeight - el.scrollTop - el.clientHeight > threshold;
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
        setInputValue('');
        setIsLoading(true);

        // Reset scroll lock so new messages auto-scroll
        isUserScrolledUp.current = false;

        try {
            const res = await fetch('/api/offer-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerKey, message: trimmed }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <div className="h-full flex flex-col rounded-2xl border border-white/[0.06] bg-[#141414] overflow-hidden">
            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.04] flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-flo-orange/10 flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-flo-orange" />
                </div>
                <span className="text-[13px] font-medium text-white/70 tracking-tight">
                    Ask about {offerTitle}
                </span>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flo-scrollbar min-h-0"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-2">
                        <p className="text-[12px] text-white/20 leading-relaxed">
                            Type a question about <span className="text-white/35">{offerTitle}</span>
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-flo-orange text-white rounded-2xl rounded-br-md'
                                    : 'bg-white/[0.04] text-white/70 border border-white/[0.04] rounded-2xl rounded-bl-md'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.04]">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="shrink-0 px-3 pb-3 pt-2">
                <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] focus-within:border-white/[0.12] transition-colors px-3 py-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a question..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent text-[13px] text-white/80 placeholder-white/20 outline-none disabled:opacity-40"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-flo-orange text-white disabled:opacity-20 transition-opacity duration-150 shrink-0"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OfferChatPanel;
