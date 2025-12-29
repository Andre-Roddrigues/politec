// components/admin/DashboardLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "../sidebar/SideBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen mb-[60px] bg-gray-50 dark:bg-gray-900">
      <Sidebar />        
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
  );
}