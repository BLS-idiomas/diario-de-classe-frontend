import { useLogout } from '@/hooks/auth/useLogout';
import { useTheme } from '@/providers/ThemeProvider';
import { useUnsavedChangesGuard } from '@/providers/UnsavedChangesGuardProvider';
import { Menu, MoonIcon, SunIcon, X } from 'lucide-react';
import Image from 'next/image';

export const Header = ({ isExpanded, toggleSidebar }) => {
  const { logoutUser } = useLogout();
  const { toggleTheme, theme } = useTheme();
  const { confirmNavigation } = useUnsavedChangesGuard();

  const handleLogoutClick = () => {
    // `liberarSeFalhar`: sessão encerrada vence rascunho — se o diálogo
    // falhar ao ser exibido, desloga mesmo assim.
    const resultado = confirmNavigation({ liberarSeFalhar: true });
    if (resultado === true) {
      logoutUser();
      return;
    }

    // Há alteração pendente: só desloga se o administrador confirmar.
    resultado.then(confirmado => {
      if (confirmado) logoutUser();
    });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-main border-b border-main shadow-sm z-40"
      data-testid="header"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              aria-expanded={isExpanded}
              aria-controls="main-navigation"
              aria-label={isExpanded ? 'Fechar navegação' : 'Abrir navegação'}
              className="tap-target md:hidden flex items-center justify-center text-muted hover:text-main transition-colors cursor-pointer"
            >
              {isExpanded ? <X /> : <Menu />}
            </button>
          )}
          <div>
            <Image
              className="h-full "
              src={theme === 'dark' ? '/bls-dark.png' : '/bls.png'}
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
            onClick={handleLogoutClick}
            className="text-muted hover:text-main transition-colors cursor-pointer"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
};
