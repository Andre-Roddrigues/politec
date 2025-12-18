"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, EyeOff, User, Mail, Lock, 
  UserPlus, Phone, MapPin, ArrowRight, Check
} from "lucide-react";
import { registerUser } from "../../lib/register-user-actions";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../common/google-login-button";

const mozambiqueProvinces = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Sofala",
  "Manica",
  "Tete",
  "Zambézia",
  "Nampula",
  "Cabo Delgado",
  "Niassa"
];

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    email: "",
    provincia: "",
    contacto: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    nome: false,
    apelido: false,
    contacto: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const containsOnlyLetters = (text: string): boolean => {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(text);
  };

  const isValidContact = (contact: string): boolean => {
    const cleanContact = contact.replace(/\D/g, '');
    const validPrefixes = ['84', '87', '86', '82', '83', '85'];
    const hasValidPrefix = validPrefixes.some(prefix => cleanContact.startsWith(prefix));
    
    return /^\d+$/.test(contact.replace(/\s/g, '')) && hasValidPrefix;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "nome" || name === "apelido") {
      setFieldErrors(prev => ({ ...prev, [name]: value ? !containsOnlyLetters(value) : false }));
    }
    
    if (name === "contacto") {
      setFieldErrors(prev => ({ ...prev, [name]: value ? !isValidContact(value) : false }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = useMemo(
    () => form.password === form.confirmPassword,
    [form.password, form.confirmPassword]
  );

  const isFormValid = useMemo(() => {
    return (
      form.nome.trim() &&
      form.apelido.trim() &&
      form.email.trim() &&
      form.contacto.trim() &&
      form.provincia.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      !fieldErrors.nome &&
      !fieldErrors.apelido &&
      !fieldErrors.contacto &&
      passwordsMatch 
      // acceptedTerms
    );
  }, [form, passwordsMatch, fieldErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = form;

      const result = await registerUser(userData);

      if (!result.success) {
        toast.error(result.message || "Erro ao criar conta.");
        return;
      }

      toast.success(result.message || "Conta criada com sucesso!");

      setForm({
        nome: "",
        apelido: "",
        email: "",
        provincia: "",
        contacto: "",
        password: "",
        confirmPassword: "",
      });
      // setAcceptedTerms(false);
      setFieldErrors({
        nome: false,
        apelido: false,
        contacto: false,
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Erro inesperado ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-900/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-5xl flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative h-64 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/reg.jpg"
                alt="Cadastro"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-main/20 to-brand-lime/20 mix-blend-overlay" />
              
              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-brand-main/30 to-brand-lime/20 blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-brand-lime/20 to-brand-main/30 blur-xl"
              />
            </div>
            
            {/* Image Caption */}
            <div className="mt-6 text-center lg:text-left">
              <h2 className="text-xl font-light text-gray-800 dark:text-white mb-2">
                Junte-se à nossa comunidade
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Crie sua conta e comece sua jornada conosco
              </p>
              
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-brand-main to-brand-lime mb-4 shadow-lg"
                >
                  <UserPlus className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-light text-gray-900 dark:text-white mb-2 tracking-tight">
                  Criar Conta
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preencha seus dados para começar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome e Apelido */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("nome")}
                        onBlur={() => setIsFocused(null)}
                        className={`w-full pl-10 pr-3 py-2.5 text-sm bg-transparent border rounded-xl focus:outline-none transition-all duration-300 ${
                          fieldErrors.nome
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-300 dark:border-gray-600 focus:border-brand-main'
                        }`}
                        required
                      />
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                        isFocused === "nome" ? 'text-brand-main' : 'text-gray-400'
                      }`} />
                    </div>
                    {fieldErrors.nome && (
                      <p className="text-xs text-red-500 mt-1 px-1">Apenas letras</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="apelido"
                        placeholder="Apelido"
                        value={form.apelido}
                        onChange={handleChange}
                        onFocus={() => setIsFocused("apelido")}
                        onBlur={() => setIsFocused(null)}
                        className={`w-full pl-10 pr-3 py-2.5 text-sm bg-transparent border rounded-xl focus:outline-none transition-all duration-300 ${
                          fieldErrors.apelido
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-300 dark:border-gray-600 focus:border-brand-main'
                        }`}
                        required
                      />
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                        isFocused === "apelido" ? 'text-brand-main' : 'text-gray-400'
                      }`} />
                    </div>
                    {fieldErrors.apelido && (
                      <p className="text-xs text-red-500 mt-1 px-1">Apenas letras</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setIsFocused("email")}
                    onBlur={() => setIsFocused(null)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-brand-main transition-all duration-300"
                    required
                  />
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    isFocused === "email" ? 'text-brand-main' : 'text-gray-400'
                  }`} />
                </div>

                {/* Contacto */}
                <div className="relative">
                  <input
                    type="text"
                    name="contacto"
                    placeholder="Contacto (ex: 84...)"
                    value={form.contacto}
                    onChange={handleChange}
                    onFocus={() => setIsFocused("contacto")}
                    onBlur={() => setIsFocused(null)}
                    className={`w-full pl-10 pr-3 py-2.5 text-sm bg-transparent border rounded-xl focus:outline-none transition-all duration-300 ${
                      fieldErrors.contacto
                        ? 'border-red-300 focus:border-red-400'
                        : 'border-gray-300 dark:border-gray-600 focus:border-brand-main'
                    }`}
                    required
                  />
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    isFocused === "contacto" ? 'text-brand-main' : 'text-gray-400'
                  }`} />
                </div>
                </div>
                {fieldErrors.contacto && (
                  <p className="text-xs text-red-500 px-1">
                    Deve começar com 84, 87, 86, 82, 83 ou 85
                  </p>
                )}

                {/* Província Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border rounded-xl text-left flex items-center justify-between transition-all duration-300 ${
                      form.provincia 
                        ? 'border-brand-main' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-brand-main'
                    }`}
                  >
                    <div className="flex items-center">
                      <MapPin className={`w-4 h-4 mr-3 transition-colors ${
                        form.provincia ? 'text-brand-main' : 'text-gray-400'
                      }`} />
                      <span className={form.provincia ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                        {form.provincia || "Província"}
                      </span>
                    </div>
                    <div className={`transform transition-transform duration-300 ${
                      showProvinceDropdown ? 'rotate-180' : ''
                    }`}>
                      <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showProvinceDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                      >
                        <div className="max-h-48 overflow-y-auto">
                          {mozambiqueProvinces.map((province) => (
                            <button
                              key={province}
                              type="button"
                              onClick={() => {
                                setForm(prev => ({ ...prev, provincia: province }));
                                setShowProvinceDropdown(false);
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between text-sm transition-colors"
                            >
                              <span className="text-gray-700 dark:text-gray-300">{province}</span>
                              {form.provincia === province && (
                                <Check className="w-4 h-4 text-brand-main" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Senha"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setIsFocused("password")}
                      onBlur={() => setIsFocused(null)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-brand-main transition-all duration-300"
                      required
                    />
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                      isFocused === "password" ? 'text-brand-main' : 'text-gray-400'
                    }`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-main transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirmar"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setIsFocused("confirmPassword")}
                      onBlur={() => setIsFocused(null)}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border rounded-xl focus:outline-none transition-all duration-300 ${
                        !passwordsMatch && form.confirmPassword
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-gray-300 dark:border-gray-600 focus:border-brand-main'
                      }`}
                      required
                    />
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                      isFocused === "confirmPassword" ? 'text-brand-main' : 'text-gray-400'
                    }`} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-main transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {!passwordsMatch && form.confirmPassword && (
                  <p className="text-xs text-red-500 px-1">Senhas não coincidem</p>
                )}

                {/* Terms */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Já tem conta?{' '}
                  <Link
                    href="/login"
                    className="text-brand-main hover:text-brand-lime font-medium transition-colors inline-flex items-center"
                  >
                    Entrar
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </p>
              </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-brand-main to-brand-lime text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Criando...
                    </div>
                  ) : (
                    "Criar Conta"
                  )}
                </motion.button>

                
              </form>

              {/* Login Link */}
              
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}