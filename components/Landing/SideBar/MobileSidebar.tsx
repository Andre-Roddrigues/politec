// components/Sidebar/MobileSidebar.tsx
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
  Menu,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  { name: "Perfil", icon: User, path: "/user/perfil" },
  { name: "Cursos", icon: BookOpen, path: "/user/cursos" },
  { name: "Matrículas", icon: FileText, path: "/user/matriculas" },
  { name: "Mensalidades", icon: CreditCard, path: "/user/mensalidades" },
];

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão Hamburger Fixo (Topo Esquerdo) - Para abrir o menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Drawer Overlay & Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-72 flex-col bg-white shadow-2xl dark:bg-gray-900"
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-main">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">POLITEC</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navegação */}
              <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-main/10 text-brand-main dark:bg-brand-main/20 dark:text-brand-main"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-main" : "text-gray-400"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer Logout */}
              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>Terminar sessão</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}