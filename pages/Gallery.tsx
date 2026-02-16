
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES as STATIC_IMAGES } from '../constants.tsx';
import { supabase } from '../lib/supabase.ts';

const CATEGORIES = ['All', 'Rooms', 'Pool', 'Lawn', 'Night Vibes', 'Bar Garden'];

export const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      // Fetching from the newly created gallery_images table
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        setImages(data);
      } else {
        // Fallback to high-quality static assets if DB is empty
        setImages(STATIC_IMAGES);
      }
    } catch (e) {
      console.error('Error fetching gallery images:', e);
      setImages(STATIC_IMAGES);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-beige">
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#c5a059] uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Our Portfolio</span>
            <h1 className="text-6xl md:text-7xl font-serif text-forest mb-6">Visual Journey</h1>
            <p className="text-earth/60 uppercase tracking-[0.4em] text-[10px] font-bold mb-12">Captured Moments of Luxury & Tranquility</p>
          </motion.div>
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border ${
                  filter === cat 
                  ? 'bg-forest text-white border-forest shadow-2xl scale-105' 
                  : 'bg-white/50 text-forest border-forest/10 hover:bg-forest/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square shimmer rounded-[2.5rem] border-4 border-white shadow-lg" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode='popLayout'>
                {filtered.map((img, index) => (
                  <motion.div 
                    key={img.id || img.url || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    onClick={() => setSelectedImage(img)}
                    className="relative aspect-square cursor-zoom-in group overflow-hidden rounded-[2.5rem] shadow-xl border-4 border-white bg-white"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-10 text-center">
                      <span className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.3em] mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.category}</span>
                      <h3 className="text-white font-serif text-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{img.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-40">
              <p className="font-serif text-2xl text-forest/40">No memories found in this category.</p>
              <button onClick={() => setFilter('All')} className="mt-6 text-[#c5a059] font-bold uppercase tracking-widest text-[10px] underline">View All</button>
            </div>
          )}
        </div>
      </section>

      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-forest/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group w-full h-full flex flex-col items-center justify-center">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-[70vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border-8 border-white/5" 
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center text-white max-w-2xl"
                >
                  <span className="text-[#c5a059] text-[11px] uppercase tracking-[0.6em] font-bold mb-4 block">{selectedImage.category}</span>
                  <h3 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">{selectedImage.title}</h3>
                  <div className="w-16 h-[1px] bg-white/20 mx-auto mt-8" />
                </motion.div>
              </div>

              <button 
                className="absolute top-0 right-0 md:top-4 md:right-4 w-14 h-14 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white hover:text-forest transition-all border border-white/10 group shadow-2xl"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
