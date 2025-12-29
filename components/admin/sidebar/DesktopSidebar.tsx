// components/admin/Sidebar/DesktopSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Users,
  BarChart3,
  Bell,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  CreditCard,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface DesktopSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DesktopSidebar({ collapsed = false, onToggleCollapse }: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>({});
  const [clickedLink, setClickedLink] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      color: "text-brand-main",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      badge: null,
    },
    {
      name: "Pagamentos",
      icon: DollarSign,
      path: "/admin/pagamentos",
      color: "text-brand-main",
      bgColor: "bg-blue-100 dark:bg-green-900/30",
      badge: "23",
    },
    {
      name: "Cursos",
      icon: BookOpen,
      path: "/admin/cursos",
      color: "text-brand-main",
      bgColor: "bg-blue-100 dark:bg-purple-900/30",
      badge: null,
    },
    {
      name: "Estudantes",
      icon: Users,
      path: "/admin/estudantes",
      color: "text-brand-main",
      bgColor: "bg-blue-100 dark:bg-orange-900/30",
      badge: "15",
    },
    {
      name: "Relatórios",
      icon: BarChart3,
      path: "/admin/relatorios",
      color: "text-brand-main",
      bgColor: "bg-blue-100 dark:bg-cyan-900/30",
      badge: null,
    },
    {
      name: "Notificações",
      icon: Bell,
      path: "/admin/notificacoes",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      badge: "8",
    },
    {
      name: "Documentos",
      icon: FileText,
      path: "/admin/documentos",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      badge: null,
    },
  ];

  const adminItems = [
    {
      name: "Configurações",
      icon: Settings,
      path: "/admin/configuracoes",
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
    },
    {
      name: "Administradores",
      icon: Shield,
      path: "/admin/administradores",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  const handleLinkClick = (path: string) => {
    setClickedLink(path);
    setLoadingLinks(prev => ({ ...prev, [path]: true }));
    
    // Simular tempo de carregamento e depois limpar
    setTimeout(() => {
      setLoadingLinks(prev => ({ ...prev, [path]: false }));
      setClickedLink(null);
    }, 1500); // Tempo mais curto para sidebar
  };

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  // Reset loading states quando mudar de rota
  useEffect(() => {
    setLoadingLinks({});
    setClickedLink(null);
  }, [pathname]);

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
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg">POLITEC</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Painel Administrativo</p>
              </div>
            </motion.div>
          )}
          
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            disabled={clickedLink !== null}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            const Icon = item.icon;
            const isLoading = loadingLinks[item.path];
            const isClicked = clickedLink === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                    return;
                  }
                  handleLinkClick(item.path);
                }}
              >
                <motion.div
                  whileHover={!isLoading ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  onHoverStart={() => !isLoading && setHoveredItem(item.path)}
                  onHoverEnd={() => !isLoading && setHoveredItem(null)}
                  className={`relative p-3 rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? `${item.bgColor} ${item.color}`
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  } ${isLoading || isClicked ? 'pointer-events-none opacity-80' : ''}`}
                >
                  {/* Indicator de hover */}
                  <AnimatePresence>
                    {hoveredItem === item.path && !isActive && !isLoading && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 4 }}
                        exit={{ width: 0 }}
                        className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-6 bg-brand-main rounded-r-full"
                      />
                    )}
                  </AnimatePresence>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                  }`}>
                    {isLoading ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className={`font-medium text-sm ${isActive ? item.color : ''} ${
                        isLoading ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        {item.name}
                      </span>
{/*                       
                      {item.badge && !isLoading && (
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {item.badge}
                        </span>
                      )} */}
                      
                      {isLoading && (
                        <div className="px-1.5 py-0.5">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {!collapsed && isActive && !isLoading && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-brand-lime"
                    />
                  )}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-800/20 to-transparent animate-pulse"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2"
            >
              Administração
            </motion.p>
          )}
          
          {adminItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const isLoading = loadingLinks[item.path];
            const isClicked = clickedLink === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                    return;
                  }
                  handleLinkClick(item.path);
                }}
              >
                <motion.div
                  whileHover={!isLoading ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? `${item.bgColor} ${item.color}`
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  } ${isLoading || isClicked ? 'pointer-events-none opacity-80' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                  }`}>
                    {isLoading ? (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className={`font-medium text-sm ${isActive ? item.color : ''} ${
                        isLoading ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        {item.name}
                        {isLoading && (
                          <span className="ml-2 text-xs text-blue-500 dark:text-blue-400 animate-pulse">
                            ...
                          </span>
                        )}
                      </span>
                      
                      {isLoading && (
                        <div className="px-1.5 py-0.5">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-gray-800/10 to-transparent animate-pulse"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
            </motion.div>
          )}
          
          {collapsed && (
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            disabled={clickedLink !== null}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 ${
              collapsed ? "w-10 h-10 flex items-center justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}