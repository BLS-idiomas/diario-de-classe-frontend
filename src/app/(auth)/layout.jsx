'use client';

import { useToast } from '@/providers/ToastProvider';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserAuth();
  const { success } = useToast();

  useEffect(() => {
    async function checkAuth() {
      if (await isAuthenticated()) {
        success(`Bem-vindo de volta, ${currentUser.nome}!`);
        router.push('/');
        return;
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        {children}
      </div>
    </div>
  );
}
