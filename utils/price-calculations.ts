// app/cursos/[id]/utils/price-calculations.ts

/**
 * Calcula valor com desconto baseado no formato da API
 * API: 1 = 100%, 0.5 = 50%, 0.05 = 5%, 0 = 0%
 */
export function calcularValorComDescontoAPICorrigido(valor: number, descontPercentual: number): number {
  if (descontPercentual <= 0) return valor;
  if (descontPercentual >= 1) return 0; // 1 ou mais = 100% = gratuito
  return valor * (1 - descontPercentual);
}

/**
 * Calcula valor com IVA
 */
export function calcularValorComIVA(valor: number, ivaPercentual: number): number {
  return valor * (1 + ivaPercentual);
}

/**
 * Formata porcentagem para exibição
 * Converte 0.5 → 50%, 1 → 100%, 0.05 → 5%
 */
export function formatarPorcentagemAPI(percentual: number): string {
  if (percentual === 1) return "100%";
  if (percentual >= 0.01 && percentual < 1) return `${(percentual * 100).toFixed(0)}%`;
  if (percentual > 0 && percentual < 0.01) return `${(percentual * 100).toFixed(1)}%`;
  return "0%";
}

/**
 * Verifica se é gratuito (100% de desconto)
 */
export function isGratuito(descontPercentual: number): boolean {
  return descontPercentual >= 1;
}

/**
 * Calcula a economia do desconto
 */
export function calcularEconomia(
  valorBase: number, 
  descontPercentual: number, 
  ivaPercentual: number
): number {
  const valorComDesconto = calcularValorComDescontoAPICorrigido(valorBase, descontPercentual);
  const valorOriginalComIVA = calcularValorComIVA(valorBase, ivaPercentual);
  const valorDescontoComIVA = calcularValorComIVA(valorComDesconto, ivaPercentual);
  
  return valorOriginalComIVA - valorDescontoComIVA;
}