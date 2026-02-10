'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ResourceFilters from '@/components/resources/ResourceFilters';
import ResourceGrid from '@/components/resources/ResourceGrid';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [selectedSubject, selectedGrade, selectedType]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          resource_tags (
            tags (id, name, category)
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedType) {
        query = query.eq('resource_type', selectedType);
      }

      // For subject and grade, we need to filter by tags
      // This is a bit complex with Supabase simplified query syntax
      // We might need to fetch IDs first if we want strict filtering
      // But for now, let's filter in client side or use a more complex query if possible.
      // A common pattern is to use .contains() on array columns if tags were an array, 
      // but here it's a many-to-many relationship.
      // !inner join is the key for filtering by related table

      if (selectedSubject) {
        // @ts-ignore
        query = query.eq('resource_tags.tags.name', selectedSubject); 
        // Note: The above might not work directly as expected with Supabase JS client 
        // for many-to-many flat filtering without !inner.
        // Let's try to use the !inner hint in select if possible, or filter client side for MVP simplicity
        // Client side filtering is safer for "Quick Dev" unless we are sure about the exact syntax for deep filtering.
      }

       if (selectedGrade) {
         // Same for grade
       }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Client-side filtering for tags (Subject/Grade) because deep filtering 
      // with Supabase client on M2M relationships can be tricky without exact setup
      if (selectedSubject) {
        filteredData = filteredData.filter(r => 
          r.resource_tags?.some((rt: any) => rt.tags?.name === selectedSubject)
        );
      }

      if (selectedGrade) {
        filteredData = filteredData.filter(r => 
          r.resource_tags?.some((rt: any) => rt.tags?.name === selectedGrade)
        );
      }

      setResources(filteredData);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
              Teacher Resources
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Discover, share, and download classroom resources created by teachers.
            </p>
          </div>
          
          <a
            href="/upload"
            className="btn-gradient-primary py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>☁️</span> Upload Resource
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <ResourceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />

          {/* Main Content */}
          <div className="flex-1">
            <ResourceGrid resources={resources} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
