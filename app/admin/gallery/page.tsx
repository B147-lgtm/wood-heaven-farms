
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase/client.ts';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Rooms', 'Pool', 'Lawn', 'Night Vibes', 'Bar Garden'];

interface UploadJob {
  id: string;
  file: File;
  title: string;
  category: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function AdminGalleryPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [globalCategory, setGlobalCategory] = useState('Rooms');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/admin');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Fix: Explicitly cast Array.from result to File[] to ensure correct type inference during mapping
    const newFiles = Array.from(e.target.files) as File[];
    const newJobs: UploadJob[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.split('.')[0],
      category: globalCategory,
      progress: 0,
      status: 'pending'
    }));
    setJobs(prev => [...prev, ...newJobs]);
  };

  const updateJob = (id: string, updates: Partial<UploadJob>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const startUploads = async () => {
    const pendingJobs = jobs.filter(j => j.status === 'pending');
    
    for (const job of pendingJobs) {
      updateJob(job.id, { status: 'uploading' });
      
      try {
        const fileExt = job.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `memories/${fileName}`;

        // 1. Storage Upload
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, job.file, {
            upsert: false
          });

        if (uploadError) throw uploadError;

        // 2. Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // 3. Database Entry
        const { error: dbError } = await supabase.from('gallery_images').insert([{
          title: job.title,
          category: job.category,
          storage_path: filePath,
          url: publicUrl,
          sort_order: 0 // Default or handle logic for order
        }]);

        if (dbError) throw dbError;

        updateJob(job.id, { status: 'completed', progress: 100 });
      } catch (err: any) {
        updateJob(job.id, { status: 'error', error: err.message });
      }
    }
  };

  const clearCompleted = () => {
    setJobs(prev => prev.filter(j => j.status !== 'completed'));
  };

  if (loading) return <div className="min-h-screen bg-beige flex items-center justify-center font-serif text-2xl">Verifying Access...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-beige px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">Admin Portal</span>
            <h1 className="text-5xl font-serif text-forest">Gallery Manager</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-forest/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-all"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-forest text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all shadow-xl"
            >
              Select Photos
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />
          </div>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 p-8 md:p-12">
          {jobs.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-forest/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-xl font-serif text-forest/40">No photos selected for upload</h3>
              <p className="text-xs text-earth/30 uppercase tracking-widest mt-2">Pick memories to publish to heaven.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-beige/50 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth/60">Bulk Category</label>
                  <select 
                    className="bg-white border-none rounded-full px-6 py-2 text-xs font-bold"
                    value={globalCategory}
                    onChange={(e) => {
                      setGlobalCategory(e.target.value);
                      setJobs(prev => prev.map(j => j.status === 'pending' ? { ...j, category: e.target.value } : j));
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={clearCompleted}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600"
                  >
                    Clear Completed
                  </button>
                  <button 
                    onClick={startUploads}
                    className="bg-forest text-white px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-earth transition-all"
                  >
                    Start Batch Upload ({jobs.filter(j => j.status === 'pending').length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className={`p-4 rounded-3xl border transition-all flex items-center gap-6 ${job.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-white border-beige'}`}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-beige flex-shrink-0">
                      <img src={URL.createObjectURL(job.file)} className="w-full h-full object-cover" alt="" />
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={job.title}
                        onChange={(e) => updateJob(job.id, { title: e.target.value })}
                        disabled={job.status !== 'pending'}
                        className="bg-beige/40 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-forest"
                        placeholder="Image Title"
                      />
                      <select 
                        value={job.category}
                        onChange={(e) => updateJob(job.id, { category: e.target.value })}
                        disabled={job.status !== 'pending'}
                        className="bg-beige/40 border-none rounded-xl px-4 py-2 text-xs font-bold"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="w-32 flex flex-col items-end gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${
                        job.status === 'completed' ? 'text-green-500' : 
                        job.status === 'error' ? 'text-red-500' : 'text-forest/40'
                      }`}>
                        {job.status}
                      </span>
                      {job.status === 'uploading' && (
                        <div className="w-full h-1 bg-beige rounded-full overflow-hidden">
                          <div className="h-full bg-forest animate-pulse w-1/2" />
                        </div>
                      )}
                      {job.status === 'error' && (
                        <p className="text-[8px] text-red-400 line-clamp-1">{job.error}</p>
                      )}
                    </div>

                    {job.status === 'pending' && (
                      <button 
                        onClick={() => setJobs(prev => prev.filter(j => j.id !== job.id))}
                        className="p-2 text-earth/20 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
