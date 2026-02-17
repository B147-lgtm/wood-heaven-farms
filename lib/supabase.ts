import { createClient } from '@supabase/supabase-js';

/**
 * PRODUCTION SUPABASE SETUP (Run in SQL Editor):
 * 
 * -- 1. Storage Buckets
 * INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
 * INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true) ON CONFLICT (id) DO NOTHING;
 * 
 * -- 2. Tables
 * CREATE TABLE IF NOT EXISTS public.admin_users (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   email TEXT UNIQUE NOT NULL
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.gallery_images (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   title TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   storage_path TEXT NOT NULL,
 *   sort_order INT DEFAULT 0,
 *   url TEXT NOT NULL,
 *   featured BOOLEAN DEFAULT false
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.site_settings (
 *   id INT PRIMARY KEY DEFAULT 1,
 *   updated_at TIMESTAMPTZ DEFAULT now(),
 *   brand_name TEXT DEFAULT 'Wood Heaven Farms',
 *   hero_title TEXT DEFAULT 'Welcome to Heaven',
 *   hero_subtitle TEXT,
 *   tagline TEXT DEFAULT 'Estd. 2024 • Luxury Farmhouse',
 *   logo_url TEXT,
 *   hero_image_url TEXT,
 *   hero_video_url TEXT,
 *   whatsapp_number TEXT DEFAULT '919876543210',
 *   address_text TEXT DEFAULT '123 Farmhouse Lane, NCR'
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.testimonials (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   context TEXT,
 *   text TEXT NOT NULL,
 *   image TEXT
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.highlights (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   icon TEXT, 
 *   sort_order INT DEFAULT 0
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.faqs (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   question TEXT NOT NULL,
 *   answer TEXT NOT NULL,
 *   sort_order INT DEFAULT 0
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.stay_enquiries (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   checkin DATE NOT NULL,
 *   checkout DATE NOT NULL,
 *   guests INT,
 *   message TEXT,
 *   source TEXT,
 *   status TEXT DEFAULT 'new'
 * );
 * 
 * CREATE TABLE IF NOT EXISTS public.event_enquiries (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   event_date DATE NOT NULL,
 *   event_type TEXT NOT NULL,
 *   guests INT,
 *   requirements TEXT,
 *   source TEXT,
 *   status TEXT DEFAULT 'new'
 * );
 * 
 * -- 3. Policies
 * ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (true);
 * CREATE POLICY "Admin manage gallery" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');
 */

const getEnv = (key: string) => {
  // Vite environment variables
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val) return val;
  }
  
  // Standard process.env fallback (for Vercel/Node environments)
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch {
    // ignore
  }
  return null;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || '';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';

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