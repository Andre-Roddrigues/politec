// components/Sidebar/MobileSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  FileText,
  CreditCard,
  LogOut,
  Home,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const menuItems = [
    {
      name: "Perfil",
      icon: User,
      path: "/perfil",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Cursos",
      icon: BookOpen,
      path: "/cursos",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Matrículas",
      icon: FileText,
      path: "/matriculas",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Mensalidades",
      icon: CreditCard,
      path: "/mensalidades",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const handleLogout = () => {
    // Lógica de logout
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-brand-main to-brand-lime shadow-2xl flex items-center justify-center hover:shadow-3xl hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Bottom Navigation Panel */}
            <motion.nav
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 rounded-t-3xl"
            >
              {/* Draggable Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>

              {/* User Profile */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Estudante</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Portal POLITEC</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-4 gap-3">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 ${
                            isActive
                              ? `${item.bgColor} ${item.color}`
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                            isActive 
                              ? item.bgColor
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}>
                            <Icon className={`w-6 h-6 ${isActive ? item.color : "text-gray-600 dark:text-gray-400"}`} />
                          </div>
                          <span className={`text-xs font-medium ${isActive ? item.color : "text-gray-700 dark:text-gray-300"}`}>
                            {item.name}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-main/20 to-brand-lime/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-brand-main dark:text-brand-lime" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Meus Cursos</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 ativos</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-brand-main to-brand-lime text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Ver todos
                  </button>
                </div>
              </div>

              {/* Bottom Indicator */}
              <div className="h-1 bg-gradient-to-r from-brand-main via-brand-lime to-brand-main rounded-full mx-6 mb-4"></div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Compact Navigation (When Closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg px-3 py-2"
          >
            {menuItems.map((item, index) => {
              const isActive = activeTab === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${item.bgColor} ${item.color}`
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? item.color : "text-gray-500 dark:text-gray-400"}`} />
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}