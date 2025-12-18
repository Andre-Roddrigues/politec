"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, Briefcase, GraduationCap, Info, User, FileText, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/public/images/prometlogo.png";
import Image from "next/image";
import LogoutButton from "../../common/LogoutButton";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Início");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const menuItems = [
    // { name: "Início", href: "/", icon: Briefcase },
    // { name: "Sobre", href: "/#sobre", icon: Briefcase },
    // { name: "Áreas de Formação", href: "/cursos", icon: GraduationCap  },
    // { name: "Como Funciona", href: "/#funcionamento", icon: Info  },
    // { name: "Benefícios", href: "/#beneficios", icon: Briefcase },
    { name: "", href: "/#contacto", icon: Briefcase },
  ];

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  // Função para verificar se existe token
  const checkAuthToken = () => {
    const hasAuthToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));
    return !!hasAuthToken;
  };

  useEffect(() => {
    // Tema
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.classList.add("light");
      setDarkMode(true);
    }

    // Verificar se existe sessão pelo cookie
    setIsLoggedIn(checkAuthToken());

    // Configurar verificação contínua do token
    const authCheckInterval = setInterval(() => {
      setIsLoggedIn(checkAuthToken());
    }, 1000); // Verifica a cada segundo

    // Limpar intervalo quando componente desmontar
    return () => clearInterval(authCheckInterval);
  }, []);

  // Escutar mudanças no storage (caso logout em outra aba)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(checkAuthToken());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setDarkMode(true);
    }
  };

  const handleNavigation = (name: string) => {
    setActiveLink(name);
    setIsMobileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-brand-main dark:text-brand-lime flex items-center"
        >
          {/* <Image src={logo} alt="PROMET" width={50} height={50} /> */}
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex space-x-8 font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-brand-main dark:hover:text-brand-lime transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-4">
          {/* Só aparece se NÃO estiver logado */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border dark:border-brand-lime dark:text-white border-brand-main text-brand-main font-medium hover:bg-brand-main hover:text-white transition"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 rounded-lg bg-brand-main text-white font-medium hover:bg-brand-main/90 transition"
              >
                Registro
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Dropdown de perfil */}
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;