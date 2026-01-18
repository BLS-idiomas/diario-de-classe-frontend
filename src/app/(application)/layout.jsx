'use client';

import { useApplicationLayout } from './useApplicationLayout';
import { Header, Sidebar, Footer, Loading } from '@/components';

export default function ApplicationLayout({ children }) {
  const {
    isMobile,
    isUnauthorized,
    isLoading,
    sidebarExpanded,
    toggleSidebar,
  } = useApplicationLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-16 min-h-screen">
        <Sidebar
          sidebarExpanded={sidebarExpanded.isExpanded}
          sidebarClass={sidebarExpanded.sidebarClass}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <main
          className={`flex-1 p-8 transition-all duration-300 ease-in-out ${sidebarExpanded.mainClass}`}
        >
          {isLoading || isUnauthorized ? (
            <Loading />
          ) : (
            <div className="max-w-6xl mx-auto">{children}</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
