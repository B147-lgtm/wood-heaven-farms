import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  try {
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) return meta.env[key];
    if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) return (process.env as any)[key];
  } catch (err) {}
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';

const isProd = getEnvVar('NODE_ENV') === 'production';

if (isProd && (!supabaseUrl || !supabaseKey)) {
  throw new Error('Supabase production keys missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Mocking function for local development without keys
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
    limit: () => builder,
    single: () => createMockBuilder(Array.isArray(data) ? (data[0] || {}) : data),
    maybeSingle: () => createMockBuilder(Array.isArray(data) ? (data[0] || null) : data),
    data,
    error: null
  };
  return builder;
};

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: (table: string) => {
        console.warn(`Supabase: Table "${table}" is being accessed but no API keys found. Using mock data.`);
        return createMockBuilder([]);
      },
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://via.placeholder.com/800x600?text=${path}` } }),
          remove: async (paths: string[]) => ({ data: null, error: null })
        })
      },
      auth: {
        signInWithPassword: async () => ({ data: { user: { id: 'mock', email: 'admin@woodheaven.com' } }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;
