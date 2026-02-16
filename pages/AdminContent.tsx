
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';
// Fix: Add missing framer-motion imports for UI components
import { motion, AnimatePresence } from 'framer-motion';

const TABLES = ['highlights', 'testimonials', 'faqs', 'offers'];

export const AdminContent: React.FC = () => {
  const [activeTable, setActiveTable] = useState<string>('testimonials');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin');
      fetchContent();
    });
  }, [activeTable]);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase.from(activeTable).select('*').order('id', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem.id) {
      await supabase.from(activeTable).update(editingItem).eq('id', editingItem.id);
    } else {
      const { id, ...newItem } = editingItem;
      await supabase.from(activeTable).insert([newItem]);
    }
    setEditingItem(null);
    fetchContent();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await supabase.from(activeTable).delete().eq('id', id);
      fetchContent();
    }
  };

  if (loading) return <div className="min-h-screen bg-beige flex items-center justify-center font-serif text-2xl">Loading Content...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-beige px-6">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">CMS Manager</span>
            <h1 className="text-5xl font-serif text-forest">Site Content</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/admin')} className="px-6 py-3 border border-forest/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-all">Back</button>
            <div className="bg-white rounded-full p-1 border border-forest/10 flex flex-wrap">
              {TABLES.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTable(t)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTable === t ? 'bg-forest text-white shadow-lg' : 'text-forest hover:bg-forest/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setEditingItem({})}
              className="bg-[#c5a059] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-forest shadow-xl transition-all"
            >
              Add New Item
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-white/10 group relative">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingItem(item)} className="p-2 bg-beige text-forest rounded-full hover:bg-forest hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] mb-2">ID: {item.id}</p>
                {activeTable === 'testimonials' && (
                  <div className="flex items-center gap-4 mb-4">
                    <img src={item.image} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-forest">{item.name}</h4>
                      <p className="text-[9px] uppercase tracking-widest opacity-50">{item.context}</p>
                    </div>
                  </div>
                )}
                {activeTable === 'faqs' && (
                  <h4 className="font-serif text-xl text-forest mb-2">{item.question || item.q}</h4>
                )}
                {activeTable === 'highlights' && (
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-[#c5a059]">{item.icon}</div>
                    <h4 className="font-bold text-forest">{item.name}</h4>
                  </div>
                )}
                <p className="text-sm text-earth/60 italic leading-relaxed">
                  "{item.text || item.a || item.answer || item.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] bg-forest/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl overflow-hidden relative"
            >
              <h3 className="text-3xl font-serif text-forest mb-8">Edit {activeTable.slice(0, -1)}</h3>
              <form onSubmit={handleSave} className="space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                {Object.keys(items[0] || {}).map(key => {
                  if (key === 'id' || key === 'created_at') return null;
                  return (
                    <div key={key} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-earth/40 ml-1">{key.replace('_', ' ')}</label>
                      <textarea 
                        value={editingItem[key] || ''} 
                        onChange={e => setEditingItem({...editingItem, [key]: e.target.value})} 
                        className="w-full bg-beige/40 border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-forest"
                        rows={key === 'text' || key === 'answer' || key === 'a' ? 4 : 1}
                      />
                    </div>
                  );
                })}
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 px-8 py-4 border border-forest/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-beige transition-all">Cancel</button>
                  <button type="submit" className="flex-1 px-8 py-4 bg-forest text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all shadow-xl">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
