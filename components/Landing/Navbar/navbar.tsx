"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "../../common/LogoutButton";
import { AnimatePresence, motion } from "framer-motion";

interface DecodedToken {
  role?: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    } catch {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const dashboardLink =
    userRole === "admin"
      ? "/admin/dashboard"
      : userRole === "estudante"
      ? "/user/cursos"
      : userRole === "docente"
      ? "/docente/dashboard"
      : "/";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={45} height={45} />
          </Link>

          {/* MENU CENTRAL (DESKTOP) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-brand-main">
              Início
            </Link>

            <Link href="/cursos" className="hover:text-brand-main">
              Cursos
            </Link>

            {isLoggedIn && (
              <Link
                href={dashboardLink}
                className="text-brand-main font-semibold"
              >
                {userRole === "admin"
                  ? "Dashboard"
                  : userRole === "estudante"
                  ? "Meus Cursos"
                  : "Painel"}
              </Link>
            )}
          </div>

          {/* BOTÕES DIREITA */}
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
                  className="px-4 py-2 bg-brand-main text-white rounded-lg"
                >
                  Registro
                </Link>
              </>
            ) : (
              <LogoutButton />
            )}

            {/* BOTÃO MOBILE */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden ml-2"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  Início
                </Link>

                <Link href="/cursos" onClick={() => setMobileOpen(false)}>
                  Cursos
                </Link>

                {isLoggedIn && (
                  <Link
                    href={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="font-semibold text-brand-main"
                  >
                    {userRole === "admin"
                      ? "Dashboard"
                      : userRole === "estudante"
                      ? "Meus Cursos"
                      : "Painel"}
                  </Link>
                )}

                <div className="pt-4">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block mb-3 text-center border border-brand-main text-brand-main py-2 rounded-lg"
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/registro"
                        onClick={() => setMobileOpen(false)}
                        className="block text-center bg-brand-main text-white py-2 rounded-lg"
                      >
                        Registro
                      </Link>
                    </>
                  ) : (
                    <LogoutButton />
                  )}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
