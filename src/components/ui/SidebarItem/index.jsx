import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BREAKPOINT_NAV_PX } from '@/constants/layout';
import { useUnsavedChangesGuard } from '@/providers/UnsavedChangesGuardProvider';

export const SidebarItem = ({
  children,
  href,
  label,
  sidebarExpanded,
  active,
  onNavigate,
}) => {
  const router = useRouter();
  const { confirmNavigation } = useUnsavedChangesGuard();

  const fecharDrawerSeMobile = () => {
    if (!onNavigate) {
      return;
    }
    const isBelowNavBreakpoint = window.matchMedia(
      `(max-width: ${BREAKPOINT_NAV_PX - 1}px)`
    ).matches;
    if (isBelowNavBreakpoint) {
      onNavigate();
    }
  };

  const handleClick = e => {
    // Ctrl/Cmd/Shift/Alt ou botão diferente do esquerdo: o navegador segue o
    // <Link> nativo (abrir em nova aba, etc.) — não consulta o guard nem
    // intercepta o clique.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    const resultado = confirmNavigation();
    if (resultado === true) {
      fecharDrawerSeMobile();
      return;
    }

    // Há alteração pendente: o clique no <Link> é síncrono, mas a
    // confirmação é assíncrona — impede a navegação nativa e, se
    // confirmado, navega programaticamente.
    e.preventDefault();
    resultado.then(confirmado => {
      if (!confirmado) return;
      fecharDrawerSeMobile();
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group flex items-center space-x-3 p-3 rounded-lg bg-sidebar transition-colors"
      data-testid="sidebar-item"
    >
      <div className="w-3 h-3 flex items-center justify-center relative">
        <span className={`${active ? 'primary-color' : 'text-main'} text-sm`}>
          {children}
        </span>
        {!sidebarExpanded && (
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-6 z-10 hidden group-hover:inline-block sidebar-expanded-colors text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
            {label}
          </span>
        )}
      </div>
      {sidebarExpanded && (
        <p className="text-main text-xs font-medium">{label}</p>
      )}
    </Link>
  );
};
