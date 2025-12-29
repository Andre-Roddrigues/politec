// components/admin/Sidebar/MobileSidebar.tsx
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
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  UserCheck,
  Clock,
} from "lucide-react";

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const mainItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Pagamentos",
      icon: DollarSign,
      path: "/admin/pagamentos",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Cursos",
      icon: BookOpen,
      path: "/admin/cursos",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Estudantes",
      icon: Users,
      path: "/admin/estudantes",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const adminItems = [
    {
      name: "Relatórios",
      icon: BarChart3,
      path: "/admin/relatorios",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      name: "Notificações",
      icon: Bell,
      path: "/admin/notificacoes",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/admin/configuracoes",
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/30",
    },
    {
      name: "Admin",
      icon: Shield,
      path: "/admin/administradores",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  const handleIconClick = (path: string) => {
    setClickedIcon(path);
    setIsOpen(false);
    
    // Reset spin animation after 500ms
    setTimeout(() => {
      setClickedIcon(null);
    }, 500);
  };

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {/* <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-orange-600 shadow-2xl flex items-center justify-center hover:shadow-3xl hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button> */}

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
              className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Draggable Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>

              {/* Admin Profile */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                        {clickedIcon === 'profile' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            <Shield className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : (
                          <Shield className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Administrador</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Super Admin</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                  >
                    {clickedIcon === 'logout' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Confirmados</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">9,321</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        {clickedIcon === 'stats-confirmed' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </motion.div>
                        ) : (
                          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-3 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pendentes</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">1,845</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        {clickedIcon === 'stats-pending' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          </motion.div>
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="px-6 pb-4">
                <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Principal
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {mainItems.map((item) => {
                    const isActive = activeTab === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <Link 
                        key={item.path} 
                        href={item.path} 
                        onClick={() => handleIconClick(item.path)}
                      >
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
                            {clickedIcon === item.path ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                              >
                                <Icon className={`w-6 h-6 ${isActive ? item.color : "text-gray-600 dark:text-gray-400"}`} />
                              </motion.div>
                            ) : (
                              <Icon className={`w-6 h-6 ${isActive ? item.color : "text-gray-600 dark:text-gray-400"}`} />
                            )}
                          </div>
                          <span className={`text-xs font-medium text-center ${isActive ? item.color : "text-gray-700 dark:text-gray-300"}`}>
                            {item.name}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Admin Navigation */}
              {/* <div className="px-6 pb-4">
                <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Administração
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {adminItems.map((item) => {
                    const isActive = activeTab === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <Link 
                        key={item.path} 
                        href={item.path} 
                        onClick={() => handleIconClick(item.path)}
                      >
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
                            {clickedIcon === item.path ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                              >
                                <Icon className={`w-6 h-6 ${isActive ? item.color : "text-gray-600 dark:text-gray-400"}`} />
                              </motion.div>
                            ) : (
                              <Icon className={`w-6 h-6 ${isActive ? item.color : "text-gray-600 dark:text-gray-400"}`} />
                            )}
                          </div>
                          <span className={`text-xs font-medium text-center ${isActive ? item.color : "text-gray-700 dark:text-gray-300"}`}>
                            {item.name}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div> */}

              {/* Quick Actions */}
              <div className="px-6 pb-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Ações Rápidas</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Gerenciar pendências</p>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-medium rounded-full">
                      4 ações
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleIconClick('approve-payments')}
                      className="w-full flex items-center justify-between p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          {clickedIcon === 'approve-payments' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                              <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                            </motion.div>
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Aprovar Pagamentos</span>
                      </div>
                      <span className="text-xs font-medium text-yellow-600">23</span>
                    </button>
                    <button 
                      onClick={() => handleIconClick('validate-registrations')}
                      className="w-full flex items-center justify-between p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          {clickedIcon === 'validate-registrations' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                              <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                          ) : (
                            <UserCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Validar Inscrições</span>
                      </div>
                      <span className="text-xs font-medium text-blue-600">15</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Indicator */}
              <div className="h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full mx-6 mb-4"></div>
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
            {mainItems.slice(0, 4).map((item) => {
              const isActive = activeTab === item.path;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => handleIconClick(item.path)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${item.bgColor} ${item.color}`
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {clickedIcon === item.path ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? item.color : "text-gray-500 dark:text-gray-400"}`} />
                      </motion.div>
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? item.color : "text-gray-500 dark:text-gray-400"}`} />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            
            {/* Admin Button */}
            {/* <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white hover:opacity-90 transition-opacity"
            >
              {clickedIcon === 'menu' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}