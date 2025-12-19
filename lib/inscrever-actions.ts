'use server';

import { cookies } from "next/headers";

// Tipos para inscrição
export type InscricaoAPIRequest = {
  cursoId: string;
  horarioId: string;
};

export type InscricaoAPIResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    inscricaoCode: string;
  };
  error?: string;
};

export type InscricaoRequest = {
  cursoId: string;
  horarioId: string;
};

export type InscricaoResponse = {
  success: boolean;
  message: string;
  inscricaoId?: string;
  inscricaoCode?: string;
  error?: string;
};

// Configuração da API
const API_URL = 'https://backend-politec.unitec.ac.mz';
const API_TIMEOUT = 10000; // 10 segundos

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  // Obter token de autenticação
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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

// Função para inscrever um usuário em um curso
export async function inscreverUsuario(data: InscricaoRequest): Promise<InscricaoResponse> {
  try {
    // Validações básicas
    if (!data.cursoId || !data.horarioId) {
      return {
        success: false,
        message: 'Dados incompletos',
        error: 'Curso e horário são obrigatórios'
      };
    }

    // Preparar dados para a API
    const inscricaoAPIRequest: InscricaoAPIRequest = {
      cursoId: data.cursoId,
      horarioId: data.horarioId,
    };

    // Verificar se usuário está autenticado
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      return {
        success: false,
        message: 'Autenticação necessária',
        error: 'Faça login para realizar a inscrição'
      };
    }

    // Enviar para API real
    const response = await fetchAPI('/users/inscrever-se', {
      method: 'PUT',
      body: JSON.stringify(inscricaoAPIRequest),
    });

    // Verificar resposta da API
    const apiResponse = response as InscricaoAPIResponse;

    if (!apiResponse.success) {
      return {
        success: false,
        message: apiResponse.message || 'Erro ao realizar inscrição',
        error: apiResponse.error
      };
    }

    return {
      success: true,
      message: apiResponse.message || 'Inscrição realizada com sucesso!',
      inscricaoId: apiResponse.data?.id,
      inscricaoCode: apiResponse.data?.inscricaoCode
    };

  } catch (error) {
    console.error('Erro ao inscrever usuário:', error);
    
    return {
      success: false,
      message: 'Erro ao processar inscrição',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}