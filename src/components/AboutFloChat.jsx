import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

const TypewriterText = ({ text, delay = 40, startDelay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) {
            const timeout = setTimeout(() => {
                setHasStarted(true);
            }, startDelay);
            return () => clearTimeout(timeout);
        }

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, text, onComplete, hasStarted, startDelay]);

    return <span>{displayedText}</span>;
};

const AboutFloChat = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: "Welcome to Flo Suite! I'm your interactive guide. You can ask me about our specialized suites, our process, or how we can help scale your business.",
            animate: true,
            isInitial: true
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const messagesEndRef = useRef(null);

    // Initialize thread ID on mount
    useEffect(() => {
        setThreadId(crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userText = inputText;
        const userMsg = { id: Date.now(), role: 'user', text: userText };

        // Optimistic Update
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat/about-flo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    threadId
                }),
            });

            const data = await response.json();

            // Check for new threadId from backend if strictly needed, 
            // but we usually persist the one we generated or the one returned.
            if (data.threadId) setThreadId(data.threadId);

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: data.reply || "Hi",
                animate: true
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Chat Error:', error);
            // Fallback on error
            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: "Hi",
                animate: true
            };
            setMessages(prev => [...prev, aiMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const hasContentOrFocus = inputText.trim().length > 0 || isFocused;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden relative bg-[#0A0A0A] text-white">
            {/* Standard Header / Nav */}
            <div className="flex items-center justify-between px-8 py-6 z-30 shrink-0 bg-black/40 backdrop-blur-3xl border-b border-white/20 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1 bg-flo-orange rounded-full" />
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white/90">Learn About Flo!</h2>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-widest leading-none mt-1">Your personal guide to the system.</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-flo-orange/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 py-8 space-y-6 z-10 transition-all duration-500">
                <div className="max-w-3xl mx-auto w-full space-y-6" style={{ paddingBottom: '20px' }}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                            className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                                    max-w-[85%] rounded-3xl px-6 py-3 text-lg leading-relaxed backdrop-blur-xl shadow-2xl relative
                                    ${msg.role === 'user'
                                        ? 'bg-flo-orange text-white'
                                        : 'bg-white/[0.03] text-neutral-200 border border-white/[0.05]'
                                    }
                                `}
                            >
                                {msg.role === 'assistant' && msg.animate ? (
                                    <TypewriterText
                                        text={msg.text}
                                        startDelay={msg.isInitial ? 600 : 0}
                                    />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="flex items-end gap-3 justify-start"
                        >
                            <div className="bg-white/[0.03] text-neutral-400 rounded-[24px] rounded-bl-none border border-white/[0.05] px-6 py-4">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
                                </span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Standard Sticky Footer with Input */}
            <motion.div
                layoutId="about-flo-input-container"
                className="p-6 border-t border-white/20 bg-black/50 backdrop-blur-3xl z-20 shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            >
                <div className="max-w-3xl mx-auto w-full">
                    <form
                        onSubmit={handleSend}
                        className="relative group"
                    >
                        <motion.div
                            layoutId="about-flo-input-field"
                            className="relative"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Ask a question..."
                                className={`
                                    w-full bg-white/5 border rounded-full px-8 py-5 pr-16 text-white text-lg placeholder:text-neutral-600 focus:outline-none transition-all duration-300
                                    ${hasContentOrFocus
                                        ? 'border-flo-orange/60 shadow-[0_0_15px_rgba(241,89,45,0.15)]'
                                        : 'border-white/10'
                                    }
                                `}
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-white 
                                        transition-all duration-300
                                        ${inputText.trim()
                                            ? 'bg-flo-orange opacity-100 hover:bg-flo-orange-light shadow-lg shadow-flo-orange/30 scale-100'
                                            : 'bg-flo-orange/20 opacity-40 pointer-events-none scale-90'
                                        }
                                    `}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutFloChat;
