"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { forgotPassword } from "../../../lib/reset-password-actions";
import { toast, Toaster } from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success("Verifique seu e-mail para redefinir a senha!");

      // Guarda o email no localStorage para uso futuro
      localStorage.setItem("forgot_email", email);

      setIsSubmitted(true);

      // Redireciona para /nova-senha
      setTimeout(() => {
        console.log("Redirecionando para /nova-senha com email:", email);
        router.push("/nova-senha");
      }, 2000);

    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar link de redefinição.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-blue-50 dark:bg-gray-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-md bg-white/95 dark:bg-gray-800 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-3">
            E-mail Enviado!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Enviamos instruções para <strong>{email}</strong>. 
            Verifique sua caixa de entrada e spam.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center justify-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Redirecionando para verificação do código...
            </div>
            
            <button
              onClick={() => router.push("/nova-senha")}
              className="text-brand-main hover:text-brand-lime font-medium transition-colors"
            >
              Clique aqui se não for redirecionado
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-brand-main to-brand-lime rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-main dark:from-white dark:to-brand-lime bg-clip-text text-transparent mb-3">
            Recuperar Senha
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Digite seu e-mail para receber o código de verificação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl 
                         focus:ring-2 focus:ring-brand-main/30 focus:border-brand-main/50 
                         bg-white dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full bg-gradient-to-r from-brand-main to-brand-lime text-white py-4 
                     rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Enviar Código de Verificação
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
