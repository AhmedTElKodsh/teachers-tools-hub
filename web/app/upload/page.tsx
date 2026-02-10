'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadResourceForm from '@/components/UploadResourceForm';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import AuthModal from '@/components/AuthModal';

export default function UploadPage() {
  const router = useRouter();
  const { user, loading, showAuthModal, setShowAuthModal } = useRequireAuth();

  useEffect(() => {
    // If not authenticated, we could redirect or show modal
    // useRequireAuth handles showing modal by default
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c96847]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Fraunces, serif' }}>
          Share Your Resources
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          Help other teachers by sharing your lesson plans, worksheets, and activities.
        </p>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
          <UploadResourceForm />
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          // If they close the modal without signing in, maybe redirect?
          if (!user) router.push('/');
        }} 
      />
    </div>
  );
}
