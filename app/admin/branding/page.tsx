import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath);

      setSettings((prev: any) => ({ ...prev, [field]: publicUrl }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) return <div className="p-20 text-center font-serif">Loading configurations...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSave} className="bg-white rounded-[3rem] shadow-xl p-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-serif text-forest">Branding & Config</h1>
            <button 
              type="submit"
              disabled={saving}
              className="bg-forest text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all disabled:opacity-50"
            >
              {saving ? 'Syncing...' : 'Publish Changes'}
            </button>
          </div>
          
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Brand Logo</label>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-beige p-2 border">
                   {settings.logo_url && <img src={settings.logo_url} className="w-full h-full object-contain" />}
                </div>
                <input type="file" onChange={e => handleFileUpload(e, 'logo_url')} className="text-xs" accept="image/*" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Hero Image</label>
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-xl overflow-hidden border">
                   {settings.hero_image_url && <img src={settings.hero_image_url} className="w-full h-full object-cover" />}
                </div>
                <input type="file" onChange={e => handleFileUpload(e, 'hero_image_url')} className="text-xs" accept="image/*" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-earth/40 ml-1">Event Brochure (PDF)</label>
              <div className="flex flex-col gap-2">
                <input type="file" onChange={e => handleFileUpload(e, 'brochure_url')} className="text-xs" accept=".pdf" />
                {settings.brochure_url && <span className="text-[10px] text-green-600 font-bold">PDF Uploaded ✓</span>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}