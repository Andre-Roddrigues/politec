"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Tipagem do pagamento com base no JSON fornecido
export type Pagamento = {
  id: string;
  candidatoId: string;
  edicaoId: string;
  itemNome: string;
  itemId: string;
  valor: number;
  desconto: number | null;
  metodoPagamento: "mpesa" | "transferencia" | "cartao";
  referencia: string;
  status: "processando" | "confirmado" | "falhou";
  createdAt: string;
  updatedAt: string;
  transferencia?: {
    id: string;
    imageUrl: string;
    motivo: string | null;
    referencia: string | null;
    pagamentoId: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  mpesa?: {
    id: string;
    contacto: string;
    transacaoId: string;
    pagamentoId: string;
    statusCode: number;
    mensagem: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  cartao?: any;
  curso?: any;
  testeDiagnostico?: {
    id: string;
    cursoId: string;
    candidaturaId: string;
    status: string;
    descricao: string | null;
    data: string | null;
    preco: number;
    contadorTeste: number;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export async function listarPagamentos(): Promise<ApiResponse<Pagamento[]>> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não encontrado",
      };
    }

    const resp = await fetch(routes.pagamentoscandidato, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!resp.ok) {
      throw new Error(`Erro ao listar pagamentos: ${resp.statusText}`);
    }

    const data: Pagamento[] = await resp.json();

    const filtrado = data.map((p) => ({
      id: p.id,
      itemId: p.itemId,
      itemNome: p.itemNome,
      status: p.status,
      metodo: p.metodoPagamento,
      mensagemErro:
        p.status === "falhou"
          ? p.mpesa?.mensagem || p.transferencia?.motivo || "Erro desconhecido"
          : null,
    }));

    return {
      success: true,
      data: filtrado as any,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro ao buscar pagamentos",
    };
  }
}
