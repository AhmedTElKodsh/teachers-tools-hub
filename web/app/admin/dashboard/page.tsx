"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tool, Suggestion } from '@/lib/data';

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'tools' | 'categories'>('suggestions');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvingSuggestionId, setApprovingSuggestionId] = useState<string | null>(null);



  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      if (!res.ok || !(await res.json()).authenticated) {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, tRes, cRes] = await Promise.all([
        fetch('/api/admin/suggestions'),
        fetch('/api/admin/tools'),
        fetch('/api/admin/categories')
      ]);
      if (sRes.ok) setSuggestions(await sRes.json());
      if (tRes.ok) setTools(await tRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Category Handlers
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({
            name: formData.get('name'),
            name_ar: formData.get('name_ar')
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    e.currentTarget.reset();
    fetchData();
  };

  const handleUpdateCategory = async (id: string, data: Partial<Category>) => {
    await fetch('/api/admin/categories', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
        headers: { 'Content-Type': 'application/json' }
    });
    fetchData();
  };

  const handleMoveCategory = async (id: string, newIndex: number) => {
    await fetch('/api/admin/categories', {
        method: 'PUT',
        body: JSON.stringify({ id, newIndex }),
        headers: { 'Content-Type': 'application/json' }
    });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Tools with this category will have it removed.')) return;
    await fetch('/api/admin/categories', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' }
    });
    fetchData();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleApproveSetup = (suggestion: Suggestion) => {
    setApprovingSuggestionId(suggestion.id);
    setEditingTool({
      name: suggestion.toolName,
      url: suggestion.toolUrl,
      description: suggestion.description,
      categories: [suggestion.category],
      bestFor: "",
      freeTier: suggestion.pricingModel === 'Free' ? 'Free' : 'Limited free tier',
      limitations: suggestion.hasFreeTier === 'no' ? 'No free tier' : '',
      pricingModel: suggestion.pricingModel,
    });
    setIsModalOpen(true);
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this suggestion?')) return;
    await fetch('/api/admin/suggestions', {
      method: 'PUT',
      body: JSON.stringify({ id, status: 'rejected' }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchData();
  };

  const handleEditTool = (tool: Tool) => {
    setApprovingSuggestionId(null);
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleCreateTool = () => {
    setApprovingSuggestionId(null);
    setEditingTool({
      categories: ["General Assistants"]
    });
    setIsModalOpen(true);
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('Delete this tool?')) return;
    await fetch('/api/admin/tools', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchData();
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    if (approvingSuggestionId) {
      // Approve flow
      await fetch('/api/admin/suggestions', {
        method: 'PUT',
        body: JSON.stringify({ 
          id: approvingSuggestionId, 
          status: 'approved', 
          toolData: editingTool 
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create/Edit flow
      await fetch('/api/admin/tools', {
        method: 'POST',
        body: JSON.stringify(editingTool),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    setIsModalOpen(false);
    setEditingTool(null);
    setApprovingSuggestionId(null);
    fetchData();
  };

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
          <button 
            className={`pb-2 px-1 ${activeTab === 'suggestions' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-slate-500'}`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions ({suggestions.filter(s => s.status === 'pending').length})
          </button>
          <button 
            className={`pb-2 px-1 ${activeTab === 'tools' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-slate-500'}`}
            onClick={() => setActiveTab('tools')}
          >
            Manage Tools ({tools.length})
          </button>
          <button 
            className={`pb-2 px-1 ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-slate-500'}`}
            onClick={() => setActiveTab('categories')}
          >
            Manage Categories
          </button>
        </div>

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {suggestions.filter(s => s.status === 'pending').length === 0 && <p>No pending suggestions.</p>}
            {suggestions.filter(s => s.status === 'pending').map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{s.toolName}</h3>
                    <a href={s.toolUrl} target="_blank" className="text-blue-500 underline text-sm">{s.toolUrl}</a>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      <p><strong>Category:</strong> {s.category}</p>
                      <p><strong>Pricing:</strong> {s.pricingModel} (Free Tier: {s.hasFreeTier})</p>
                      <p><strong>Description:</strong> {s.description}</p>
                      {s.additionalInfo && <p><strong>Info:</strong> {s.additionalInfo}</p>}
                      {s.email && <p><strong>Submitter:</strong> {s.email}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveSetup(s)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
                    <button onClick={() => handleReject(s.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <div className="mb-4">
               <button onClick={handleCreateTool} className="bg-blue-600 text-white px-4 py-2 rounded">Add New Tool</button>
            </div>
            <div className="grid gap-4">
              {tools.map(tool => (
                <div key={tool.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold dark:text-white">{tool.name}</h3>
                    <p className="text-sm text-slate-500">{tool.categories.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditTool(tool)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteTool(tool.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
            <div className="space-y-6">
               {/* Add New */}
               <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold mb-4 dark:text-white text-lg">Add New Category</h3>
                  <form onSubmit={handleAddCategory} className="flex gap-4">
                     <input name="name" placeholder="Category Name (English)" className="border p-2 rounded flex-1 dark:bg-slate-700 dark:text-white dark:border-slate-600" required />
                     <input name="name_ar" placeholder="اسم التصنيف (عربي)" className="border p-2 rounded flex-1 dark:bg-slate-700 dark:text-white dark:border-slate-600 font-cairo" dir="rtl" required />
                     <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium">Add Category</button>
                  </form>
               </div>
               
               {/* List */}
               <div className="space-y-3">
                 {categories.map((cat, index) => (
                    <div key={cat.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <button disabled={index === 0} onClick={() => handleMoveCategory(cat.id, index - 1)} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1 bg-slate-100 dark:bg-slate-700 rounded">▲</button>
                            <button disabled={index === categories.length - 1} onClick={() => handleMoveCategory(cat.id, index + 1)} className="text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1 bg-slate-100 dark:bg-slate-700 rounded">▼</button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 mb-1">English Name</label>
                                <input 
                                    className="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                                    defaultValue={cat.name} 
                                    onBlur={(e) => { if(e.target.value !== cat.name) handleUpdateCategory(cat.id, { name: e.target.value }) }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 mb-1 text-right">Arabic Name</label>
                                <input 
                                    className="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600 font-cairo" 
                                    dir="rtl"
                                    defaultValue={cat.name_ar} 
                                    onBlur={(e) => { if(e.target.value !== cat.name_ar) handleUpdateCategory(cat.id, { name_ar: e.target.value }) }}
                                />
                            </div>
                        </div>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded ml-2" title="Delete Category">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                 ))}
               </div>
            </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">{editingTool?.id ? 'Edit Tool' : 'New Tool'}</h2>
              <form onSubmit={handleSaveTool} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input className="w-full border rounded p-2 dark:bg-slate-700" value={editingTool?.name || ''} onChange={e => setEditingTool({...editingTool, name: e.target.value})} required />
                  </div>
                  <div>
                     <label className="block text-sm font-medium">URL</label>
                     <input className="w-full border rounded p-2 dark:bg-slate-700" value={editingTool?.url || ''} onChange={e => setEditingTool({...editingTool, url: e.target.value})} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Description (EN)</label>
                    <textarea className="w-full border rounded p-2 dark:bg-slate-700" rows={3} value={editingTool?.description || ''} onChange={e => setEditingTool({...editingTool, description: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Description (AR)</label>
                    <textarea className="w-full border rounded p-2 dark:bg-slate-700 font-cairo" dir="rtl" rows={3} value={editingTool?.description_ar || ''} onChange={e => setEditingTool({...editingTool, description_ar: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium">Free Tier Info (EN)</label>
                    <input className="w-full border rounded p-2 dark:bg-slate-700" value={editingTool?.freeTier || ''} onChange={e => setEditingTool({...editingTool, freeTier: e.target.value})} required />
                   </div>
                   <div>
                    <label className="block text-sm font-medium">Free Tier Info (AR)</label>
                    <input className="w-full border rounded p-2 dark:bg-slate-700 font-cairo" dir="rtl" value={editingTool?.freeTier_ar || ''} onChange={e => setEditingTool({...editingTool, freeTier_ar: e.target.value})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select className="w-full border rounded p-2 dark:bg-slate-700" value={editingTool?.categories?.[0] || ''} onChange={e => setEditingTool({...editingTool, categories: [e.target.value]})} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                   </div>
                   <div>
                    <label className="block text-sm font-medium">Best For</label>
                    <input className="w-full border rounded p-2 dark:bg-slate-700" value={editingTool?.bestFor || ''} onChange={e => setEditingTool({...editingTool, bestFor: e.target.value})} />
                   </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
