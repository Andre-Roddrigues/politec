// lib/actions/admin/listar-estudantes.ts
"use server";

import { cookies } from "next/headers";

export interface Estudante {
  id: string;
  status: string;
  mensalidadePaga: boolean;
  createdAt: string;
  user: {
    id: string;
    nome: string;
    apelido: string;
    email: string;
    contacto: string;
  };
  cursoHorario: {
    id: string;
    mensalidade: string;
    inscricao: string;
    curso: {
      id: string;
      nome: string;
    };
    horario: {
      id: string;
      periodo: string;
      hora: string;
    };
  };
}

export interface EstudantesResponse {
  success: boolean;
  data: Estudante[];
  total?: number;
  page?: number;
  limit?: number;
}

export async function listarEstudantes(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  cursoId?: string
): Promise<EstudantesResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Não autorizado");
    }

    // Construir query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (cursoId) params.append("cursoId", cursoId);

    const response = await fetch(
      `https://backend-politec.unitec.ac.mz/admin/listar-inscritos?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar estudantes: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data || [],
      total: data.total || data.data?.length || 0,
      page: page,
      limit: limit,
    };
  } catch (error) {
    console.error("Erro ao listar estudantes:", error);
    return {
      success: false,
      data: [],
      total: 0,
      page: page,
      limit: limit,
    };
  }
}

// Função para obter opções de filtro (cursos únicos)
export async function getCursosOptions(): Promise<{id: string, nome: string}[]> {
  try {
    const estudantes = await listarEstudantes(1, 1000);
    
    // Extrair cursos únicos dos dados
    const cursosUnicos = new Map();
    
    estudantes.data.forEach(estudante => {
      const curso = estudante.cursoHorario.curso;
      if (!cursosUnicos.has(curso.id)) {
        cursosUnicos.set(curso.id, curso);
      }
    });
    
    return Array.from(cursosUnicos.values());
  } catch (error) {
    console.error("Erro ao obter opções de cursos:", error);
    return [];
  }
}

// Função para exportar dados
export async function exportarEstudantes(
  formato: "excel" | "pdf",
  filtros?: {
    search?: string;
    status?: string;
    cursoId?: string;
  }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Não autorizado");
    }

    // Buscar todos os dados com filtros aplicados
    const params = new URLSearchParams({
      export: formato,
    });

    if (filtros?.search) params.append("search", filtros.search);
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.cursoId) params.append("cursoId", filtros.cursoId);

    const response = await fetch(
      `https://backend-politec.unitec.ac.mz/admin/exportar-estudantes?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao exportar: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Criar link de download
    const a = document.createElement("a");
    a.href = url;
    a.download = `estudantes_${new Date().toISOString().split('T')[0]}.${formato === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Erro ao exportar estudantes:", error);
    return { success: false, error: "Erro ao exportar estudantes" };
  }
}