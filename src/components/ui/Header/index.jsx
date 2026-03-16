import { useLogout } from '@/hooks/auth/useLogout';
import { useTheme } from '@/providers/ThemeProvider';
import { MoonIcon, SunIcon } from 'lucide-react';
import Image from 'next/image';

export const Header = () => {
  const { logoutUser } = useLogout();
  const { toggleTheme, theme } = useTheme();
  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-main border-b border-main shadow-sm z-40"
      data-testid="header"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div>
            <Image
              className="h-full "
              src="/bls.png"
              alt="Logo da empresa BLS"
              width={50}
              height={50}
            />
          </div>
          <h1 className="text-xl font-semibold text-main">Diário de Classe</h1>
        </div>
        <nav className="flex space-x-6">
          <button
            onClick={toggleTheme}
            className="text-muted hover:text-main transition-colors cursor-pointer"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            onClick={logoutUser}
            className="text-muted hover:text-main transition-colors cursor-pointer"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
};
