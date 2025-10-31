"use client";

import { useState } from "react";
import { Header, Sidebar, Footer } from "..";

export const Layout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex pt-16 min-h-screen">
        <Sidebar
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarExpanded ? "ml-[700px]" : "ml-20"
          }`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
