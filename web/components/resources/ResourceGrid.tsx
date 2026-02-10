'use client';

import React from 'react';
import ResourceCard from '../ResourceCard';

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  download_count: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
  resource_tags?: {
    tags: {
      id: string;
      name: string;
      category: string;
    };
  }[];
}

interface ResourceGridProps {
  resources: Resource[];
  loading: boolean;
}

export default function ResourceGrid({ resources, loading }: ResourceGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md h-64 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-6"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No resources found</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
