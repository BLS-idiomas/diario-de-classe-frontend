'use client';
import {
  Book,
  CircleUser,
  GraduationCap,
  Home,
  Info,
  NotebookTabs,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

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
      icon: <User strokeWidth={strokeWidth} />,
      show: isAdmin(),
    },
    {
      href: '/alunos',
      label: 'Alunos',
      icon: <GraduationCap strokeWidth={strokeWidth} />,
      show: false,
    },
    {
      href: '/aulas',
      label: 'Aulas',
      icon: <Book strokeWidth={strokeWidth} />,
      show: false,
    },
    {
      href: '/relatorios',
      label: 'Relatórios',
      icon: <NotebookTabs strokeWidth={strokeWidth} />,
      show: false,
    },
    {
      href: '/exemple',
      label: 'Exemplos',
      icon: <Info strokeWidth={strokeWidth} />,
      show: false,
    },
    {
      href: '/meu-perfil',
      label: 'Meu perfil',
      icon: <CircleUser strokeWidth={1} />,
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
