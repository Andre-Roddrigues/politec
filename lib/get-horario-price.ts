// lib/actions/getHorarios.ts

export interface Horario {
  id: string;
  periodo: string;
  hora: string;
}

export interface HorariosResponse {
  success: boolean;
  horarios?: Horario[];
}

export async function getHorarios(): Promise<Horario[]> {
  try {
    const res = await fetch(
      'https://backend-politec.unitec.ac.mz/horarios',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar horários: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Verifica diferentes formatos de resposta
    if (Array.isArray(data)) {
      // Se a resposta for um array direto
      return data as Horario[];
    } else if (data.success && Array.isArray(data.horarios)) {
      // Se a resposta tiver estrutura { success: true, horarios: [] }
      return data.horarios;
    } else if (data.horarios && Array.isArray(data.horarios)) {
      // Se a resposta tiver estrutura { horarios: [] }
      return data.horarios;
    } else {
      console.warn('Formato de resposta inesperado:', data);
      return [];
    }
    
  } catch (error) {
    console.error('Erro em getHorarios:', error);
    return [];
  }
}

// Função para formatar hora para exibição
export function formatarHoraParaExibicao(hora: string): string {
  if (!hora) return '--:--';
  
  // Remove "H" e substitui por ":"
  return hora
    .replace(/H/g, ':')
    .replace(/ - /g, ' - ');
}

// Função para obter ícone baseado no período
export function getPeriodoIcon(periodo: string) {
  const periodoLower = periodo.toLowerCase();
  
  if (periodoLower.includes('manhã') || periodoLower.includes('manha')) {
    return '☀️'; // Sol para manhã
  }
  if (periodoLower.includes('tarde')) {
    return '🌤️'; // Sol parcial para tarde
  }
  if (periodoLower.includes('noite') || periodoLower.includes('pós') || periodoLower.includes('pos')) {
    return '🌙'; // Lua para noite
  }
  if (periodoLower.includes('laboral')) {
    return '🕐'; // Relógio para laboral
  }
  
  return '🕐'; // Ícone padrão
}

// Função para agrupar horários por período
export function agruparHorariosPorPeriodo(horarios: Horario[]): Record<string, Horario[]> {
  const grupos: Record<string, Horario[]> = {};
  
  horarios.forEach(horario => {
    const periodo = horario.periodo;
    if (!grupos[periodo]) {
      grupos[periodo] = [];
    }
    grupos[periodo].push(horario);
  });
  
  return grupos;
}

// Função para ordenar horários por período (manhã → tarde → noite)
export function ordenarHorarios(horarios: Horario[]): Horario[] {
  const ordemPeriodos = ['manhã', 'tarde', 'noite', 'pós-laboral', 'laboral'];
  
  return [...horarios].sort((a, b) => {
    const periodoA = a.periodo.toLowerCase();
    const periodoB = b.periodo.toLowerCase();
    
    const indexA = ordemPeriodos.findIndex(p => periodoA.includes(p));
    const indexB = ordemPeriodos.findIndex(p => periodoB.includes(p));
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    return periodoA.localeCompare(periodoB);
  });
}

// Função para obter período mais comum (default)
export function getPeriodoDefault(horarios: Horario[]): string {
  if (horarios.length === 0) return 'Laboral (manhã)';
  
  const periodos = horarios.map(h => h.periodo);
  const frequencia: Record<string, number> = {};
  
  periodos.forEach(p => {
    frequencia[p] = (frequencia[p] || 0) + 1;
  });
  
  let maxFreq = 0;
  let periodoDefault = horarios[0].periodo;
  
  Object.entries(frequencia).forEach(([periodo, freq]) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      periodoDefault = periodo;
    }
  });
  
  return periodoDefault;
}