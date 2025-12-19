'use server';

// Tipos baseados na sua API de horários
export type HorarioAPI = {
  id: string;
  periodo: string; // Ex: "Laboral(manhã)"
  hora: string;    // Ex: "7H00 - 12H00"
  createdAt: string;
  updatedAt: string;
};

// Configuração da API
const API_URL = 'https://backend-politec.unitec.ac.mz';
const API_TIMEOUT = 10000; // 10 segundos

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: A requisição demorou muito para responder');
    }
    
    throw error;
  }
}

// Função para buscar todos os horários disponíveis
export async function getAllHorarios(): Promise<HorarioAPI[]> {
  try {
    const horarios: HorarioAPI[] = await fetchAPI('/horarios');
    return horarios;
    
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw new Error('Não foi possível carregar os horários. Tente novamente mais tarde.');
  }
}

// Função para buscar horários de um curso específico
export async function getHorariosByCursoId(cursoId: string): Promise<HorarioAPI[]> {
  try {
    // Por enquanto, retorna todos os horários para todos os cursos
    const todosHorarios = await getAllHorarios();
    return todosHorarios;
    
  } catch (error) {
    console.error(`Erro ao buscar horários para o curso ${cursoId}:`, error);
    throw new Error(`Não foi possível carregar os horários para este curso.`);
  }
}