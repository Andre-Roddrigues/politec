// app/cursos/[id]/components/HorarioCard.tsx
"use client";

import { CheckCircle } from "lucide-react";
import { Horario } from "../../lib/get-horario-price";
import { renderPrecoComDesconto } from "../../utils/price-display";
import { getPeriodIcon, formatHora } from "../../utils/ui-helpers";

interface HorarioCardProps {
  horario: Horario;
  isSelected: boolean;
  onClick: () => void;
  // precoInscricao: number;
  // descontoInscricao: number;
  // precoMatricula: number;
  // descontoMatricula: number;
  // precoMensalidade: number;
  // ivaPercentual: number;
}

export default function HorarioCard({
  horario,
  isSelected,
  onClick,
  // precoInscricao,
  // descontoInscricao,
  // precoMatricula,
  // descontoMatricula,
  // precoMensalidade,
  // ivaPercentual
}: HorarioCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 text-left ${
        isSelected
          ? "border-brand-main dark:border-brand-lime bg-brand-main/5 dark:bg-brand-main/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getPeriodIcon(horario.periodo)}
          <span
            className={`font-medium ${
              isSelected
                ? "text-brand-main dark:text-brand-lime"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {horario.periodo}
          </span>
        </div>
        {isSelected && <CheckCircle className="w-4 h-4 text-green-500" />}
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Horário:</span> {formatHora(horario.hora)}
        </div>
      </div>
    </button>
  );
}