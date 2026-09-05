import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qniqutaavdjnutnprjdk.supabase.co';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tGVak047cB4wd8fRvPhOig_hiNU4i6t';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
