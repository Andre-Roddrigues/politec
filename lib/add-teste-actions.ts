"use server";

import { routes } from "../config/routes";
import { cookies } from "next/headers";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type NovoTeste = {
  candidaturaId: string;
};

export async function addTesteDiagnostico(
  data: NovoTeste
): Promise<ApiResponse<any>> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Usuário não autenticado.",
      };
    }

    const res = await fetch(`${routes.backend_url}/teste-diagnostico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || "Erro ao criar teste diagnóstico.",
      };
    }

    const responseData = await res.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro inesperado.",
    };
  }
}
