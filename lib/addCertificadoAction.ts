"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

export type ApiResponse = {
  success: boolean;
  message?: string;
};

export type Candidato = {
  id: string;
  idUser: string;
  provincia: string;
  morada: string;
  dataNascimento: string;
  numeroBi: string;
  nivelAcademico: string;
  contacto: string | null;
  whatsapp: string | null;
  genero: string;
  idiomaNativo: string;
  tipoDocumento: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  certificados?: Certificado[];
};

export type Certificado = {
  id: string;
  imgUrl: string;
  motivo: string | null;
  idCandidato: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  candidato: Candidato;
};

export type ApiResponsee<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

/**
 * Adicionar certificado (suporta imagens e PDFs)
 */
export async function adicionarCertificado(file: File): Promise<ApiResponse> {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) throw new Error("Erro de autenticação");

    // Verificar tipo de arquivo permitido
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        message: "Formato inválido. Apenas imagens (jpg, png) e PDF são aceitos.",
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch(routes.Adicionarcertificado, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return {
        success: false,
        message: data?.message || "Falha ao enviar certificado",
      };
    }

    return {
      success: true,
      message: data?.message || "Certificado enviado com sucesso!",
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Erro inesperado" };
  }
}

/**
 * Listar certificados do candidato
 */
export async function listarCertificados(
  idCandidato: string
): Promise<ApiResponsee<Certificado[]>> {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) throw new Error("Erro de autenticação");

    const resp = await fetch(
      `https://backend-promet.unitec.academy/listar-certificados/${idCandidato}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return {
        success: false,
        message: data?.message || "Falha ao listar certificados",
      };
    }

    return {
      success: true,
      data: data?.data || [],
      message: data?.message,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Erro inesperado" };
  }
}
