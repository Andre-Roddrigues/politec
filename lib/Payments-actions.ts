// lib/payments-actions.ts
"use server";
import { cookies } from "next/headers";

const API_URL = "https://backend-politec.unitec.ac.mz/users/pagamento";
const TRANSFERENCIA_URL = "https://backend-politec.unitec.ac.mz/users/pagamento/transferencia";

export interface PaymentPayload {
  itemId: string; // ID do cursoHorario
  cursoId: string; // ID do curso
  horarioId: string; // ID do horário
  metodoPagamento: "mpesa" | "emola" | "mKesh" | string;
  phoneNumber: string;
  itemNome: "inscricao" | "mensalidade" | "curso" | "matricula";
}

export interface TransferenciaPayload {
  itemId: string; // ID do cursoHorario
  cursoId: string; // ID do curso
  horarioId: string; // ID do horário
  itemNome: "inscricao" | "mensalidade" | "curso" | "matricula";
  metodoPagamento: "transferencia";
  file: File;
}

/* ============================
   PAGAMENTO NORMAL (MPESA, etc)
=============================== */
export async function createPayment(data: PaymentPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Erro ao processar pagamento");
    }

    return result;
  } catch (error: any) {
    console.error("Erro no pagamento:", error);
    throw new Error(error.message || "Erro inesperado no pagamento");
  }
}

/* ============================
   PAGAMENTO POR TRANSFERÊNCIA
=============================== */
export async function createTransferPayment(data: TransferenciaPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const formData = new FormData();
    formData.append("itemId", data.itemId);
    formData.append("cursoId", data.cursoId);
    formData.append("horarioId", data.horarioId);
    formData.append("itemNome", data.itemNome);
    formData.append("metodoPagamento", data.metodoPagamento);
    formData.append("file", data.file);

    const response = await fetch(TRANSFERENCIA_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Erro ao enviar comprovativo");
    }

    return result;
  } catch (error: any) {
    console.error("Erro no pagamento por transferência:", error);
    throw new Error(error.message || "Erro inesperado no pagamento");
  }
}