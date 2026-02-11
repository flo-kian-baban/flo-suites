'use client';

/**
 * PostList - Displays and manages Blog or Case Study posts with inline editing
 * 
 * Features:
 * - Lists all posts with cover thumbnail, category, status, and date
 * - Expand/collapse posts to edit inline using InlinePostForm
 * - Create new posts inline
 * - Delete posts with confirmation
 */

import React, { useEffect, useState } from 'react';
import { usePosts, Post } from '@/hooks/usePosts';
import { Trash2, Plus, FileText, LayoutTemplate, ChevronDown } from 'lucide-react';
import InlinePostForm from './InlinePostForm';

interface PostListProps {
    type: 'blog' | 'case_study';
}

export default function PostList({ type }: PostListProps) {
    const { posts, isLoading, fetchPosts, createPost, updatePost, deletePost } = usePosts(type);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this content?')) {
            await deletePost(id);
            if (expandedPostId === id) {
                setExpandedPostId(null);
            }
        }
    };

    const handleSaveExisting = async (id: string, data: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
        await updatePost(id, data);
        setExpandedPostId(null);
    };

    const handleCreateNew = async (data: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
        await createPost(data);
        setIsCreatingNew(false);
    };

    const toggleExpand = (postId: string) => {
        if (isCreatingNew) {
            setIsCreatingNew(false);
        }
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    const handleStartCreate = () => {
        setExpandedPostId(null);
        setIsCreatingNew(true);
    };

    const handleCancelCreate = () => {
        setIsCreatingNew(false);
    };

    const handleCancelEdit = () => {
        setExpandedPostId(null);
    };

    if (isLoading) {
        return <div className="text-white/50 text-center py-12">Loading content...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {type === 'blog' ? <FileText className="w-5 h-5 text-purple-400" /> : <LayoutTemplate className="w-5 h-5 text-blue-400" />}
                        {type === 'blog' ? 'Marketing Blogs' : 'Case Studies'}
                    </h2>
                    <p className="text-sm text-white/50">
                        {posts.length} {type === 'blog' ? 'articles' : 'projects'} published
                    </p>
                </div>
                <button
                    onClick={handleStartCreate}
                    disabled={isCreatingNew}
                    className="flex items-center gap-2 px-4 py-2 bg-flo-orange text-white rounded-lg hover:bg-flo-orange/90 transition-colors font-medium text-sm disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    New {type === 'blog' ? 'Article' : 'Case Study'}
                </button>
            </div>

            {/* New Post Form */}
            {isCreatingNew && (
                <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-flo-orange/5">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4 text-flo-orange" />
                            New {type === 'blog' ? 'Article' : 'Case Study'}
                        </h3>
                    </div>
                    <InlinePostForm
                        type={type}
                        onSave={handleCreateNew}
                        onCancel={handleCancelCreate}
                        isNew={true}
                    />
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-3">
                {posts.length === 0 && !isCreatingNew ? (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 text-white/40">
                        No content found. Create your first {type === 'blog' ? 'article' : 'case study'} to get started.
                    </div>
                ) : (
                    posts.map((post) => {
                        const isExpanded = expandedPostId === post.id;

                        return (
                            <div
                                key={post.id}
                                className="bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all"
                            >
                                {/* Post Header / Row */}
                                <div
                                    onClick={() => toggleExpand(post.id)}
                                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    {/* Cover Thumbnail */}
                                    <div
                                        className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 border border-white/10"
                                        style={{
                                            background: post.cover_image?.includes('gradient')
                                                ? post.cover_image
                                                : post.cover_image
                                                    ? `url(${post.cover_image})`
                                                    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                                        }}
                                    />

                                    {/* Post Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-white/60">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                            {post.published ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400">Published</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-yellow-500/10 text-yellow-500">Draft</span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-bold truncate">{post.title}</h3>
                                        <p className="text-xs text-white/40 truncate">
                                            Last updated {new Date(post.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleDelete(post.id, e)}
                                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Expanded Inline Editor */}
                                {isExpanded && (
                                    <InlinePostForm
                                        type={type}
                                        initialPost={post}
                                        onSave={(data) => handleSaveExisting(post.id, data)}
                                        onCancel={handleCancelEdit}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
