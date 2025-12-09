import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase keys not found. Authentication features will be disabled.");
}

export const supabase = createClient(
    SUPABASE_URL, 
    SUPABASE_ANON_KEY
);

