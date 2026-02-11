const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'flo-content';
const CONFIG_FILE_PATH = 'config/site-content.json';

const initialConfig = {
    studio: {
        showcase: {
            capture: null,
            cut: null,
            deploy: null
        },
        reels: [
            { id: 1, title: 'Brand Reveal', description: 'Cinematic brand identity unveiling.', duration: '0:24', poster: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)', videoUrl: null },
            { id: 2, title: 'Product Launch', description: 'Dynamic product showcase.', duration: '0:18', poster: 'linear-gradient(135deg, #16213e 0%, #F1592D 100%)', videoUrl: null },
            { id: 3, title: 'BTS Session', description: 'Behind-the-scenes look.', duration: '0:32', poster: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)', videoUrl: null },
            { id: 4, title: 'Client Story', description: 'Authentic testimonial.', duration: '0:45', poster: 'linear-gradient(135deg, #533483 0%, #e94560 100%)', videoUrl: null },
            { id: 5, title: 'Creative Process', description: 'Ideation and execution.', duration: '0:28', poster: 'linear-gradient(135deg, #e94560 0%, #ff7d55 100%)', videoUrl: null },
            { id: 6, title: 'Social Highlight', description: 'Vertical content.', duration: '0:15', poster: 'linear-gradient(135deg, #F1592D 0%, #1a1a2e 100%)', videoUrl: null }
        ]
    },
    suites: {
        'flo-os': {
            headerVideo: `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/content/suites/flo-os/header-1770405197179.mp4`
        }
    }
};

async function init() {
    console.log('📝 Creating site-content.json config file...');

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(CONFIG_FILE_PATH, JSON.stringify(initialConfig, null, 2), {
            upsert: true,
            contentType: 'application/json'
        });

    if (error) {
        console.error('❌ Failed to create config:', error.message);
        process.exit(1);
    }

    console.log('✅ Config file created successfully!');
    console.log('📍 Path:', CONFIG_FILE_PATH);
    console.log('🎬 Flo OS header video:', initialConfig.suites['flo-os'].headerVideo);
}

init();
