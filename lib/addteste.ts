"use server";

import { cookies } from "next/headers";

const API_BASE = "https://backend-promet.unitec.academy";

// Função utilitária para tratar respostas da API
async function handleApiResponse(response: Response) {
  const result = await response.json().catch(() => ({}));

  // Sucesso (200 ou 201)
  if (response.ok && (response.status === 200 || response.status === 201)) {
    return { success: true, message: result.message || "Operação bem-sucedida!", data: result };
  }

  // Erro
  const errorMessage =
    result.message || `Erro ${response.status}: ${response.statusText}`;
  console.error("Erro da API:", errorMessage);
  return { success: false, error: errorMessage };
}

// 🔹 Adicionar Teste
export async function adicionarTesteAction(dados: {
  idCurso: string;
  titulo: string;
  dataTeste: string;
  duracao: string;
  descricao: string;
}) {
  try {
    const response = await fetch(`${API_BASE}/adicionar-teste`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    console.error("Erro ao adicionar teste:", error);
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}

// 🔹 Tipo para Testes
export type Teste = {
  id: string;
  idCurso: string;
  titulo: string;
  dataTeste: string;
  duracao?: string;
  descricao?: string;
  createdAt?: string;
};

// 🔹 Listar Testes
export async function listarTestesAction(): Promise<{
  success: boolean;
  data?: Teste[];
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE}/listar-testes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.message || `Erro ${response.status}`);
    }

    const data = await response.json();

    const testes: Teste[] = data.map((t: any) => ({
      id: t.id,
      idCurso: t.idCurso,
      titulo: t.titulo,
      dataTeste: t.dataTeste,
      duracao: t.duracao,
      descricao: t.descricao,
      createdAt: t.createdAt,
    }));

    return { success: true, data: testes };
  } catch (error: any) {
    console.error("Erro ao listar testes:", error);
    return { success: false, error: error.message };
  }
}

// 🔹 Adicionar Questão
export async function adicionarQuestaoAction(dados: {
  idTeste: string;
  enunciado: string;
}) {
  try {
    const response = await fetch(`${API_BASE}/adicionar-questao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    console.error("Erro ao adicionar questão:", error);
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}

// 🔹 Adicionar Opção
export async function adicionarOpcaoAction(dados: {
  idQuestao: string;
  texto: string;
  correcta: boolean;
}) {
  try {
    const response = await fetch(`${API_BASE}/adicionar-opcao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    return await handleApiResponse(response);
  } catch (error: any) {
    console.error("Erro ao adicionar opção:", error);
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}
