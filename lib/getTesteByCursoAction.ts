"use server";

import { cookies } from "next/headers";

export async function getTesteByCursoAction(idCurso: string) {
  try {
    //  const token = (await cookies()).get("auth_token")?.value;
    // if (!token) {
    //   throw new Error("Token de autenticação não encontrado!");
    // }

    const response = await fetch(
      `https://backend-politec.unitec.ac.mz/teste-vocacional/curso/${idCurso}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar teste: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar teste:", error);
    return null;
  }
}
