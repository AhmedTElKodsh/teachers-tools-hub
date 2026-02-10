'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialView = 'signin' }: AuthModalProps) {
  const [view, setView] = useState<'signin' | 'signup'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
            {view === 'signin' ? 'Welcome Back!' : 'Join Our Community'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {view === 'signin' ? 'Sign in to access your resources' : 'Create an account to start sharing'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 border-b-4 border-b-[#6ba3d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c96847] focus:border-[#c96847] text-slate-900 dark:text-white transition-all hover:-translate-y-0.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient-primary py-3 px-6 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle View */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setView(view === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="text-[#c96847] dark:text-[#e08968] hover:underline text-sm font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {view === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
