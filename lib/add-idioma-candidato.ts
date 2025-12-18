"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

export type IdiomaCandidato = {
  idIdioma: string;
  fluencia: string;
};

export type IdiomaCandidatoGet = {
  id: string;
  nome: string;
  candidato: { fluencia: string }[];
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

const API_URL = routes.backend_url;

// Função para recuperar o token e montar os headers
async function authHeaders() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) throw new Error("Token de autenticação não encontrado");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// POST /idioma-candidato
export async function addUserIdiomas(idioma: IdiomaCandidato): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/idioma-candidato`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(idioma), // garante envio JSON
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error("addUserIdiomas error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Erro desconhecido ao adicionar idioma" };
  }
}

// GET /idiomas-candidato
export async function getUserIdiomas(): Promise<ApiResponse<IdiomaCandidatoGet[]>> {
  try {
    const res = await fetch(`${API_URL}/idiomas-candidato`, {
      method: "GET",
      headers: await authHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error("getUserIdiomas error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Erro desconhecido ao buscar idiomas do candidato" };
  }
}

// DELETE /delete-idioma-candidato/:id
export async function deleteUserIdioma(idIdioma: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_URL}/delete-idioma-candidato/${idIdioma}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error("deleteUserIdioma error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Erro desconhecido ao deletar idioma" };
  }
}
