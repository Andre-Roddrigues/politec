"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  FileText, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Briefcase,
  Settings,
  Bell,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Perfil');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { name: 'Perfil', icon: User, href: '/user/perfil' },
    { name: 'Minhas Candituras', icon: Briefcase, href: '/user/candidaturas' },
    // { name: 'Notificações', icon: Bell, href: '/user/notificacoes' },
    // { name: 'Configurações', icon: Settings, href: '/user/configuracoes' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (name: string) => {
    setActiveLink(name);
    setIsMobileOpen(false);
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <>
      <motion.div
        className="hidden md:flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 z-40"
        initial="collapsed"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeLink === item.name;
              
              return (
                <li key={item.name}>
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setActiveLink(item.name)}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-main/10 to-brand-lime/10 text-brand-main dark:text-brand-lime'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-brand-main dark:text-brand-lime' : ''}`} />
                    </Link>
                    <AnimatePresence>
                      {hoveredItem === item.name && (
                        <motion.div
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={tooltipVariants}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                            {item.name}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-gray-900 dark:border-r-gray-700 border-t-transparent border-b-transparent"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div 
            className="relative"
            onMouseEnter={() => setHoveredItem('sair')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.button
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>

            {/* Tooltip para Sair */}
            <AnimatePresence>
              {hoveredItem === 'sair' && (
                <motion.div
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={tooltipVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    Sair
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-gray-900 dark:border-r-gray-700 border-t-transparent border-b-transparent"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileSidebarVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-brand-main dark:text-white">
                    PROMET
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeLink === item.name;
                    
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => handleNavigation(item.name)}
                          className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-brand-main/10 to-brand-lime/10 text-brand-main dark:text-brand-lime border-r-2 border-brand-main'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Botão para abrir sidebar mobile */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-main shadow-lg flex items-center justify-center text-white"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;