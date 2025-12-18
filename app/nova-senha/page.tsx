"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Clock, RotateCcw, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { resendOtp } from "../../lib/resend-otp";

export default function InsertOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const focusNextInput = (index: number) => {
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevInput = (index: number) => {
    if (index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Permite apenas números
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Suporte a colagem
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6);
      digits.forEach((digit, digitIndex) => {
        if (digitIndex < 6) {
          newOtp[digitIndex] = digit;
        }
      });
      setOtp(newOtp);
      
      // Foca no último campo preenchido
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[5]?.blur();
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Foca no próximo campo se um dígito foi inserido
    if (value && index < 5) {
      focusNextInput(index);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        focusPrevInput(index);
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusPrevInput(index);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusNextInput(index);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").split("").slice(0, 6);
    
    if (digits.length === 6) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      alert("Digite o código completo de 6 dígitos");
      return;
    }

    setLoading(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    router.push(`/nova-senha/${otpString}`);
  };

 const handleResendOTP = async () => {
  if (countdown > 0) return;

  const email = localStorage.getItem("forgot_email");
  if (!email) {
    toast.error("E-mail não encontrado. Refaça a recuperação de senha.");
    return;
  }

  try {
    setCountdown(30); // Bloqueia por 30 segundos

    const response = await resendOtp(email);

    if (response.success) {
      toast.success("Código reenviado para seu e-mail!");
    } else {
      toast.error(response.message || "Erro ao reenviar o OTP.");
      setCountdown(0); // Libera o botão em caso de erro
    }
  } catch (err: any) {
    toast.error(err.message || "Erro inesperado ao reenviar OTP.");
    setCountdown(0); // Libera o botão em caso de erro
  }
};

  const isFormValid = otp.join("").length === 6;

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
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-brand-main dark:from-white dark:to-brand-lime bg-clip-text text-transparent mb-2">
              Verificação de Código
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Digite o código de 6 dígitos
            </p>
          </div>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                Código de Verificação
              </label>
              
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={index === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-2xl font-bold text-gray-800 dark:text-white 
                             border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 
                             shadow-sm transition-all duration-200
                             bg-white dark:bg-gray-700"
                    autoFocus={index === 0}
                    whileFocus={{ scale: 1.05 }}
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Digite o código recebido no seu e-mail
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !isFormValid}
              whileHover={!(loading || !isFormValid) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !isFormValid) ? { scale: 0.98 } : {}}
              className="w-full bg-gradient-to-r from-brand-main to-brand-lime text-white py-4 
                       rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl 
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
              
              {/* Efeito de brilho no hover */}
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </form>

          {/* Resend OTP */}
          <div className="text-center mt-8">
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-main 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                       group"
            >
              {countdown > 0 ? (
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Reenviar em {countdown}s</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-1 group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reenviar código</span>
                </div>
              )}
            </button>
          </div>

          {/* Informações */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 
                        rounded-xl border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-brand-main rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código expira em 15 minutos
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Verifique sua caixa de spam se não encontrar o e-mail
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Problemas com o código?{" "}
              <button 
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className="text-brand-main hover:text-brand-lime font-medium transition-colors disabled:opacity-50"
              >
                Reenviar agora
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}