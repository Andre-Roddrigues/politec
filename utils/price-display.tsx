// app/cursos/[id]/utils/price-display.tsx
import { Gift } from "lucide-react";
import {
  calcularValorComDescontoAPICorrigido,
  calcularValorComIVA,
  formatarPorcentagemAPI,
  isGratuito,
} from "./price-calculations";

interface RenderPrecoComDescontoProps {
  valorBase: number;
  descontPercentual: number;
  tipo: "inscricao" | "matricula" | "mensalidade";
  ivaPercentual: number;
  incluirIVA?: boolean;
}

export function renderPrecoComDesconto({
  valorBase,
  descontPercentual,
  tipo,
  ivaPercentual,
  incluirIVA = true,
}: RenderPrecoComDescontoProps) {
  const gratuito = isGratuito(descontPercentual);

  if (gratuito) {
    return (
      <div className="flex flex-col">
        <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
          {calcularValorComIVA(valorBase, ivaPercentual).toLocaleString(
            "pt-MZ"
          )}{" "}
          MT
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
    const valorComDesconto = calcularValorComDescontoAPICorrigido(
      valorBase,
      descontPercentual
    );
    const valorFinal = incluirIVA
      ? calcularValorComIVA(valorComDesconto, ivaPercentual)
      : valorComDesconto;

    const valorBaseComIVA = incluirIVA
      ? calcularValorComIVA(valorBase, ivaPercentual)
      : valorBase;

    return (
      <div className="flex flex-col">
        <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
          {valorBaseComIVA.toLocaleString("pt-MZ")} MT
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {valorFinal.toLocaleString("pt-MZ")} MT
          </span>
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
            -{formatarPorcentagemAPI(descontPercentual)}
          </span>
        </div>
      </div>
    );
  } else {
    const valorFinal = incluirIVA
      ? calcularValorComIVA(valorBase, ivaPercentual)
      : valorBase;

    return (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {valorFinal.toLocaleString("pt-MZ")} MT
        </span>
        {incluirIVA && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            IVA: {ivaPercentual * 100}%
          </span>
        )}
      </div>
    );
  }
}