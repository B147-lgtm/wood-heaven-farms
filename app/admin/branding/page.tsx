
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client.ts';
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin');
      fetchSettings();
    });
  }, [navigate]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}-${Math.random()}.${fileExt}`;
      const filePath = `site/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ [field]: publicUrl })
        .eq('id', 1);

      if (updateError) throw updateError;
      
      setSettings((prev: any) => ({ ...prev, [field]: publicUrl }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTextUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          brand_name: settings.brand_name,
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          tagline: settings.tagline,
          whatsapp_number: settings.whatsapp_number,
          phone_number: settings.phone_number,
          address_text: settings.address_text,
          map_url: settings.map_url,
          airbnb_url: settings.airbnb_url,
          instagram_url: settings.instagram_url
        })
        .eq('id', 1);

      if (error) throw error;
      alert('Heavenly settings synchronized.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-beige flex items-center justify-center font-serif text-2xl">Syncing Settings...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-beige px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">CMS Control Panel</span>
            <h1 className="text-5xl font-serif text-forest">Site Branding</h1>
          </div>
          <button onClick={() => navigate('/admin')} className="px-6 py-3 border border-forest/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-all">
            Back to Dashboard
          </button>
        </header>

        <form onSubmit={handleTextUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white/10">
              <h3 className="text-2xl font-serif text-forest mb-8">Site Content</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Hero Main Title</label>
                  <input type="text" value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Hero Subtitle</label>
                  <textarea value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Brand Name</label>
                    <input type="text" value={settings.brand_name} onChange={e => setSettings({...settings, brand_name: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Tagline</label>
                    <input type="text" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Physical Address</label>
                  <input type="text" value={settings.address_text} onChange={e => setSettings({...settings, address_text: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white/10">
              <h3 className="text-2xl font-serif text-forest mb-8">Contact & Social</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">WhatsApp Number</label>
                  <input type="text" value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Phone Number</label>
                  <input type="text" value={settings.phone_number} onChange={e => setSettings({...settings, phone_number: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Instagram URL</label>
                  <input type="text" value={settings.instagram_url} onChange={e => setSettings({...settings, instagram_url: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40">Airbnb Link</label>
                  <input type="text" value={settings.airbnb_url} onChange={e => setSettings({...settings, airbnb_url: e.target.value})} className="w-full bg-beige/40 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-forest" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white/10">
              <h3 className="text-xl font-serif text-forest mb-6">Media Assets</h3>
              <div className="space-y-6">
                <div className="p-4 bg-beige/20 rounded-2xl border border-dashed border-forest/10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40 block mb-3">Corporate Logo</label>
                  <img src={settings.logo_url} className="w-16 h-16 object-contain bg-forest rounded-lg mb-3" />
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} className="text-[9px]" />
                </div>
                <div className="p-4 bg-beige/20 rounded-2xl border border-dashed border-forest/10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40 block mb-3">Hero Media</label>
                  <input type="file" accept="image/*,video/mp4" onChange={(e) => handleFileUpload(e, e.target.files?.[0]?.type.startsWith('video') ? 'hero_video_url' : 'hero_image_url')} className="text-[9px]" />
                </div>
                <div className="p-4 bg-beige/20 rounded-2xl border border-dashed border-forest/10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40 block mb-3">Event Brochure (PDF)</label>
                  <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'brochure_url')} className="text-[9px]" />
                </div>
              </div>
            </div>
            
            <button disabled={saving} className="w-full bg-forest text-white py-6 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:bg-[#c5a059] transition-all disabled:opacity-50 text-xs">
              {saving ? 'Synchronizing...' : 'Save Branding Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
