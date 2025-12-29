import React from "react";
import { SidebarProvider } from "../../context/SidebarContext";
import Sidebar from "../../components/admin/sidebar/SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen mb-[60px] md:flex lg:flex  dark:bg-gray-900">
      {/* Sidebar fixa à esquerda */}

      {/* Conteúdo principal */}
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
