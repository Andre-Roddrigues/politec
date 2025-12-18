// /lib/enviar-candidatura-actions.ts
import Cookies from "js-cookie";
import { routes } from "../config/routes";

export interface CandidaturaData {
  idCurso: string;
}

export const enviarCandidatura = async (data: CandidaturaData) => {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado");

    const response = await fetch(routes.candidatura, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao enviar candidatura: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro em enviarCandidatura:", error);
    throw error;
  }
};
