"use server";

export interface Graduacao {
  id: string;
  nome: string;
  preco: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "https://backend-promet.unitec.academy/graduacao";

/**
 * Busca todas as graduações cadastradas na API
 */
export async function getGraduacoes(): Promise<Graduacao[] | null> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // sempre pegar o mais recente do backend
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar graduações");
    }

    const data: Graduacao[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar graduações:", error);
    return null;
  }
}
