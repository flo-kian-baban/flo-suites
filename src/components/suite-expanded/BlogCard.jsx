import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ article, onClick }) => {
    return (
        <motion.div
            onClick={() => onClick(article)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-flo-orange/50 cursor-pointer transition-colors duration-300 h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {/* Cover Image Placeholder */}
            <div
                className="h-32 w-full relative overflow-hidden"
                style={{ backgroundImage: `url(${article.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />

                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {article.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-flo-orange transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                    {article.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readingTime}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-flo-orange group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogCard;
