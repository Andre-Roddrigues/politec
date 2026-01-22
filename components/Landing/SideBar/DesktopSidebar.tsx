// components/Sidebar/DesktopSidebar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  FileText,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Bell,
} from "lucide-react";

interface DesktopSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DesktopSidebar({ collapsed = false, onToggleCollapse }: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Perfil",
      icon: User,
      path: "/user/perfil",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Cursos",
      icon: BookOpen,
      path: "/user/cursos",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Matrículas",
      icon: FileText,
      path: "/user/matriculas",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Mensalidades",
      icon: CreditCard,
      path: "/user/mensalidades",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const handleLogout = () => {
    // Aqui você implementaria a lógica de logout
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`h-screen mt-[60px] fixed left-0 top-0 z-40 flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg">POLITEC</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Portal do Estudante</p>
              </div>
            </motion.div>
          )}
          
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
                className={`relative p-3 rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? `${item.bgColor} ${item.color}`
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {/* Indicator de hover */}
                <AnimatePresence>
                  {hoveredItem === item.path && !isActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 4 }}
                      exit={{ width: 0 }}
                      className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-6 bg-gradient-to-b from-brand-main to-brand-lime rounded-r-full"
                    />
                  )}
                </AnimatePresence>

                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? `${item.bgColor} ${item.color}`
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                  >
                    <span className={`font-medium text-sm ${isActive ? item.color : ""}`}>
                      {item.name}
                    </span>
                  </motion.div>
                )}

                {!collapsed && isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-main to-brand-lime"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`w-full p-3 rounded-xl flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-sm"
            >
              Sair
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}