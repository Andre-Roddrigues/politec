"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

export type Experience = {
  id?: string;
  organizacao: string;
  cargo: string;
  descricao: string;
  dataInicio: string; // formato YYYY-MM-DD
  dataFim?: string;   // formato YYYY-MM-DD
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

const API_URL = routes.backend_url;

async function authHeaders() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch (err) {
    console.error("Erro ao obter headers de autenticação:", err);
    throw new Error("Falha na autenticação");
  }
}

// Validação básica dos dados
function validateExperienceData(data: Experience): void {
  if (!data.organizacao?.trim()) throw new Error("Organização é obrigatória");
  if (!data.cargo?.trim()) throw new Error("Cargo é obrigatório");
  if (!data.dataInicio) throw new Error("Data de início é obrigatória");
  
  // Validação de datas
  const inicio = new Date(data.dataInicio);
  if (data.dataFim) {
    const fim = new Date(data.dataFim);
    if (fim < inicio) throw new Error("Data fim não pode ser anterior à data início");
  }
}

export async function addExperience(data: Experience): Promise<ApiResponse> {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    validateExperienceData(data);
    
    const res = await fetch(routes.addexperienciaprofissional, {
      method: "POST",
       headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    const responseData = await res.json();
    return { success: true, data: responseData };
  } catch (err) {
    console.error("addExperience error:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erro desconhecido ao adicionar experiência" 
    };
  }
}

// ✏️ Atualizar experiência
export async function updateExperience(id: string, data: Experience): Promise<ApiResponse> {
  try {
    if (!id) throw new Error("ID é obrigatório para atualização");
    validateExperienceData(data);
    
    const res = await fetch(`${API_URL}/actualizar-experiencia-profissional/${id}`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    const responseData = await res.json();
    return { success: true, data: responseData };
  } catch (err) {
    console.error("updateExperience error:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erro desconhecido ao atualizar experiência" 
    };
  }
}
export async function getExperiences(): Promise<ApiResponse<Experience[]>> {
  const token = (await cookies()).get("auth_token")?.value;

  try {
    const res = await fetch(routes.experiencias, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data?.message === "Candidato não associado ao usuário!") {
      return {
        success: false,
        error: "Preencha os seus dados pessoais!",
        data: [],
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || `Erro ${res.status}: ${res.statusText}`,
        data: [],
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("getExperiences error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro desconhecido ao buscar experiências",
      data: [],
    };
  }
}


// ❌ Deletar experiência por ID
export async function deleteExperience(id: string): Promise<ApiResponse> {
        const token = (await cookies()).get("auth_token")?.value;
  try {
    if (!id) throw new Error("A Experiência não existe");
    
    // Verifique qual endpoint está correto: /experiencia ou /experiencia-profissional
    const res = await fetch(`${API_URL}/experiencia-profissional/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }, 
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${res.status}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error("deleteExperience error:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Erro desconhecido ao deletar experiência" 
    };
  }
}