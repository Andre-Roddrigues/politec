"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRightToLine } from "lucide-react";
import Cookies from "js-cookie";
import { loginUser } from "../../../lib/login-actions";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  userType?: string;
  exp?: number;
}

export default function LoginForm() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectByRole = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);

    const role =
      decoded.role ||
      decoded.userType ||
      "";

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else if (role === "teacher" || role === "docente") {
      router.replace("/docente/dashboard");
    } else {
      router.replace("/cursos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(form);

      if (result?.token) {
        Cookies.set("auth_token", result.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        toast.success("Login realizado com sucesso!", {
          duration: 1200,
        });

        setTimeout(() => {
          redirectByRole(result.token);
        }, 800);

      } else {
        toast.error("Token não encontrado.");
      }
    } catch (error) {
      toast.error("Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-gray-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* FORM */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-brand-main">Bem-vindo de volta!</h1>
              <p className="text-gray-600 text-xs">Entre na sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Email ou Username"
                    value={form.identifier}
                    onChange={handleChange}
                    className="w-full pl-10 py-2.5 text-xs border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Senha"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-xs border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-main text-white py-2.5 rounded-lg font-medium"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="text-xs text-center mt-4">
              Não tem conta?{" "}
              <Link href="/registro" className="text-blue-600 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* IMAGEM */}
          <div className="hidden md:block md:w-1/2 relative">
            <Image
              src="/images/reg.jpg"
              alt="Login"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
