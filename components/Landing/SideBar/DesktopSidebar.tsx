// components/Sidebar/DesktopSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, BookOpen, FileText, CreditCard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

interface DesktopSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const MENU_ITEMS = [
  { name: "Perfil", icon: User, path: "/user/perfil" },
  { name: "Cursos", icon: BookOpen, path: "/user/cursos" },
  { name: "Matrículas", icon: FileText, path: "/user/matriculas" },
  { name: "Mensalidades", icon: CreditCard, path: "/user/mensalidades" },
];

export default function DesktopSidebar({ collapsed = false, onToggleCollapse }: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    // 🔥 AQUI: sticky em vez de fixed. A altura desconta o tamanho da Navbar (ex: 60px ou 64px)
    <aside
      className={`sticky top-[64px] z-30 flex h-[calc(100vh-64px)] flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-label="Menu principal"
    >
      {/* Header / Logo */}
      <div className={`flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link href="/" className="flex items-center gap-3 overflow-hidden whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-brand-main rounded-lg">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-main">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">POLITEC</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">Portal do Estudante</span>
            </div>
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          className={`rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-main ${
            collapsed ? "absolute -right-3 top-5 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm" : ""
          }`}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-3" aria-label="Navegação lateral">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.name : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-main ${
                isActive
                  ? "bg-brand-main/10 text-brand-main dark:bg-brand-main/20 dark:text-brand-main"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-brand-main" : "text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"}`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {isActive && !collapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-main" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0 text-red-500 group-hover:text-red-700 dark:group-hover:text-red-300" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}