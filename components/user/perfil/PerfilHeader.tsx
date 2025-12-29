// components/Perfil/PerfilHeader.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Camera,
  CheckCircle,
  Edit3,
  Shield,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

interface PerfilHeaderProps {
  userData?: {
    nome: string;
    email: string;
    telefone: string;
    bi: string;
    dataNascimento: string;
    nacionalidade: string;
    provincia: string;
    cidade: string;
    endereco: string;
    fotoUrl?: string;
    status: "ativo" | "pendente" | "inativo";
    nivel: string;
    dataIngresso: string;
  };
  onEditModeChange?: (isEditing: boolean) => void;
}

export default function PerfilHeader({ userData, onEditModeChange }: PerfilHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultUser = {
    nome: "Carlos Miguel",
    email: "carlos.miguel@email.com",
    telefone: "+258 84 123 4567",
    bi: "1234567890123A",
    dataNascimento: "1998-05-15",
    nacionalidade: "Moçambicana",
    provincia: "Maputo",
    cidade: "Maputo Cidade",
    endereco: "Av. 25 de Setembro, nº 123",
    fotoUrl: "",
    status: "ativo",
    nivel: "Graduação",
    dataIngresso: "2023-09-01",
  };

  const user = userData || defaultUser;

  const handleEditToggle = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    onEditModeChange?.(newEditingState);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "inativo":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Função para truncar texto longo
  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Header Gradient */}
      <div className="relative h-32 bg-gradient-to-r from-brand-main via-brand-main to-brand-lime">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="relative px-6 md:px-8 pb-6 md:pb-8 -mt-16">
        {/* Photo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
              {photoPreview || user.fotoUrl ? (
                <Image
                  src={photoPreview || user.fotoUrl!}
                  alt={user.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Photo Upload Overlay */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Photo Actions */}
          {isEditing && photoPreview && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleRemovePhoto}
              className="mt-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
            >
              Remover foto
            </motion.button>
          )}
        </div>

        {/* User Info */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex flex-col items-center gap-2 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words max-w-full">
              {user.nome}
            </h1>
            {user.status === "ativo" && (
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(user.status)}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs md:text-sm font-medium">
              <Award className="w-3 h-3 inline mr-1" />
              {user.nivel}
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs md:text-sm font-medium">
              <Calendar className="w-3 h-3 inline mr-1" />
              Desde {new Date(user.dataIngresso).getFullYear()}
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            Estudante dedicado na POLITEC com foco em excelência acadêmica e desenvolvimento profissional.
          </p>
        </div>

        {/* Contact Info - Grid ajustada */}
        <div className="md:gap-4 mb-6 md:mb-8">
          {/* Email Card */}
          <div className="flex items-start mt-2 gap-3 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[80px]">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base break-all">
                {user.email}
              </p>
            </div>
          </div>

          {/* Telefone Card */}
          <div className="flex items-start mt-2 gap-3 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[80px]">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base break-all">
                {user.telefone}
              </p>
            </div>
          </div>

          {/* BI/Passaporte Card */}
          <div className="flex items-start mt-2 gap-3 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[80px]">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">BI/Passaporte</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base break-all">
                {user.bi}
              </p>
            </div>
          </div>

          {/* Localização Card */}
          <div className="flex items-start mt-2 gap-3 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[80px]">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Localização</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base break-words">
                {truncateText(`${user.cidade}, ${user.provincia}`, 30)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:px-6 bg-gradient-to-r from-brand-main to-brand-lime text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 bg-gradient-to-r from-brand-main to-brand-lime text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}