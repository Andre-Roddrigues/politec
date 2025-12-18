// routes.horarios.ts

import { routes } from "../config/routes";

export interface Horario {
  id: string;
  periodo: string;
  hora_inicio: string;
  hora_fim: string;
  createdAt: string;
  updatedAt: string;
}

export async function getHorarios(): Promise<Horario[] | null> {
  try {
    const response = await fetch(routes.horarios, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ou "default" se preferir cache
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar horários");
    }

    const data: Horario[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao carregar horários:", error);
    return null;
  }
}
