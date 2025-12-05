import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { logout, clearStatus } from '@/store/slices/authSlice';

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { removeAuthenticate, refreshToken } = useUserAuth();
  const { info } = useToast();

  const logoutUser = () => {
    dispatch(logout(refreshToken));
    removeAuthenticate();
    info('Você saiu.');
    router.push('/login');
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  return { logoutUser };
}
