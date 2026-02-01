"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tool, Suggestion } from '@/lib/data';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';

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
    <div className="min-h-screen bg-background p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-surface p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-semibold mr-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <LanguageToggle />
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-semibold">Logout</button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-border">
          <button 
            className={`pb-2 px-1 transition-all ${activeTab === 'suggestions' ? 'border-b-2 border-primary-from text-primary-from font-bold' : 'text-foreground/60'}`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions ({suggestions.filter(s => s.status === 'pending').length})
          </button>
          <button 
            className={`pb-2 px-1 transition-all ${activeTab === 'tools' ? 'border-b-2 border-primary-from text-primary-from font-bold' : 'text-foreground/60'}`}
            onClick={() => setActiveTab('tools')}
          >
            Manage Tools ({tools.length})
          </button>
          <button 
            className={`pb-2 px-1 transition-all ${activeTab === 'categories' ? 'border-b-2 border-primary-from text-primary-from font-bold' : 'text-foreground/60'}`}
            onClick={() => setActiveTab('categories')}
          >
            Manage Categories
          </button>
        </div>

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {suggestions.filter(s => s.status === 'pending').length === 0 ? (
              <p className="text-foreground/60 text-center py-8">No pending suggestions.</p>
            ) : (
              suggestions.filter(s => s.status === 'pending').map(s => (
                <div key={s.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{s.toolName}</h3>
                      <a href={s.toolUrl} target="_blank" className="text-blue-500 hover:text-blue-600 underline text-sm">{s.toolUrl}</a>
                      <div className="mt-2 text-sm text-foreground/80">
                        <p><strong className="text-foreground">Category:</strong> {s.category}</p>
                        <p><strong className="text-foreground">Pricing:</strong> {s.pricingModel} (Free Tier: {s.hasFreeTier})</p>
                        <p><strong className="text-foreground">Description:</strong> {s.description}</p>
                        {s.additionalInfo && <p><strong className="text-foreground">Info:</strong> {s.additionalInfo}</p>}
                        {s.email && <p><strong className="text-foreground">Submitter:</strong> {s.email}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveSetup(s)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">Approve</button>
                      <button onClick={() => handleReject(s.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
               <button onClick={handleCreateTool} className="bg-gradient-to-r from-blue-600 to-primary-to text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">Add New Tool</button>
            </div>
            <div className="grid gap-4">
              {tools.map(tool => (
                <div key={tool.id} className="bg-surface p-5 rounded-2xl shadow-sm border border-border flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-foreground">{tool.name}</h3>
                    <p className="text-sm text-foreground/60">{tool.categories.join(', ')}</p>
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
               <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
                  <h3 className="font-bold mb-4 text-foreground text-lg">Add New Category</h3>
                  <form onSubmit={handleAddCategory} className="flex gap-4">
                     <input name="name" placeholder="Category Name (English)" className="border border-border p-3 rounded-xl flex-1 bg-background text-foreground focus:ring-2 focus:ring-blue-500 outline-none" required />
                     <input name="name_ar" placeholder="اسم التصنيف (عربي)" className="border border-border p-3 rounded-xl flex-1 bg-background text-foreground font-cairo focus:ring-2 focus:ring-blue-500 outline-none" dir="rtl" required />
                     <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold">Add Category</button>
                  </form>
               </div>
               
               {/* List */}
               <div className="space-y-3">
                 {categories.map((cat, index) => (
                    <div key={cat.id} className="bg-surface p-5 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-1">
                            <button disabled={index === 0} onClick={() => handleMoveCategory(cat.id, index - 1)} className="text-foreground/40 hover:text-blue-600 disabled:opacity-30 p-1.5 bg-background border border-border rounded-lg transition-colors">▲</button>
                            <button disabled={index === categories.length - 1} onClick={() => handleMoveCategory(cat.id, index + 1)} className="text-foreground/40 hover:text-blue-600 disabled:opacity-30 p-1.5 bg-background border border-border rounded-lg transition-colors">▼</button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-xs text-foreground/50 mb-1 font-semibold uppercase tracking-wider">English Name</label>
                                <input 
                                    className="border border-border p-2.5 rounded-xl bg-background text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                    defaultValue={cat.name} 
                                    onBlur={(e) => { if(e.target.value !== cat.name) handleUpdateCategory(cat.id, { name: e.target.value }) }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-foreground/50 mb-1 text-right font-semibold uppercase tracking-wider">Arabic Name</label>
                                <input 
                                    className="border border-border p-2.5 rounded-xl bg-background text-foreground font-cairo focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-background p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">{editingTool?.id ? 'Edit Tool' : 'New Tool'}</h2>
              <form onSubmit={handleSaveTool} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Name</label>
                    <input className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editingTool?.name || ''} onChange={e => setEditingTool({...editingTool, name: e.target.value})} required />
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-foreground mb-1.5">URL</label>
                     <input className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editingTool?.url || ''} onChange={e => setEditingTool({...editingTool, url: e.target.value})} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Description (EN)</label>
                    <textarea className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={3} value={editingTool?.description || ''} onChange={e => setEditingTool({...editingTool, description: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Description (AR)</label>
                    <textarea className="w-full border border-border rounded-xl p-3 bg-surface text-foreground font-cairo focus:ring-2 focus:ring-blue-500 outline-none transition-all" dir="rtl" rows={3} value={editingTool?.description_ar || ''} onChange={e => setEditingTool({...editingTool, description_ar: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Free Tier Info (EN)</label>
                    <input className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editingTool?.freeTier || ''} onChange={e => setEditingTool({...editingTool, freeTier: e.target.value})} required />
                   </div>
                   <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Free Tier Info (AR)</label>
                    <input className="w-full border border-border rounded-xl p-3 bg-surface text-foreground font-cairo focus:ring-2 focus:ring-blue-500 outline-none transition-all" dir="rtl" value={editingTool?.freeTier_ar || ''} onChange={e => setEditingTool({...editingTool, freeTier_ar: e.target.value})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                    <select className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" value={editingTool?.categories?.[0] || ''} onChange={e => setEditingTool({...editingTool, categories: [e.target.value]})} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name} className="dark:bg-[#1a1f35]">{cat.name}</option>
                        ))}
                    </select>
                   </div>
                   <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Best For</label>
                    <input className="w-full border border-border rounded-xl p-3 bg-surface text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editingTool?.bestFor || ''} onChange={e => setEditingTool({...editingTool, bestFor: e.target.value})} />
                   </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-border rounded-xl text-foreground font-semibold hover:bg-surface transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">Save Tool</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
