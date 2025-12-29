"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";
import LogoutButton from "../../common/LogoutButton";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Lê token e extrai role
  const checkAuth = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token) {
      setIsLoggedIn(false);
      setUserRole(null);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserRole(decoded.role || null);
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Define link conforme role
  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin/dashboard";
    if (userRole === "estudante") return "/user/cursos";
    if (userRole === "teacher" || userRole === "docente")
      return "/docente/dashboard";

    return "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="POLITEC" width={45} height={45} />
        </Link>

        {/* MENU */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-gray-600 hover:text-brand-main">
            Início
          </Link>

          <Link href="/cursos" className="text-gray-600 hover:text-brand-main">
            Cursos
          </Link>

          {isLoggedIn && (
            <Link
              href={getDashboardLink()}
              className="text-brand-main font-semibold hover:underline"
            >
              {userRole === "admin"
                ? "Dashboard"
                : userRole === "estudante"
                ? "Meus Cursos"
                : "Painel"}
            </Link>
          )}
        </div>

        {/* AÇÕES */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-brand-main text-brand-main rounded-lg hover:bg-brand-main hover:text-white transition"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 bg-brand-main text-white rounded-lg hover:opacity-90"
              >
                Registro
              </Link>
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
