'use client';

import { useState } from 'react';
import { isMobileFunction } from '@/utils/isMobileFunction';
import { Header, Sidebar, Footer } from '@/components';

export default function ApplicationLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState({
    mainClass: 'ml-18',
    sidebarClass: 'w-18',
    isExpanded: false,
  });

  const toggleSidebar = () => {
    const isMobile = isMobileFunction();
    let mainClass = 'ml-18';
    let sidebarClass = 'w-18';

    if (!sidebarExpanded.isExpanded) {
      if (isMobile === true) {
        sidebarClass = 'absolute w-full';
      } else {
        sidebarClass = 'w-[180px]';
        mainClass = 'ml-[150px]';
      }
    }

    setSidebarExpanded({
      mainClass: mainClass,
      sidebarClass: sidebarClass,
      isExpanded: !sidebarExpanded.isExpanded,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex pt-16 min-h-screen">
        <Sidebar
          sidebarExpanded={sidebarExpanded.isExpanded}
          sidebarClass={sidebarExpanded.sidebarClass}
          toggleSidebar={toggleSidebar}
        />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${sidebarExpanded.mainClass}`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
