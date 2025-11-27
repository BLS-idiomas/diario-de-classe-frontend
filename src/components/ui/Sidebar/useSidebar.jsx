'use client';
import {
  Book,
  GraduationCap,
  Home,
  Info,
  NotebookTabs,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function useSidebar() {
  const pathname = usePathname();
  const strokeWidth = 1;
  const sidebarItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Home strokeWidth={strokeWidth} />,
    },
    {
      href: '/alunos',
      label: 'Alunos',
      icon: <GraduationCap strokeWidth={strokeWidth} />,
    },
    {
      href: '/professores',
      label: 'Professores',
      icon: <User strokeWidth={strokeWidth} />,
    },
    {
      href: '/aulas',
      label: 'Aulas',
      icon: <Book strokeWidth={strokeWidth} />,
    },
    {
      href: '/relatorios',
      label: 'Relatórios',
      icon: <NotebookTabs strokeWidth={strokeWidth} />,
    },
    {
      href: '/exemple',
      label: 'Exemplos',
      icon: <Info strokeWidth={strokeWidth} />,
    },
  ];
  const isActive = href => {
    return pathname === href;
  };

  return {
    strokeWidth,
    sidebarItems,
    isActive,
  };
}
