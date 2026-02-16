
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AMENITIES as STATIC_AMENITIES, FAQs as STATIC_FAQS, GALLERY_IMAGES as STATIC_GALLERY, BRAND_ASSETS, TESTIMONIALS as STATIC_TESTIMONIALS, ICONS } from '../constants.tsx';
import { supabase } from '../lib/supabase.ts';

const Hero = ({ settings }: { settings: any }) => {
  const brandName = settings?.brand_name || 'Wood Heaven Farms';
  const tagline = settings?.tagline || 'Estd. 2024 • Luxury Farmhouse';
  const heroImg = settings?.hero_image_url || BRAND_ASSETS.heroImage;
  const heroVid = settings?.hero_video_url;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {heroVid ? (
        <video 
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVid} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-110" 
          style={{ backgroundImage: `url(${heroImg})` }}
        />
      )}

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 p-1 rounded-full border border-white/20 bg-forest/30 backdrop-blur-sm"
        >
          <img src={settings?.logo_url || BRAND_ASSETS.logo} alt="" className="w-20 h-20 rounded-full object-contain bg-forest" />
        </motion.div>
        
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#c5a059] uppercase tracking-[0.5em] text-[10px] mb-4 font-bold"
        >
          {tagline}
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white font-serif text-5xl md:text-8xl mb-12 max-w-4xl leading-tight"
        >
          {settings?.hero_title || brandName}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <Link to="/stay" className="bg-white text-forest px-12 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl">
            Reserve Your Stay
          </Link>
          <Link to="/events" className="bg-transparent border border-white/30 text-white px-12 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-forest transition-all backdrop-blur-md">
            Host an Event
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 64, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute top-0 left-0 w-full h-6 bg-white shadow-[0_0_10px_white]"
          />
        </div>
      </div>
    </div>
  );
};

const Highlights = ({ data }: { data: any[] }) => {
  const highlights = data.length > 0 ? data : STATIC_AMENITIES;
  return (
    <section className="py-32 bg-beige px-6 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#c5a059] uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Legacy of Luxury</span>
            <h2 className="text-4xl md:text-6xl font-serif text-forest mb-8 leading-[1.1]">
              A heritage <br /> of tranquility.
            </h2>
            <p className="text-earth/70 text-lg leading-relaxed mb-12 max-w-lg font-light">
              Crafted with a vision of blending architectural brilliance with the raw beauty of nature. Every corner of Wood Heaven Farms is designed to evoke peace and luxury in equal measure.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => {
                const Icon = typeof item.icon === 'function' ? item.icon : (ICONS as any)[item.icon] || ICONS.Home;
                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 bg-white px-7 py-5 rounded-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-12px_rgba(197,160,89,0.25)] border border-white/50 group transition-all duration-500 cursor-default"
                  >
                    <div className="w-12 h-12 flex items-center justify-center text-forest bg-beige/50 rounded-xl group-hover:bg-forest group-hover:text-white transition-all duration-500 shrink-0 shadow-inner">
                      <Icon />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-forest/80 group-hover:text-forest transition-colors whitespace-nowrap">
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          
          <div className="relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="aspect-[4/5] bg-cover bg-center rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-white relative z-10" 
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200)' }} 
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#c5a059] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-pulse" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-forest rounded-full mix-blend-multiply filter blur-[80px] opacity-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ data }: { data: any[] }) => {
  const testimonials = data.length > 0 ? data : STATIC_TESTIMONIALS;
  return (
    <section className="py-32 bg-white px-6">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#c5a059] uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Guest Experiences</span>
          <h2 className="text-4xl md:text-5xl font-serif text-forest mb-6">Stories from Heaven</h2>
          <div className="w-24 h-[1px] bg-beige mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-beige/30 border border-beige flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group"
            >
              <div>
                <div className="text-[#c5a059] mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/></svg>
                </div>
                <p className="font-serif text-xl italic text-forest/80 leading-relaxed mb-10">"{t.text}"</p>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-3 rounded-full shadow-sm w-fit pr-6 group-hover:shadow-md transition-all">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-forest">{t.name}</h4>
                  <span className="text-[9px] uppercase tracking-widest text-[#c5a059] font-bold">{t.context}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GalleryPreview = ({ data }: { data: any[] }) => {
  const gallery = data.length > 0 ? data.slice(0, 8) : STATIC_GALLERY.slice(0, 8);
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-forest mb-6">Signature Spaces</h2>
        <div className="w-24 h-[1px] bg-[#c5a059] mx-auto mb-8" />
        <Link to="/gallery" className="text-earth/40 uppercase tracking-[0.4em] text-[10px] font-bold hover:text-forest transition-colors">Experience the Portfolio</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {gallery.map((img, idx) => (
          <motion.div 
            key={img.id || idx}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden group cursor-pointer ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}
          >
            <img src={img.url} alt={img.title} className="w-full h-[400px] object-cover rounded-3xl" />
            <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center rounded-3xl">
              <span className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold mb-4">{img.category}</span>
              <h4 className="text-white font-serif text-2xl">{img.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FAQ = ({ data }: { data: any[] }) => {
  const faqs = data.length > 0 ? data : STATIC_FAQS;
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-32 bg-forest text-white px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">Concierge Services</h2>
          <p className="text-[#c5a059] uppercase tracking-[0.3em] text-[10px] font-bold">Frequently Asked Questions</p>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5">
              <button 
                className="w-full flex justify-between items-center p-8 text-left group"
                onClick={() => setActive(active === idx ? null : idx)}
              >
                <span className="text-lg font-serif group-hover:text-[#c5a059] transition-colors">{faq.q || faq.question}</span>
                <span className={`text-2xl transition-transform duration-500 ${active === idx ? 'rotate-45 text-[#c5a059]' : ''}`}>+</span>
              </button>
              <AnimatePresence>
                {active === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-8 pb-8 text-white/50 text-sm leading-relaxed"
                  >
                    {faq.a || faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  const [settings, setSettings] = useState<any>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: s }, { data: h }, { data: t }, { data: g }, { data: f }] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).single(),
        supabase.from('highlights').select('*').order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('id', { ascending: true }),
        supabase.from('gallery_images').select('*').eq('featured', true).order('sort_order', { ascending: true }),
        supabase.from('faqs').select('*').order('sort_order', { ascending: true })
      ]);

      if (s) setSettings(s);
      if (h) setHighlights(h);
      if (t) setTestimonials(t);
      if (g) setGallery(g);
      if (f) setFaqs(f);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Hero settings={settings} />
      <Highlights data={highlights} />
      <GalleryPreview data={gallery} />
      <Testimonials data={testimonials} />
      <FAQ data={faqs} />
    </div>
  );
};
