
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Post = {
    id: string;
    type: 'blog' | 'case_study';
    title: string;
    slug: string;
    category: string;
    cover_image: string;
    description: string;
    reading_time: string;
    content: any;
    published: boolean;
    created_at: string;
    updated_at: string;
};

export function usePosts(type?: 'blog' | 'case_study') {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        let query = supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data || []);
        }
        setIsLoading(false);
    }, [type]);

    // Auto-fetch on mount and when type changes
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('posts')
            .insert(post)
            .select()
            .single();

        if (error) throw error;
        setPosts(prev => [data, ...prev]);
        return data;
    };

    const updatePost = async (id: string, updates: Partial<Post>) => {
        const { data, error } = await supabase
            .from('posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        setPosts(prev => prev.map(p => p.id === id ? data : p));
        return data;
    };

    const deletePost = async (id: string) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    return {
        posts,
        isLoading,
        fetchPosts,
        createPost,
        updatePost,
        deletePost
    };
}
