import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client using the SERVICE ROLE key.
 * This bypasses all RLS policies — use ONLY for admin-side server operations.
 * Never expose this client to the browser.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
