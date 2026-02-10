'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth(onUnauthenticated?: () => void) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        setShowAuthModal(true);
      }
    }
  }, [user, loading, onUnauthenticated]);

  return { user, loading, showAuthModal, setShowAuthModal };
}
