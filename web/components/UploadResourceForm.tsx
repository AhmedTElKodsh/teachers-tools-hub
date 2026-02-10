'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { uploadResource } from '@/lib/upload';

interface Tag {
  id: string;
  name: string;
  category: string;
}

export default function UploadResourceForm() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState('lesson_plan');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load predefined tags
  useEffect(() => {
    async function loadTags() {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('category')
        .order('name');

      if (data && !error) {
        setTags(data);
      }
    }
    loadTags();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      // Upload file
      const fileData = await uploadResource(selectedFile, user.id);

      // Create resource record
      const { data: resource, error: dbError } = await supabase
        .from('resources')
        .insert({
          user_id: user.id,
          title,
          description,
          resource_type: resourceType,
          file_url: fileData.publicUrl,
          file_name: fileData.fileName,
          file_size: fileData.fileSize,
          file_type: fileData.fileType,
          is_public: isPublic,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Add tags if selected
      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map(tagId => ({
          resource_id: resource.id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from('resource_tags')
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setResourceType('lesson_plan');
      setIsPublic(true);
      setSelectedFile(null);
      setSelectedTags([]);

      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Choose File *
        </label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
          required
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c96847] file:text-white hover:file:bg-[#b35939] file:cursor-pointer cursor-pointer"
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Resource Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
          placeholder="e.g., Multiplication Worksheet for 3rd Grade"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
          placeholder="Describe your resource..."
        />
      </div>

      {/* Resource Type */}
      <div>
        <label htmlFor="resource-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Resource Type *
        </label>
        <select
          id="resource-type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] text-slate-900 dark:text-white"
        >
          <option value="lesson_plan">Lesson Plan</option>
          <option value="worksheet">Worksheet</option>
          <option value="activity">Activity Guide</option>
          <option value="assessment">Assessment</option>
          <option value="presentation">Presentation</option>
        </select>
      </div>

      {/* Tags Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tags (optional)
        </label>
        <div className="space-y-4">
          {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                {category.replace('_', ' ')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categoryTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'bg-[#c96847] text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-5 h-5 text-[#c96847] bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-[#c96847]"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Make this resource public (other teachers can view and download)
          </span>
        </label>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          Resource uploaded successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || !selectedFile}
        className="w-full btn-gradient-primary py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Resource'}
      </button>
    </form>
  );
}
