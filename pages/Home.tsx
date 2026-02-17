
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AMENITIES as STATIC_AMENITIES, FAQs as STATIC_FAQS, GALLERY_IMAGES as STATIC_GALLERY, BRAND_ASSETS, TESTIMONIALS as STATIC_TESTIMONIALS, ICONS } from '../constants';
import { supabase } from '../lib/supabase';

// Full implementation of Home component to resolve compilation errors
export const Home: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Rooms', 'Pool', 'Lawn', 'Bar Garden'];

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }: any) => {
      if (data) setSettings(data);
    });
  }, []);

  const heroImage = settings?.hero_image_url || BRAND_ASSETS.heroImage;
  const heroTitle = settings?.hero_title || 'Welcome to Heaven';
  const heroSubtitle = settings?.hero_subtitle || 'A sanctuary of elegance and luxury.';

  const filteredGallery = activeCategory === 'All' 
    ? STATIC_GALLERY.slice(0, 6) 
    : STATIC_GALLERY.filter(img => img.category === activeCategory).slice(0, 6);

  return (
    <div className="bg-beige overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c5a059] uppercase tracking-[0.5em] font-bold text-xs mb-6"
          >
            {settings?.tagline || 'Estd. 2024 • Luxury Farmhouse'}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-5xl md:text-8xl font-serif mb-8 leading-tight"
          >
            {heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/stay" className="bg-[#c5a059] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all shadow-2xl">
              Book Your Stay
            </Link>
            <Link to="/events" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all">
              Host an Event
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Amenities Preview */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif text-forest mb-6">Designed for Comfort</h2>
            <div className="w-24 h-1 bg-[#c5a059] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATIC_AMENITIES.map((amenity, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="bg-white p-8 rounded-3xl shadow-sm text-center border border-earth/5"
              >
                <div className="text-earth mb-4 flex justify-center"><amenity.icon /></div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-forest">{amenity.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-32 bg-forest text-white px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-[#c5a059] uppercase tracking-widest text-xs font-bold mb-4">Glimpses of Grandeur</p>
              <h2 className="text-4xl md:text-6xl font-serif">The Property</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#c5a059] text-white' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((img) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={img.id} 
                  className="aspect-[4/3] rounded-[2rem] overflow-hidden group relative"
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold mb-2">{img.category}</p>
                    <h4 className="text-xl font-serif">{img.title}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-20 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-4 text-[#c5a059] uppercase tracking-[0.3em] font-bold text-xs hover:gap-6 transition-all">
              View Full Gallery
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif text-forest">Guest Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STATIC_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm border border-earth/5">
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] text-earth/40 uppercase tracking-widest">{t.context}</p>
                  </div>
                </div>
                <p className="text-earth/70 italic leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-beige px-6 border-t border-earth/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-serif text-forest text-center mb-20">Frequently Asked</h2>
          <div className="space-y-6">
            {STATIC_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <h4 className="font-serif text-xl text-forest mb-4">{faq.q}</h4>
                <p className="text-earth/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
