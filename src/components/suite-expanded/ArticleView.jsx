import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';
import BlogCard from './BlogCard';

const ArticleView = ({ article, onBack, allArticles }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to top on mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [article.id]);

    // Filter related articles (exclude current, take 3 randomly)
    const relatedArticles = allArticles
        .filter(a => a.id !== article.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-4xl mx-auto pb-12"
        >
            <div ref={scrollRef} className="absolute -top-24" /> {/* Scroll target */}

            {/* Navigation & Actions */}
            <div className="flex items-center justify-between mb-8 sticky top-0 z-20 py-4 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">Back to Grid</span>
                </button>

                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Article Hero */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded bg-flo-orange/10 border border-flo-orange/20 text-flo-orange text-xs font-bold uppercase tracking-wider">
                        {article.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readingTime} read</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {article.title}
                </h1>

                <p className="text-xl text-neutral-300 leading-relaxed max-w-2xl mb-8">
                    {article.description}
                </p>

                <div
                    className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative"
                    style={{ backgroundImage: `url(${article.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            </div>

            {/* Article Body */}
            <div className="prose prose-invert prose-lg max-w-none space-y-12">

                {/* Intro */}
                <p className="text-xl leading-relaxed text-neutral-200">
                    {article.body.intro}
                </p>

                {/* Sections */}
                {article.body.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">
                            {section.heading}
                        </h2>
                        <p className="text-neutral-300 leading-relaxed">
                            {section.content}
                        </p>
                        {section.bullets && (
                            <ul className="space-y-2 mt-4 ml-4">
                                {section.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-3 text-neutral-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-flo-orange mt-2.5 flex-shrink-0" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                {/* Key Takeaways Callout */}
                <div className="my-12 p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-flo-orange/50" />
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-flo-orange">#</span> Key Takeaways
                    </h3>
                    <ul className="space-y-3">
                        {article.body.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white mt-0.5 shrink-0 border border-white/5">
                                    {idx + 1}
                                </span>
                                <span className="text-neutral-200 font-medium">{takeaway}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Flo Application */}
                <div className="bg-flo-orange/5 border border-flo-orange/20 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-flo-orange uppercase tracking-widest mb-2">
                        How Flo Applies This
                    </h4>
                    <p className="text-neutral-200 font-medium">
                        {article.body.floApplication}
                    </p>
                </div>

            </div>

            {/* Related Articles */}
            <div className="mt-20 pt-10 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-8">
                    Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((relArticle) => (
                        <div key={relArticle.id} className="h-full">
                            <BlogCard
                                article={relArticle}
                                onClick={() => {
                                    // Smooth scroll to top then switch
                                    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
                                    setTimeout(() => onBack(relArticle), 300); // Hacky re-use of callback to switch, handled by parent
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </motion.div>
    );
};

export default ArticleView;
