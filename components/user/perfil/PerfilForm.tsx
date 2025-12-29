// components/Perfil/PerfilForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  MapPin,
  Home,
  Flag,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface PerfilFormProps {
  initialData?: {
    nome: string;
    email: string;
    telefone: string;
    bi: string;
    dataNascimento: string;
    nacionalidade: string;
    provincia: string;
    cidade: string;
    endereco: string;
    senhaAtual?: string;
    novaSenha?: string;
    confirmarSenha?: string;
  };
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

const provinciasMocambique = [
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
  "Niassa",
];

export default function PerfilForm({ initialData, onSave, onCancel }: PerfilFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    email: initialData?.email || "",
    telefone: initialData?.telefone || "",
    bi: initialData?.bi || "",
    dataNascimento: initialData?.dataNascimento || "",
    nacionalidade: initialData?.nacionalidade || "Moçambicana",
    provincia: initialData?.provincia || "Maputo Cidade",
    cidade: initialData?.cidade || "",
    endereco: initialData?.endereco || "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!formData.bi.trim()) newErrors.bi = "BI/Passaporte é obrigatório";
    if (!formData.dataNascimento) newErrors.dataNascimento = "Data de nascimento é obrigatória";
    if (!formData.nacionalidade.trim()) newErrors.nacionalidade = "Nacionalidade é obrigatória";
    if (!formData.provincia) newErrors.provincia = "Província é obrigatória";
    if (!formData.cidade.trim()) newErrors.cidade = "Cidade é obrigatória";
    
    // Password validation only if any password field is filled
    if (formData.senhaAtual || formData.novaSenha || formData.confirmarSenha) {
      if (!formData.senhaAtual) newErrors.senhaAtual = "Senha atual é obrigatória";
      if (!formData.novaSenha) newErrors.novaSenha = "Nova senha é obrigatória";
      if (formData.novaSenha.length < 6) newErrors.novaSenha = "Senha deve ter pelo menos 6 caracteres";
      if (formData.novaSenha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = "As senhas não coincidem";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você faria a chamada real para a API
      // await updateProfile(formData);
      
      onSave?.(formData);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setErrors(prev => ({ ...prev, submit: "Erro ao atualizar perfil. Tente novamente." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Informações Pessoais */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-main" />
          Informações Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.nome 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="Seu nome completo"
              />
            </div>
            {errors.nome && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nome}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.email 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.telefone 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="+258 84 123 4567"
              />
            </div>
            {errors.telefone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefone}</p>}
          </div>

          {/* BI/Passaporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              BI/Passaporte *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="bi"
                value={formData.bi}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.bi 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="1234567890123A"
              />
            </div>
            {errors.bi && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bi}</p>}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data de Nascimento *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.dataNascimento 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
              />
            </div>
            {errors.dataNascimento && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dataNascimento}</p>}
          </div>

          {/* Nacionalidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nacionalidade *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Flag className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="nacionalidade"
                value={formData.nacionalidade}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.nacionalidade 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="Moçambicana"
              />
            </div>
            {errors.nacionalidade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nacionalidade}</p>}
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-main" />
          Localização
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Província */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Província *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.provincia 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none`}
              >
                <option value="">Selecione uma província</option>
                {provinciasMocambique.map(provincia => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {errors.provincia && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.provincia}</p>}
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cidade *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Home className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.cidade 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="Nome da cidade"
              />
            </div>
            {errors.cidade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cidade}</p>}
          </div>

          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço Completo
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                <Home className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.endereco 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="Av. 25 de Setembro, nº 123, Bairro Central"
              />
            </div>
            {errors.endereco && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endereco}</p>}
          </div>
        </div>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-main" />
          Alterar Senha
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Preencha apenas se desejar alterar sua senha. Deixe em branco para manter a senha atual.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Senha Atual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword.senhaAtual ? "text" : "password"}
                name="senhaAtual"
                value={formData.senhaAtual}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.senhaAtual 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("senhaAtual")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.senhaAtual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.senhaAtual && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.senhaAtual}</p>}
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword.novaSenha ? "text" : "password"}
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.novaSenha 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("novaSenha")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.novaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.novaSenha && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.novaSenha}</p>}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword.confirmarSenha ? "text" : "password"}
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-main/50 ${
                  errors.confirmarSenha 
                    ? "border-red-300 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmarSenha")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.confirmarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmarSenha && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmarSenha}</p>}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Campos marcados com * são obrigatórios
        </p>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-main to-brand-lime text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}