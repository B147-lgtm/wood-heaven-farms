import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const TABLES = ['highlights', 'testimonials', 'faqs', 'offers'];

export const AdminContent: React.FC = () => {
  const [activeTable, setActiveTable] = useState<string>('testimonials');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!session) navigate('/admin');
      fetchContent();
    });
  }, [activeTable]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTable)
        .select('*')
        .order('id', { ascending: false });
      if (data) setItems(data);
    } catch (err) {
      console.error(`Error fetching ${activeTable}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    const { error } = await supabase.from(activeTable).delete().eq('id', id);
    if (!error) fetchContent();
  };

  if (loading) return <div className="p-20 text-center font-serif">Syncing content...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl p-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <h1 className="text-4xl font-serif text-forest capitalize">{activeTable} Manager</h1>
            <div className="flex bg-beige p-1 rounded-2xl overflow-x-auto max-w-full">
              {TABLES.map(table => (
                <button 
                  key={table}
                  onClick={() => setActiveTable(table)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTable === table ? 'bg-forest text-white shadow-lg' : 'text-forest hover:bg-forest/5'}`}
                >
                  {table}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="bg-beige/40 p-8 rounded-[2rem] border border-white group relative">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => deleteItem(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-sm">×</button>
                </div>
                {activeTable === 'testimonials' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} className="w-10 h-10 rounded-full object-cover" />}
                      <h4 className="font-bold text-forest">{item.name}</h4>
                    </div>
                    <p className="text-sm italic text-earth/60">"{item.text}"</p>
                  </div>
                )}
                {activeTable === 'faqs' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg text-forest leading-snug">{item.question}</h4>
                    <p className="text-xs text-earth/60 leading-relaxed">{item.answer}</p>
                  </div>
                )}
                {activeTable === 'highlights' && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-forest shadow-sm">{item.icon}</div>
                    <h4 className="font-bold text-forest">{item.name}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};