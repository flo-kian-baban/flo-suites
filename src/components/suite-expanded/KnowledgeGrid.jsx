import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BlogGrid from './BlogGrid';
import ArticleView from './ArticleView';

const KnowledgeGrid = ({ articles, suiteId, title }) => {
    const [selectedArticle, setSelectedArticle] = useState(null);

    return (
        <div className="relative min-h-[600px]">
            <AnimatePresence mode="wait">
                {!selectedArticle ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BlogGrid
                            articles={articles}
                            onSelectArticle={setSelectedArticle}
                            title={title}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="article"
                        className="w-full"
                    >
                        <ArticleView
                            article={selectedArticle}
                            allArticles={articles}
                            onBack={(newArticle) => {
                                // If passed a new article (from Related), switch to it
                                // Otherwise go back to grid
                                if (newArticle && newArticle.id) {
                                    setSelectedArticle(newArticle);
                                } else {
                                    setSelectedArticle(null);
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KnowledgeGrid;
