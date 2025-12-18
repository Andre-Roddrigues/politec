import Cookies from "js-cookie";
import { routes } from "../config/routes";

export interface Curso {
  id: string;
  nome: string;
  preco: number;
  precoTeste: number;
  descricao: string | null;
  imgUrl: string | null;
  desconto: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Candidatura {
  id: string;
  status: string;
  idCandidato: string;
  idEdicao: string;
  idCurso: string;
  createdAt: string;
  updatedAt: string;
  cursos: Curso;
}

export interface ApiResponseError {
  message: string;
}

/**
 * @returns Lista de candidaturas ou erro da API
 */
export const getCandidaturas = async (): Promise<Candidatura[]> => {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado");

    const response = await fetch(routes.candidaturascandidato,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const apiError = data as ApiResponseError;
      throw new Error(apiError.message || "Erro ao buscar candidaturas");
    }

    return data as Candidatura[];
  } catch (error: any) {
    console.error("Erro ao buscar candidaturas:", error.message || error);
    throw new Error(error.message || "Erro desconhecido");
  }
};

/**
 * Deleta uma candidatura pelo ID
 * @param id ID da candidatura a ser deletada
 */
export const deleteCandidatura = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado");

    const response = await fetch(
      `https://backend-promet.unitec.academy/candidatura/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Se retornar 200, 201 ou 204 -> sucesso
    if ([200, 201, 204].includes(response.status)) {
      return { success: true };
    }

    // Caso contrário, tenta pegar mensagem de erro
    let errorMsg = "Erro ao deletar candidatura";
    try {
      const data = await response.json();
      if (data?.message) errorMsg = data.message;
    } catch {
      // se não for JSON válido, mantém mensagem padrão
    }

    throw new Error(errorMsg);
  } catch (error: any) {
    console.error("Erro ao deletar candidatura:", error.message || error);
    return { success: false, message: error.message || "Erro desconhecido" };
  }
};

