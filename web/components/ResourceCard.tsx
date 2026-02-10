'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatFileSize, getFileIcon } from '@/lib/upload';

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

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (resourceId: string) => void;
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      alert('Please sign in to download resources');
      return;
    }

    setDownloading(true);

    try {
      // Record download
      await supabase.from('downloads').insert({
        user_id: user.id,
        resource_id: resource.id,
      });

      // Open file in new tab
      window.open(resource.file_url, '_blank');

      onDownload?.(resource.id);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('Please sign in to favorite resources');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resource.id);
        setIsFavorited(false);
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            resource_id: resource.id,
          });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  return (
    <div className="tool-card group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-l-6 border-l-[#c96847] dark:border-l-[#e08968]">
      {/* File Type Icon */}
      <div className="absolute top-4 right-4 text-3xl">
        {getFileIcon(resource.file_type)}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pr-12" style={{ fontFamily: 'Fraunces, serif' }}>
        {resource.title}
      </h3>

      {/* Description */}
      {resource.description && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {resource.description}
        </p>
      )}

      {/* Tags */}
      {resource.resource_tags && resource.resource_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.resource_tags.slice(0, 3).map(({ tags }) => (
            <span
              key={tags.id}
              className="category-badge px-2 py-1 text-xs rounded-full bg-[#7a9d7e] dark:bg-[#9bb89e] text-white"
            >
              {tags.name}
            </span>
          ))}
          {resource.resource_tags.length > 3 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{resource.resource_tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span>{resource.rating_average.toFixed(1)} ({resource.rating_count})</span>
        </div>
        <div>
          📥 {resource.download_count} downloads
        </div>
        <div>
          {formatFileSize(resource.file_size)}
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-[#7a9d7e] dark:bg-[#9bb89e] flex items-center justify-center text-white font-semibold">
          {resource.profiles.full_name.charAt(0)}
        </div>
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {resource.profiles.full_name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 btn-gradient-primary py-2 px-4 rounded-lg font-semibold text-white text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-lg transition-all ${
            isFavorited
              ? 'bg-[#c96847] text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
          aria-label="Favorite"
        >
          <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
