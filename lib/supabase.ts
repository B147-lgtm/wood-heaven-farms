
import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION SUPABASE SETUP (Run in SQL Editor):
 * 
 * -- 1. Create storage buckets
 * INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
 * INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true) ON CONFLICT (id) DO NOTHING;
 * 
 * -- 2. Tables
 * CREATE TABLE IF NOT EXISTS public.gallery_images (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   title TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   storage_path TEXT NOT NULL,
 *   sort_order INT DEFAULT 0,
 *   url TEXT NOT NULL
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.site_settings (
 *   id INT PRIMARY KEY DEFAULT 1,
 *   updated_at TIMESTAMPTZ DEFAULT now(),
 *   brand_name TEXT DEFAULT 'Wood Heaven Farms',
 *   tagline TEXT DEFAULT 'Estd. 2024 • Luxury Farmhouse',
 *   logo_url TEXT,
 *   hero_image_url TEXT,
 *   hero_video_url TEXT,
 *   whatsapp_number TEXT DEFAULT '919876543210'
 * );
 * 
 * -- Initial Row
 * INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
 * 
 * -- 3. Enable RLS
 * ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
 * 
 * -- 4. Policies
 * CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (true);
 * CREATE POLICY "Admin manage gallery" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');
 * 
 * CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
 * CREATE POLICY "Admin update settings" ON public.site_settings FOR UPDATE USING (auth.role() = 'authenticated');
 * 
 * -- 5. Storage Policies
 * CREATE POLICY "Public read branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
 * CREATE POLICY "Admin manage branding" ON storage.objects FOR ALL USING (bucket_id = 'branding' AND auth.role() = 'authenticated');
 */

const getEnv = (key: string) => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] : null;
  } catch {
    return null;
  }
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';

// Mocking function to create a chainable query builder
const createMockBuilder = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  
  const builder: any = {
    // Methods for result handling
    then: (onfulfilled?: any, onrejected?: any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => promise.catch(onrejected),
    finally: (onfinally?: any) => promise.finally(onfinally),

    // Chainable query methods
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    match: () => builder,
    order: () => builder,
    single: () => createMockBuilder(Array.isArray(data) ? (data[0] || {}) : data),
    
    // Legacy support for direct property access
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
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://via.placeholder.com/800x600?text=Uploaded+${path}` } }),
          remove: async (paths: string[]) => ({ data: null, error: null })
        })
      },
      auth: {
        signInWithPassword: async () => ({ data: { user: { id: 'mock-user' } }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;
