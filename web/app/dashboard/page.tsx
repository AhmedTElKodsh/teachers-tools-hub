'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import AuthModal from '@/components/AuthModal';
import ResourceGrid from '@/components/resources/ResourceGrid';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, showAuthModal, setShowAuthModal } = useRequireAuth();
  const [activeTab, setActiveTab] = useState('uploads');
  const [loading, setLoading] = useState(true);
  
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [myFavorites, setMyFavorites] = useState<any[]>([]);
  const [myDownloads, setMyDownloads] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch Uploads
      const { data: uploads } = await supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          resource_tags (
            tags (id, name, category)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setMyUploads(uploads || []);

      // Fetch Favorites
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          resource:resources (
            *,
            profiles:user_id (full_name, avatar_url),
            resource_tags (
              tags (id, name, category)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Transform favorites data structure
      const formattedFavorites = favorites?.map((f: any) => f.resource).filter(Boolean) || [];
      setMyFavorites(formattedFavorites);

      // Fetch Downloads (Unique resources)
      const { data: downloads } = await supabase
        .from('downloads')
        .select(`
          resource:resources (
            *,
            profiles:user_id (full_name, avatar_url),
            resource_tags (
              tags (id, name, category)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });

       // Deduplicate downloads
       const uniqueDownloads = new Map();
       downloads?.forEach((d: any) => {
         if (d.resource && !uniqueDownloads.has(d.resource.id)) {
           uniqueDownloads.set(d.resource.id, d.resource);
         }
       });
       setMyDownloads(Array.from(uniqueDownloads.values()));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c96847]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#7a9d7e] flex items-center justify-center text-4xl text-white font-bold">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {profile?.full_name || 'Teacher'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
                  <span className="block text-xl font-bold text-[#c96847]">{profile?.reputation_score || 0}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Reputation</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
                  <span className="block text-xl font-bold text-[#c96847]">{myUploads.length}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Uploads</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
                  <span className="block text-xl font-bold text-[#c96847]">{myDownloads.length}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Downloads</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'uploads'
                ? 'border-b-2 border-[#c96847] text-[#c96847]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Uploads
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-b-2 border-[#c96847] text-[#c96847]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'border-b-2 border-[#c96847] text-[#c96847]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Download History
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'uploads' && (
            <div>
              {myUploads.length > 0 ? (
                <ResourceGrid resources={myUploads} loading={false} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">You haven't uploaded any resources yet.</p>
                  <a href="/upload" className="btn-gradient-primary py-2 px-6 rounded-lg font-semibold text-white">
                    Upload Your First Resource
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <ResourceGrid resources={myFavorites} loading={false} />
          )}

          {activeTab === 'downloads' && (
             <ResourceGrid resources={myDownloads} loading={false} />
          )}
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          if (!user) router.push('/');
        }} 
      />
    </div>
  );
}
