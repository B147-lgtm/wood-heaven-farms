
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';

export const AdminLeads: React.FC = () => {
  const [stays, setStays] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stays' | 'events'>('stays');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin');
      fetchLeads();
    });
  }, [navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data: s } = await supabase.from('stay_enquiries').select('*').order('created_at', { ascending: false });
    const { data: e } = await supabase.from('event_enquiries').select('*').order('created_at', { ascending: false });
    if (s) setStays(s);
    if (e) setEvents(e);
    setLoading(false);
  };

  const updateStatus = async (table: string, id: string, status: string) => {
    await supabase.from(table).update({ status }).eq('id', id);
    fetchLeads();
  };

  if (loading) return <div className="min-h-screen bg-beige flex items-center justify-center font-serif text-2xl">Loading Leads...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-beige px-6">
      <div className="container mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">Management Center</span>
            <h1 className="text-5xl font-serif text-forest">Enquiries & Leads</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/admin')} className="px-6 py-3 border border-forest/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-all">Back</button>
            <div className="bg-white rounded-full p-1 border border-forest/10 flex">
              <button onClick={() => setActiveTab('stays')} className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'stays' ? 'bg-forest text-white' : 'text-forest'}`}>Stay Requests</button>
              <button onClick={() => setActiveTab('events')} className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-forest text-white' : 'text-forest'}`}>Event Requests</button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-forest text-white uppercase text-[9px] tracking-[0.3em]">
                <tr>
                  <th className="px-10 py-6">Date</th>
                  <th className="px-10 py-6">Guest Name</th>
                  <th className="px-10 py-6">Contact</th>
                  <th className="px-10 py-6">{activeTab === 'stays' ? 'Check-in/Out' : 'Event Info'}</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {(activeTab === 'stays' ? stays : events).map((item) => (
                  <tr key={item.id} className="text-sm hover:bg-beige/30 transition-colors">
                    <td className="px-10 py-6 text-[10px] opacity-40">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-10 py-6">
                      <p className="font-bold text-forest">{item.name}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest">{item.source || 'Direct'}</p>
                    </td>
                    <td className="px-10 py-6">
                      <p>{item.phone}</p>
                    </td>
                    <td className="px-10 py-6">
                      {activeTab === 'stays' ? (
                        <div>
                          <p className="font-medium">{item.checkin} to {item.checkout}</p>
                          <p className="text-[10px] opacity-50">{item.guests} Guests</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{item.event_type}</p>
                          <p className="text-[10px] opacity-50">{item.event_date} • {item.guests} Guests</p>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        item.status === 'booked' ? 'bg-green-100 text-green-700' : 
                        item.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-beige text-forest'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 flex gap-2">
                      <select 
                        className="bg-beige/50 border-none rounded-lg px-4 py-1 text-[10px] font-bold"
                        onChange={(e) => updateStatus(activeTab === 'stays' ? 'stay_enquiries' : 'event_enquiries', item.id, e.target.value)}
                        value={item.status}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                      </select>
                      <button onClick={() => window.open(`https://wa.me/${item.phone}`, '_blank')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
