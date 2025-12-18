"use server";

export interface CerticadosUnitec {
  id: string;
  nome: string;
  preco: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "https://backend-promet.unitec.academy/certificado-final";


export async function getCerticadosUnitec(): Promise<CerticadosUnitec[] | null> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // sempre pegar o mais recente do backend
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar Certficados");
    }

    const data: CerticadosUnitec[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar Certificados:", error);
    return null;
  }
}
