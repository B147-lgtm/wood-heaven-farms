import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', session.user.email)
        .single();

      if (adminUser) {
        setIsAuthorized(true);
      } else {
        await supabase.auth.signOut();
        setAuthError('Access Denied: Not an authorized admin.');
      }
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.user) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', data.user.email)
        .single();

      if (adminUser) {
        setIsAuthorized(true);
      } else {
        await supabase.auth.signOut();
        setAuthError('Authorized login required.');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(false);
  };

  if (loading) return <div className="min-h-screen bg-forest flex items-center justify-center text-white font-serif text-2xl">Checking Heaven's Gate...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest px-6">
        <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl border-8 border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-forest mb-2">Management Portal</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth/40 font-bold">Wood Heaven Farms</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {authError && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center bg-red-50 py-2 rounded-lg">{authError}</p>}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold ml-1 text-earth/60">Admin Email</label>
              <input 
                type="email" placeholder="admin@woodheaven.com" 
                className="w-full bg-beige border-none px-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-forest"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold ml-1 text-earth/60">Access Key</label>
              <input 
                type="password" placeholder="••••••••" 
                className="w-full bg-beige border-none px-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-forest"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-forest text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all shadow-xl text-xs">
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-serif text-forest mb-2">Dashboard</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-earth/40 font-bold">Welcome back back to the Command Center.</p>
          </div>
          <button onClick={handleLogout} className="px-8 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
            Logout Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/admin/branding" className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group border border-white/10">
            <div className="w-16 h-16 bg-forest text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <h3 className="text-2xl font-serif text-forest mb-2">Branding</h3>
            <p className="text-xs text-earth/50">Logos, Colors, Hero Content & Contact Info.</p>
          </Link>

          <Link to="/admin/content" className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group border border-white/10">
            <div className="w-16 h-16 bg-[#c5a059] text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <h3 className="text-2xl font-serif text-forest mb-2">Content</h3>
            <p className="text-xs text-earth/50">Manage Testimonials, FAQs, Highlights & Offers.</p>
          </Link>

          <Link to="/admin/gallery" className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group border border-white/10">
            <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-2xl font-serif text-forest mb-2">Gallery</h3>
            <p className="text-xs text-earth/50">Bulk upload and organize your portfolio photos.</p>
          </Link>

          <Link to="/admin/leads" className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group border border-white/10">
            <div className="w-16 h-16 bg-green-800 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <h3 className="text-2xl font-serif text-forest mb-2">Leads</h3>
            <p className="text-xs text-earth/50">Track Stay Enquiries and Event Requests.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};