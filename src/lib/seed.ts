
import { supabase } from '@/lib/supabaseClient';
import { marketingArticles } from '@/data/marketingArticles';
import { developmentCaseStudies } from '@/data/developmentCaseStudies';

export const seedDatabase = async () => {
    console.log('Seeding database...');

    // Seed Marketing Articles
    for (const article of marketingArticles) {
        const { error } = await supabase.from('posts').upsert({
            title: article.title,
            slug: article.id, // Using existing ID as slug
            type: 'blog',
            description: article.description,
            cover_image: article.coverImage,
            reading_time: article.readingTime,
            category: article.category,
            content: article.body,
            published: true
        }, { onConflict: 'slug' });

        if (error) console.error(`Error seeding ${article.title}:`, error);
    }

    // Seed Development Case Studies
    for (const study of developmentCaseStudies) {
        const { error } = await supabase.from('posts').upsert({
            title: study.title,
            slug: study.id,
            type: 'case_study',
            description: study.description,
            cover_image: study.coverImage,
            reading_time: study.readingTime,
            category: study.category,
            content: study.body,
            published: true
        }, { onConflict: 'slug' });

        if (error) console.error(`Error seeding ${study.title}:`, error);
    }

    console.log('Seeding complete.');
};
