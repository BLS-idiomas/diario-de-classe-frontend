'use client';

import { usePathname } from 'next/navigation';
import { IS_DEVELOPMENT } from '@/constants';
import {
  Book,
  CircleUser,
  ClipboardClock,
  GraduationCap,
  Home,
  Info,
  NotebookTabs,
  Settings,
  User,
} from 'lucide-react';

export function useSidebar(isAdmin) {
  const pathname = usePathname();
  const strokeWidth = 1;
  const sidebarItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Home strokeWidth={strokeWidth} />,
      show: true,
    },
    {
      href: '/professores',
      label: 'Professores',
      icon: <GraduationCap strokeWidth={strokeWidth} />,
      show: isAdmin(),
    },
    {
      href: '/alunos',
      label: 'Alunos',
      icon: <User strokeWidth={strokeWidth} />,
      show: true,
    },
    {
      href: '/contratos',
      label: 'Contratos',
      icon: <ClipboardClock strokeWidth={strokeWidth} />,
      show: true,
    },
    {
      href: '/aulas',
      label: 'Aulas',
      icon: <Book strokeWidth={strokeWidth} />,
      show: true,
    },
    {
      href: '/relatorios',
      label: 'Relatórios',
      icon: <NotebookTabs strokeWidth={strokeWidth} />,
      show: false,
    },
    {
      href: '/exemplo',
      label: 'Exemplos',
      icon: <Info strokeWidth={strokeWidth} />,
      show: IS_DEVELOPMENT,
    },
    {
      href: '/meu-perfil',
      label: 'Meu perfil',
      icon: <CircleUser strokeWidth={strokeWidth} />,
      show: true,
    },
    {
      href: '/configuracoes',
      label: 'Configurações',
      icon: <Settings strokeWidth={strokeWidth} />,
      show: false,
    },
  ];
  const isActive = href => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return {
    strokeWidth,
    sidebarItems,
    isActive,
  };
}
