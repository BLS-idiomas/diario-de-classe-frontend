'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarItem } from '../SidebarItem';
import { useSidebar } from './useSidebar';
import { useUserAuth } from '@/providers/UserAuthProvider';

export const Sidebar = ({ sidebarExpanded, toggleSidebar, sidebarClass }) => {
  const { isAdmin } = useUserAuth();
  const { strokeWidth, sidebarItems, isActive } = useSidebar(isAdmin);

  return (
    <aside
      aria-label="Main navigation"
      className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-30 ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Conteúdo da Sidebar */}
        <div className="flex-1 p-4">
          <nav>
            <ul className="space-y-2">
              {sidebarItems.map(item =>
                item.show ? (
                  <li key={item.href}>
                    <SidebarItem
                      href={item.href}
                      label={item.label}
                      sidebarExpanded={sidebarExpanded}
                      active={isActive(item.href)}
                    >
                      {item.icon}
                    </SidebarItem>
                  </li>
                ) : null
              )}
            </ul>
          </nav>
        </div>
        {/* Botão Toggle fixo na parte inferior */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            aria-expanded={!!sidebarExpanded}
            aria-label={
              sidebarExpanded ? 'Recolher sidebar' : 'Expandir sidebar'
            }
            title={sidebarExpanded ? 'Recolher' : 'Expandir'}
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
