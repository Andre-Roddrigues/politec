"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { resetPassword } from "../../../lib/new-password";

export default function ResetPasswordPage() {
  const { otp } = useParams<{ otp: string }>();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Carregar email salvo no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("forgot_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Se não existir, volta para recuperar senha
      router.push("/recuperar-senha");
    }
  }, [router]);

  // Critérios de validação da senha
  const passwordRequirements = {
    hasUpperCase: /[A-Z]/.test(formData.newPassword),
    hasLowerCase: /[a-z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch =
    formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;
  const isFormValid = email && isPasswordValid && passwordsMatch;

  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError("A senha não atende aos requisitos mínimos");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem");
      return;
    }

    if (!email) {
      setError("E-mail não encontrado, volte e solicite novamente a recuperação.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await resetPassword({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      if (resp.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(resp.error);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-brand-main to-brand-lime rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-brand-main dark:from-white dark:to-brand-lime bg-clip-text text-transparent mb-2">
              Nova Senha
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Crie sua nova senha de acesso
            </p>

            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-white">
                <strong>Código:</strong> {otp}
              </p>
              {email && (
                <p className="text-sm text-gray-700 dark:text-white mt-1">
                  <strong>Email:</strong> {email}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={formData.newPassword}
                  onChange={handleInputChange("newPassword")}
                  className="w-full pl-11 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl 
                           focus:ring-2 focus:ring-brand-main/30 focus:border-brand-main/50 
                           bg-white dark:bg-gray-700 dark:text-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  className="w-full pl-11 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl 
                           focus:ring-2 focus:ring-brand-main/30 focus:border-brand-main/50 
                           bg-white dark:bg-gray-700 dark:text-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            <AnimatePresence>
              {formData.confirmPassword.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-lg border ${
                    passwordsMatch
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center">
                    <CheckCircle
                      className={`w-4 h-4 mr-2 ${
                        passwordsMatch ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        passwordsMatch
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {passwordsMatch ? "Senhas coincidem" : "Senhas não coincidem"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Requirements */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Requisitos da senha:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries({
                  minLength: "Mínimo 8 caracteres",
                  hasUpperCase: "Letra maiúscula",
                  hasLowerCase: "Letra minúscula",
                  hasNumber: "Número",
                  hasSpecialChar: "Caractere especial",
                }).map(([key, text]) => (
                  <div key={key} className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        passwordRequirements[key as keyof typeof passwordRequirements]
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        passwordRequirements[key as keyof typeof passwordRequirements]
                          ? "text-green-700 dark:text-green-300"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Senha redefinida com sucesso! Redirecionando para login...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !isFormValid || success}
              whileHover={!(loading || !isFormValid || success) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !isFormValid || success) ? { scale: 0.98 } : {}}
              className="w-full bg-brand-main text-white py-4 
                       rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Redefinindo...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Sucesso!
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Redefinir Senha
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}

              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Lembrou sua senha?{" "}
              <a
                href="/auth/login"
                className="text-brand-main hover:text-brand-lime font-medium transition-colors"
              >
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
