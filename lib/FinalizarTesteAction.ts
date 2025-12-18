"use server";

import { cookies } from "next/headers";

export async function finalizarTesteAction(dados: {
  idTeste: string;
  respostas: { idQuestao: string; idOpcao: string }[];
}) {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }

    const response = await fetch("https://backend-promet.unitec.academy/fazer-teste", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao finalizar o teste:", error);
    throw error;
  }
}
