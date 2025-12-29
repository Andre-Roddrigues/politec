// app/perfil/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Bell, Settings, Download } from "lucide-react";
import PerfilHeader from "./PerfilHeader";
import PerfilForm from "./PerfilForm";

export default function PerfilUser() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nome: "Carlos Miguel",
    email: "carlos.miguel@email.com",
    telefone: "+258 84 123 4567",
    bi: "1234567890123A",
    dataNascimento: "1998-05-15",
    nacionalidade: "Moçambicana",
    provincia: "Maputo Cidade",
    cidade: "Maputo",
    endereco: "Av. 25 de Setembro, nº 123",
    status: "ativo" as const,
    nivel: "Graduação",
    dataIngresso: "2023-09-01",
  });

  const handleSave = (data: any) => {
    console.log("Dados salvos:", data);
    setUserData(prev => ({ ...prev, ...data }));
    setIsEditing(false);
    // Aqui você faria a chamada real para a API
    // await updateUserProfile(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meu Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-brand-main to-brand-lime text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Dados
            </button>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Conta Segura
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seus dados estão protegidos com criptografia de ponta
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Perfil completo</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Header */}
          <div className="lg:col-span-1">
            <PerfilHeader 
              userData={userData}
              onEditModeChange={setIsEditing}
            />
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <PerfilForm
                initialData={userData}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Info Sections */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Acadêmicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nível Académico</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{userData.nivel}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Data de Ingresso</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(userData.dataIngresso).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Matrícula</p>
                      <p className="font-semibold text-gray-900 dark:text-white">2023/001234</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Documentos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">BI/Passaporte</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Número: {userData.bi}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors">
                        Ver
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-bold">C</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Certificado</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ensino Médio</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors">
                        Baixar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-brand-main/5 to-brand-lime/5 dark:from-brand-main/10 dark:to-brand-lime/10 rounded-2xl p-6 border border-brand-main/20 dark:border-brand-lime/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Ações Rápidas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Alterar Email</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Mudar Senha</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Notificações</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Privacidade</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}