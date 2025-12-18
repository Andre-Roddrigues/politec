"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  User, 
  GraduationCap, 
  Briefcase, 
  Languages,
  ArrowRight
} from "lucide-react";

import ApplyButton from "./tabs/buttonAplly";
import { getCandidato, Candidato } from "../../../lib/candidato-actions";

type TabsProps = {
  tabs: string[];
  showCount?: boolean;
  counts?: Record<string, number>;
  renderTabContent: (tab: string) => ReactNode;
};

type StatusItemProps = {
  title: string;
  isCompleted: boolean;
  isRequired?: boolean;
};

const StatusItem = ({ title, isCompleted, isRequired = false }: StatusItemProps) => {
  let colorClass = "";
  let textClass = "";
  let Icon = Circle;

  if (isCompleted) {
    colorClass = "text-green-500";
    textClass = "text-green-600";
    Icon = CheckCircle;
  } else if (isRequired) {
    colorClass = "text-red-500";
    textClass = "text-red-600";
    Icon = AlertCircle;
  } else {
    colorClass = "text-gray-500";
    textClass = "text-gray-600";
    Icon = Circle;
  }

  return (
    <div className="flex items-center">
      <Icon className={`w-5 h-5 mr-2 ${colorClass}`} />
      <span className={`text-sm ${textClass}`}>
        {title} {isCompleted ? "✓" : isRequired ? "✗" : ""}{" "}
        {isRequired ? (
          <span className="text-xs text-gray-500">(Obrigatório)</span>
        ) : (
          <span className="text-xs text-gray-500">(Opcional)</span>
        )}
      </span>
    </div>
  );
};

// Mapeamento de ícones para cada tab
const tabIcons: Record<string, any> = {
  "Dados Pessoais": User,
  "Formação": GraduationCap,
  "Experiência": Briefcase,
  "Idiomas": Languages,
};

export default function HorizontalTabsWithApply({
  tabs,
  showCount = false,
  counts = {},
  renderTabContent,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Busca candidato e calcula progresso
  const checkUserStatus = async () => {
    try {
      setIsLoading(true);
      const data: Candidato | null = await getCandidato();
      if (data) {
        setCandidato(data);
        let completed = 0;
        const totalRequired = 2; // só 2 obrigatórios: dados pessoais + formação

        // Dados pessoais (obrigatório)
        const hasDadosPessoais =
          !!data.provincia && !!data.morada && !!data.dataNascimento && !!data.numeroBi;
        if (hasDadosPessoais) completed += 1;

        // Formação (obrigatório)
        const hasFormacao =
          !!data.nivelAcademico && data.formacoes && data.formacoes.length > 0;
        if (hasFormacao) completed += 1;

        // Experiência (opcional)
        const hasExperiencia = data.experiencias && data.experiencias.length > 0;
        if (hasExperiencia) completed += 1;

        // Idiomas (opcional)
        const hasIdiomas = data.idiomas && data.idiomas.length > 0;
        if (hasIdiomas) completed += 1;

        // Progresso
        setProgress(Math.round((completed / 4) * 100));
      }
    } catch (err) {
      console.error("Erro ao buscar candidato:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
    const interval = setInterval(checkUserStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = () => {
    if (!candidato) {
      toast.error("Preencha seus dados pessoais antes de se candidatar!");
      setActiveTab("Dados Pessoais");
      return;
    }
    if (!(candidato.nivelAcademico && candidato.formacoes?.length)) {
      toast.error("Preencha o formulário de Formação antes de se candidatar!");
      setActiveTab("Formação");
      return;
    }
  };

  const dadosCompletos =
    !!candidato?.provincia &&
    !!candidato?.morada &&
    !!candidato?.dataNascimento &&
    !!candidato?.numeroBi;

  const formacaoCompleta =
    !!candidato?.nivelAcademico && !!candidato?.formacoes?.length;

  const requisitosObrigatoriosOK = dadosCompletos && formacaoCompleta;

  // Função para obter o status de cada tab
  const getTabStatus = (tab: string) => {
    if (!candidato) return "incomplete";
    
    switch (tab) {
      case "Dados Pessoais":
        return dadosCompletos ? "complete" : "required";
      case "Formação":
        return formacaoCompleta ? "complete" : "required";
      case "Experiência":
        return candidato.experiencias?.length ? "complete" : "optional";
      case "Idiomas":
        return candidato.idiomas?.length ? "complete" : "optional";
      default:
        return "incomplete";
    }
  };

  return (
    <div className="w-full space-y-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Container Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Header com Progresso */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Meu Perfil Académico
              </h1>
              
              {/* Barra de Progresso */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progresso do perfil
                  </span>
                  <span className="text-sm font-bold text-brand-main">
                    {progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-main to-brand-lime rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 50, 
                      damping: 15, 
                      duration: 0.8 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botão de Candidatura */}
            <div className="lg:text-right">
              <ApplyButton
    isEnabled={requisitosObrigatoriosOK}
    onClick={handleApply}
    onCompleteProfile={() => window.location.href = '/completar-perfil'}
  />
            </div>
          </div>
        </div>

        {/* Tabs Horizontais */}
        <div className="border-b border-gray-100 dark:border-gray-700">
          <nav className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tabIcons[tab];
              const status = getTabStatus(tab);
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-3 px-6 py-4 border-b-2 min-w-max transition-all duration-300 ${
                    isActive
                      ? "border-brand-main text-brand-main bg-brand-lime/20"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {/* Ícone e Indicador de Status */}
                  <div className="relative">
                    <Icon 
                      size={20} 
                      className={
                        isActive ? "text-brand-main" : 
                        status === "complete" ? "text-green-500" :
                        status === "required" ? "text-red-500" : 
                        "text-gray-400"
                      } 
                    />
                    
                    {/* Indicador de status */}
                    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${
                      status === "complete" ? "bg-green-500" :
                      status === "required" ? "bg-red-500" :
                      "bg-gray-300"
                    }`} />
                  </div>

                  {/* Texto da Tab */}
                  <div className="flex flex-col items-start">
                    <span className={`font-medium text-sm ${
                      isActive ? "text-brand-main" : 
                      status === "complete" ? "text-green-600" :
                      status === "required" ? "text-red-600" : 
                      "text-gray-600"
                    }`}>
                      {tab}
                    </span>
                    
                    {/* Badge de status */}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      status === "complete" ? "bg-green-100 text-green-700" :
                      status === "required" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {status === "complete" ? "Completo" :
                       status === "required" ? "Obrigatório" :
                       "Opcional"}
                    </span>
                  </div>

                  {/* Contador (se aplicável) */}
                  {showCount && counts[tab] > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? "bg-brand-main text-white" 
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {counts[tab]}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo da Tab Ativa */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}