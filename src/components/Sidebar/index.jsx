'use client';
import {
  Book,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Home,
  Info,
  NotebookTabs,
  User,
} from 'lucide-react';
import { SidebarItem } from '../SidebarItem';

export const Sidebar = ({ sidebarExpanded, toggleSidebar, sidebarClass }) => {
  const strokeWidth = 1;
  const sidebarItems = [
    {
      active: true,
      href: '/',
      label: 'Home',
      icon: <Home strokeWidth={strokeWidth} />,
    },
    {
      active: false,
      href: '/alunos',
      label: 'Alunos',
      icon: <GraduationCap strokeWidth={strokeWidth} />,
    },
    {
      active: false,
      href: '/professores',
      label: 'Professores',
      icon: <User strokeWidth={strokeWidth} />,
    },
    {
      active: false,
      href: '/aulas',
      label: 'Aulas',
      icon: <Book strokeWidth={strokeWidth} />,
    },
    {
      active: false,
      href: '/relatorios',
      label: 'Relatórios',
      icon: <NotebookTabs strokeWidth={strokeWidth} />,
    },
    {
      active: false,
      href: '/exemple',
      label: 'Exemplos',
      icon: <Info strokeWidth={strokeWidth} />,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Conteúdo da Sidebar */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                href={item.href}
                label={item.label}
                sidebarExpanded={sidebarExpanded}
                active={item.active}
              >
                {item.icon}
              </SidebarItem>
            ))}
          </nav>
        </div>
        {/* Botão Toggle fixo na parte inferior */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-black rounded-lg"
          >
            {sidebarExpanded ? (
              <>
                <span className="mr-2">
                  <ChevronLeft strokeWidth={strokeWidth} />
                </span>
                <span>Recolher</span>
              </>
            ) : (
              <span>
                <ChevronRight strokeWidth={strokeWidth} />
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
