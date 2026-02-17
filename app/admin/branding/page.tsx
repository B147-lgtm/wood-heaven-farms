
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function AdminBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    brand_name: 'Wood Heaven Farms',
    hero_title: '',
    hero_subtitle: '',
    tagline: '',
    logo_url: '',
    hero_image_url: '',
    hero_video_url: '',
    brochure_url: '',
    whatsapp_number: '',
    phone_number: '',
    address_text: '',
    map_url: '',
    airbnb_url: '',
    instagram_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!session) navigate('/admin');
      fetchSettings();
    });
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (data) setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Full implementation of save settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
      if (error) throw error;
      alert('Settings updated successfully');
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSave} className="bg-white rounded-[3rem] shadow-xl p-12">
          <h1 className="text-4xl font-serif text-forest mb-12">Branding & Config</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Brand Name</label>
              <input value={settings.brand_name} onChange={e => setSettings({...settings, brand_name: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">WhatsApp (91...)</label>
              <input value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4" />
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Hero Title</label>
              <input value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4 text-xl font-serif" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Hero Subtitle</label>
              <textarea value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4 h-32" />
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Hero Image URL</label>
              <input value={settings.hero_image_url} onChange={e => setSettings({...settings, hero_image_url: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Logo URL</label>
              <input value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} className="w-full bg-beige border-none rounded-2xl px-6 py-4" />
            </div>
          </div>

          <button 
            disabled={saving}
            className="w-full bg-forest text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
