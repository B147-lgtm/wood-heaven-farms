
import React from 'react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-beige">
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h1 className="text-6xl font-serif text-forest mb-8">Get in Touch</h1>
              <p className="text-earth/60 text-lg mb-12 max-w-md">Have questions about Wood Heaven Farms? We're here to help you plan your perfect stay or event.</p>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-earth shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Address</h4>
                    <p className="text-earth/60">123 Farmhouse Lane, Green Valley Estate, Delhi-NCR Border.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-earth shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Email & Phone</h4>
                    <p className="text-earth/60">hello@woodheaven.com</p>
                    <p className="text-earth/60">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Follow us on Instagram</h4>
                <div className="flex gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-16 h-16 bg-earth/10 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                      <img src={`https://picsum.photos/seed/${i}/100`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl h-[600px] border-8 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.1234567890!2d77.1234567890!3d28.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDA3JzI0LjUiTiA3N8KwMDcnMjQuNSJF!5e0!3m2!1sen!2sin!4v1234567890" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
