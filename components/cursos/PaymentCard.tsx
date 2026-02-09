// app/cursos/[id]/components/PaymentCard.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { 
  calcularValorComDescontoAPICorrigido, 
  calcularValorComIVA,
  formatarPorcentagemAPI,
  isGratuito 
} from "../../utils/price-calculations";
import { Gift } from "lucide-react";

interface PaymentCardProps {
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
  iconeBg: string;
  iconeColor: string;
  valorBase: number;
  descontPercentual: number;
  ivaPercentual: number;
  tipo: 'inscricao' | 'matricula' | 'mensalidade';
  estaAutenticado: boolean;
  inscricoesAbertas: boolean;
  selectedHorario: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function PaymentCard({
  titulo,
  subtitulo,
  icone: Icone,
  iconeBg,
  iconeColor,
  valorBase,
  descontPercentual,
  ivaPercentual,
  tipo,
  estaAutenticado,
  inscricoesAbertas,
  selectedHorario,
  loading,
  onClick
}: PaymentCardProps) {
  const gratuito = isGratuito(descontPercentual);
  
  const renderPreco = () => {
    if (gratuito) {
      return (
        <div className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
            {valorBase.toLocaleString('pt-MZ')} MT
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              GRATUITO
            </span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
              <Gift className="w-3 h-3" />
              100% OFF
            </span>
          </div>
        </div>
      );
    }
    
    if (descontPercentual > 0) {
      const valorComDesconto = calcularValorComDescontoAPICorrigido(valorBase, descontPercentual);
      
      return (
        <div className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
            {valorBase.toLocaleString('pt-MZ')} MT
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {valorComDesconto.toLocaleString('pt-MZ')} MT
            </span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
              -{formatarPorcentagemAPI(descontPercentual)}
            </span>
          </div>
        </div>
      );
    } else {
      // Sem desconto - mostra apenas o preço original
      return (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {valorBase.toLocaleString('pt-MZ')} MT
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            IVA: {ivaPercentual * 100}%
          </span>
        </div>
      );
    }
  };

  const getButtonText = () => {
    if (gratuito) return "Confirmar Gratuidade";
    if (tipo === 'inscricao') return "Pagar Inscrição";
    if (tipo === 'matricula') return "Pagar Matrícula";
    return "Pagar Mensalidade";
  };

  const getButtonColor = () => {
    if (gratuito) return "from-green-500 to-emerald-600";
    if (tipo === 'inscricao') return "bg-brand-main";
    if (tipo === 'matricula') return "bg-purple-600";
    return "bg-brand-lime";
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className={`w-10 h-10 rounded-xl ${iconeBg} flex items-center justify-center`}
            style={{ background: iconeBg }}
          >
            <Icone className={`w-5 h-5 ${iconeColor}`} style={{ color: iconeColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {gratuito ? `${titulo} Gratuita` : titulo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitulo}
            </p>
          </div>
        </div>

        <div className="mb-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin" />
            </div>
          ) : renderPreco()}
        </div>

        {estaAutenticado && inscricoesAbertas ? (
          <button
            onClick={onClick}
            disabled={!selectedHorario || loading}
            className={`w-full py-3 font-medium rounded-lg transition-colors ${selectedHorario && !loading
              ? gratuito 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                : `${getButtonColor()} hover:opacity-90 text-white`
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
          >
            {selectedHorario ? getButtonText() : "Selecione um horário"}
          </button>
        ) : (
          <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
            {!estaAutenticado ? "Faça login para confirmar" : "Inscrições encerradas"}
          </div>
        )}
      </div>
    </motion.div>
  );
}