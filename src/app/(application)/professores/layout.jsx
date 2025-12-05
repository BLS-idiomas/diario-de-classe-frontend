'use client';

import { useUserAuth } from '@/providers/UserAuthProvider';
import { notFound } from 'next/navigation';

export default function ApplicationLayout({ children }) {
  const { isAdmin, currentUser } = useUserAuth();
  if (currentUser && !isAdmin()) {
    return notFound();
  }
  return children;
}
