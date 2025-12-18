"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

// ================== TIPAGENS ==================
export type User = {
  id: string;
  nome: string;
  apelido: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Formacao = {
  id: string;
  idCandidato: string;
  local: string;
  nome: string;
  descricao: string;
  duracao: string | null;
  dataInicio: string;
  dataFim: string;
  createdAt: string;
  updatedAt: string;
};

export type Experiencia = {
  id: string;
  organizacao: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  idCandidato: string;
};

export type Idioma = {
  id: string;
  nome: string;
  fluencia: string;
  idCandidato: string;
  createdAt: string;
  updatedAt: string;
};

export type Certificado = {
  id: string;
  idCandidato: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type Candidato = {
  id: string;
  idUser: string;
  provincia: string;
  morada: string;
  dataNascimento: string;
  numeroBi: string;
  nivelAcademico: string;
  contacto: string;
  whatsapp: string;
  tipoDocumento: string;
  genero: string;
  idiomaNativo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
  isFromUnitec: boolean; // sempre boolean no front
  formacoes: Formacao[];
  experiencias: Experiencia[];
  idiomas: Idioma[]; 
  certificados?: Certificado[];
};

// ================== FUNÇÕES ==================
export async function getCandidato(): Promise<Candidato | null> {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    console.error("Token não encontrado nos cookies.");
    return null;
  }

  try {
    const res = await fetch(routes.candidato, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Erro ao buscar candidato:", res.status, res.statusText);
      return null;
    }

    const raw = await res.json();
    console.log("Dados brutos recebidos do backend (getCandidato):", raw);

    const data: Candidato = {
      ...raw,
      isFromUnitec:
        raw.isFromUnitec === 1 ||
        raw.isFromUnitec === "1" ||
        raw.isFromUnitec === true,
    };

    console.log("Candidato formatado (getCandidato):", data);
    return data;
  } catch (error) {
    console.error("Erro no fetch candidato:", error);
    return null;
  }
}

export async function updateCandidato(
  dados: Partial<Candidato>
): Promise<Candidato | null> {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    console.error("Token não encontrado nos cookies.");
    return null;
  }

  try {
    const body = {
      ...dados,
      isFromUnitec: dados.isFromUnitec ? 1 : 0,
    };

    console.log("📤 Dados enviados para atualização (updateCandidato):", body);

    const res = await fetch(routes.candidato, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Erro ao atualizar candidato:", res.status, res.statusText);
      return null;
    }

    const raw = await res.json();
    console.log("Resposta do backend (updateCandidato):", raw);

    const data: Candidato = {
      ...raw,
      isFromUnitec:
        raw.isFromUnitec === 1 ||
        raw.isFromUnitec === "1" ||
        raw.isFromUnitec === true,
    };

    console.log("Candidato atualizado e formatado (updateCandidato):", data);
    return data;
  } catch (error) {
    console.error("Erro no update candidato:", error);
    return null;
  }
}


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
    const res = await fetch(routes.idioma_candidato, {
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
    const res = await fetch(routes.idioma_candidato, {
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


export type Formation = {
  id?: string;
  local: string;
  nome: string;
  descricao?: string;
  duracao: string; // ex: "2 meses"
  dataInicio: string; // formato YYYY-MM-DD
  dataFim?: string;   // formato YYYY-MM-DD
};



// ➕ Adicionar formação
export async function addFormation(data: Formation) {
  try {
    const res = await fetch(routes.adicionarformacao, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao adicionar formação");

    return await res.json();
  } catch (err) {
    console.error("addFormation error:", err);
    throw err;
  }
}
// 📋 Listar todas formações
export async function getFormations() {
  try {
    const res = await fetch(routes.formacoescandidato, {
      method: "GET",
      headers: await authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      // Se a API retornou mensagem, use ela
      const message = data?.message || "Erro ao buscar formações";
      throw new Error(message);
    }

    // Se a API retornou apenas mensagem de "Nenhuma formação encontrada", retorna array vazio
    if (data?.message && data.message.includes("Nenhuma formação")) {
      return [];
    }

    return data; // array de formações
  } catch (err: any) {
    console.error("getFormations error:", err);
    // Mantém a mensagem original do erro para usar no toast
    throw new Error(err?.message || "Erro ao buscar formações");
  }
}


// ✏️ Atualizar formação
export async function updateFormation(id: string, data: Formation) {
  try {
    const res = await fetch(`${API_URL}/actualizar-formacao/${id}`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar formação");

    return await res.json();
  } catch (err) {
    console.error("updateFormation error:", err);
    throw err;
  }
}

// ❌ Deletar formação
export async function deleteFormation(id: string) {
  try {
    const res = await fetch(`${API_URL}/formacao/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });

    if (!res.ok) throw new Error("Erro ao deletar formação");

    return { success: true };
  } catch (err) {
    console.error("deleteFormation error:", err);
    throw err;
  }
}

export type Experience = {
  id?: string;
  organizacao: string;
  cargo: string;
  descricao: string;
  dataInicio: string; // formato YYYY-MM-DD
  dataFim?: string;   // formato YYYY-MM-DD
};


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