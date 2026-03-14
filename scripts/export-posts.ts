import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportPosts() {
  console.log('Fetching all posts from Supabase...');
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }

  console.log(`Found ${data?.length || 0} posts.`);

  // We want to generate a clean JS file `src/data/posts.js`
  if (!data || data.length === 0) {
    fs.writeFileSync(
        path.join(process.cwd(), 'src', 'data', 'posts.js'), 
        'export const posts = [];\n'
    );
    console.log('Created empty src/data/posts.js');
    return;
  }

  // Create a JS module instead of JSON so it's easy to edit
  const jsContent = `// Static export of blog and case study posts
// Edited manually - Supabase has been deprecated for this content

export const posts = ${JSON.stringify(data, null, 4)};
`;

  fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'posts.js'), jsContent);
  console.log('Successfully wrote src/data/posts.js');
}

exportPosts();
