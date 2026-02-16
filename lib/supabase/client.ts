
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : null;
  } catch {
    return null;
  }
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';

// Mocking function to create a chainable query builder
const createMockBuilder = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  
  const builder: any = {
    then: (onfulfilled?: any, onrejected?: any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => promise.catch(onrejected),
    finally: (onfinally?: any) => promise.finally(onfinally),
    select: () => builder,
    insert: () => builder,
    update: () => builder,
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

/**
 * Creates a Supabase client for use in the browser/client-side components.
 */
export const createBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      from: () => createMockBuilder([]),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'mock' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          remove: async () => ({ data: null, error: null })
        })
      },
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null })
      }
    } as any;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Default singleton instance for general client-side usage
export const supabase = createBrowserClient();
