import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findGlobalContent() {
    console.log("Searching for the global content JSON...");
    
    // Check 'content' table (we tried this, it failed, but maybe we can list tables?)
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (tablesError) {
        console.error("Could not list tables:", tablesError);
    } else {
        console.log("Public Tables:");
        tablesData.forEach(t => console.log(`- ${t.table_name}`));
        
        // Let's check common tables for 'content_json' or similar
        for (const t of tablesData) {
            const { data, error } = await supabase.from(t.table_name).select('*').limit(1);
            if (!error && data && data.length > 0) {
                console.log(`\nTable ${t.table_name} has data. Columns: ${Object.keys(data[0]).join(', ')}`);
            }
        }
    }
}

findGlobalContent().then(() => process.exit(0));
