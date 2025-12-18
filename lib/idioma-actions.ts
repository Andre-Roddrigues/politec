"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

export type Idioma = {
  id?: string;
  nome: string;
  fluencia: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

const API_URL = routes.backend_url;

// Cache em memória (escopo do servidor)
let idiomasCache: Idioma[] | null = null;
let lastFetchTime: number | null = null;

// Tempo de vida do cache (em ms) -> aqui coloquei 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

// Headers com autenticação
async function authHeaders() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) throw new Error("Token de autenticação não encontrado");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET - Lista de idiomas
export async function getIdiomas(): Promise<ApiResponse<Idioma[]>> {
  try {
    // Verificar se já temos cache válido
    const now = Date.now();
    if (idiomasCache && lastFetchTime && now - lastFetchTime < CACHE_TTL) {
      return {
        success: true,
        data: idiomasCache,
      };
    }

    const res = await fetch(`${API_URL}/idiomas`, {
      method: "GET",
      headers: await authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || `Erro ${res.status}: ${res.statusText}`,
        data: [],
      };
    }

    // Atualiza cache
    idiomasCache = data;
    lastFetchTime = now;

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("getIdiomas error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro desconhecido ao buscar idiomas",
      data: [],
    };
  }
}
