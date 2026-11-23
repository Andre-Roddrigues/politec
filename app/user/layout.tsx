// app/user/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "../../components/Landing/SideBar/SideBar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // O container flex faz com que a sidebar e o conteúdo fiquem lado a lado, sem sobreposição.
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      
      {/* A Sidebar fará sticky automaticamente */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* O conteúdo ocupa o resto do espaço (flex-1) e nunca fica por baixo da sidebar */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}