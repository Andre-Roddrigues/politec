"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";
type CandidatoPayload = {
  provincia: string;
  morada: string;
  dataNascimento: string;
  numeroBi: string;
  nivelAcademico: string;
  whatsapp: string;
  genero: string;
  idiomaNativo: string;
  isFromUnitec: boolean;
};

export async function adicionarCandidato(candidato: CandidatoPayload) {
  const token = (await cookies()).get("auth_token")?.value;

  try {
    const res = await fetch(routes.adicionarcandidato, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", 
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(candidato),
    });

    const data = await res.json();

    return {
      success: res.ok && data.success !== false,
      ...data,
    };
  } catch (error) {
    console.error("Erro no adicionarCandidato:", error);
    return { success: false, error: "Erro ao adicionar candidato" };
  }
}
