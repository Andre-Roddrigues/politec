'use client';

// Tipos para inscrição (repetidos para o client)
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

// Importar a server action
import { inscreverUsuario as serverInscreverUsuario } from './inscrever-actions';

// Wrapper client-side para a server action
export async function inscreverUsuario(
  data: InscricaoRequest
): Promise<InscricaoResponse> {
  try {
    // Chamar a server action diretamente
    const result = await serverInscreverUsuario(data);
    return result;
  } catch (error) {
    console.error('Erro no client ao inscrever usuário:', error);
    
    return {
      success: false,
      message: 'Erro de conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}