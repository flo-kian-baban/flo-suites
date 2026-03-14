import { useState, useCallback, useEffect } from 'react';
import { posts as staticPosts } from '@/data/posts';

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

    useEffect(() => {
        const filtered = type 
            ? staticPosts.filter(p => p.type === type && p.published) 
            : staticPosts.filter(p => p.published);
            
        // Provide the static posts immediately simulating a fast fetch
        setPosts(filtered as Post[]);
    }, [type]);

    return {
        posts,
        isLoading: false,
    };
}
