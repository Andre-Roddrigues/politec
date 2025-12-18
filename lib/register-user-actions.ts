"use server";

import { routes } from "../config/routes";

export async function registerUser(userData: {
  nome: string;
  apelido: string;
  email: string;
  provincia: string;
  username: string;
  password: string;
}) {
  try {
    const response = await fetch(routes.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Se o backend devolver "message", usa essa mensagem
      throw new Error(data?.message || "Erro ao registrar usuário");
    }

    return {
      success: true,
      data,
      message: data?.message || "Usuário registrado com sucesso!",
    };
  } catch (error: any) {
    console.error("Erro no registerUser:", error);
    return {
      success: false,
      message: error.message || "Erro inesperado ao registrar usuário",
    };
  }
}
