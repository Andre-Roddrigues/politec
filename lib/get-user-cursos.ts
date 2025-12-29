// lib/actions/get-user-cursos.ts
"use server";

import { cookies } from "next/headers";

export interface InscricaoCurso {
  id: string;
  status: "pendente" | "aprovado" | "rejeitado" | "cancelado";
  mensalidadePaga: boolean;
  createdAt: string;
  cursoHorario: {
    id: string;
    mensalidade: string;
    inscricao: string;
    curso: {
      id: string;
      nome: string;
      duracao: string;
      descricao: string;
    };
    horario: {
      id: string;
      periodo: string;
      hora: string;
    };
  };
}

export interface InscricoesResponse {
  success: boolean;
  inscricoes: InscricaoCurso[];
}

export async function getUserCursos(): Promise<InscricaoCurso[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(
      "https://backend-politec.unitec.ac.mz/users/listar-inscricoes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar inscrições: ${response.status}`);
    }

    const data: InscricoesResponse = await response.json();
    return data.inscricoes || [];
  } catch (error) {
    console.error("Erro em getUserCursos:", error);
    throw new Error("Não foi possível carregar seus cursos");
  }
}