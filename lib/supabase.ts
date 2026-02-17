import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables from various possible sources.
 * In Vite, variables are on import.meta.env.
 * In other environments (like Node.js or older builders), they might be on process.env.
 */
const getEnvVar = (key: string): string => {
  try {
    // 1. Try Vite's import.meta.env
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
    
    // 2. Try Node's process.env (as a fallback for certain build/test environments)
    if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
      return (process.env as any)[key];
    }
  } catch (err) {
    // Silently handle cases where meta or process might be inaccessible
  }
  return '';
};

// Check for both Vite-specific and Next.js-style prefixes for maximum compatibility
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';

/**
 * Fallback mock for when Supabase credentials are missing.
 * Prevents the application from crashing while displaying placeholders.
 */
const createMockBuilder = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  const builder: any = {
    then: (onfulfilled?: any, onrejected?: any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => promise.catch(onrejected),
    finally: (onfinally?: any) => promise.finally(onfinally),
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    match: () => builder,
    order: () => builder,
    single: () => createMockBuilder(Array.isArray(data) ? (data[0] || {}) : data),
    data,
    error: null
  };
  return builder;
};

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: (table: string) => createMockBuilder([]),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://via.placeholder.com/800x600?text=${path}` } }),
          remove: async (paths: string[]) => ({ data: null, error: null })
        })
      },
      auth: {
        signInWithPassword: async () => ({ data: { user: { id: 'mock', email: 'admin@test.com' } }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;
