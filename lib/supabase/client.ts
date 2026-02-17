import { supabase as unifiedSupabase } from '../supabase.ts';

/**
 * Re-exports the unified Supabase client for consistency.
 */
export const createBrowserClient = () => unifiedSupabase;
export const supabase = unifiedSupabase;