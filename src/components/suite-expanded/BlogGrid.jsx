import React from 'react';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const BlogGrid = ({ articles, onSelectArticle, title = "The Knowledge Grid" }) => {
    return (
        <div className="w-full">
            <div className="mb-8">
                <h3 className="text-sm font-bold text-flo-orange uppercase tracking-widest pl-1 mb-2">
                    Start Learning
                </h3>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    {title}
                </h2>
            </div>


            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {articles.map((article) => (
                    <motion.div key={article.id} variants={item} className="">
                        <BlogCard
                            article={article}
                            onClick={onSelectArticle}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default BlogGrid;
