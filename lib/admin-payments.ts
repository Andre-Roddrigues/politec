// lib/actions/admin/admin-payments.ts
"use server";

import { cookies } from "next/headers";

export interface Transferencia {
  id: string;
  pagamentoId: string;
  referencia: string | null;
  motivo: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagamento {
  id: string;
  metodoPagamento: "mpesa" | "transferencia";
  referencia: string;
  itemNome: "inscricao" | "mensalidade" | "curso";
  valor: string;
  telefone: string | null;
  dataPagamento: string;
  status: "pendente" | "processando" | "confirmado" | "falhou" | "cancelado";
  itemId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nome: string;
    apelido: string;
    email: string;
    contacto: string;
  };
  transferencias: Transferencia[];
}

export interface PagamentosResponse {
  success: boolean;
  pagamentos: Pagamento[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Listar pagamentos com filtros
export async function listarPagamentos(
  page: number = 1,
  limit: number = 10,
  metodo?: "mpesa" | "transferencia",
  status?: string,
  search?: string,
  dataInicio?: string,
  dataFim?: string
): Promise<PagamentosResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("Não autorizado");
    }

    // Construir query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (metodo) params.append("metodo", metodo);
    if (status && status !== "all") params.append("status", status);
    if (search) params.append("search", search);
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    const response = await fetch(
      `https://backend-politec.unitec.ac.mz/admin/listar-pagamentos?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamentos: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      pagamentos: data.pagamentos || [],
      total: data.total || data.pagamentos?.length || 0,
      page: page,
      limit: limit,
    };
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    return {
      success: false,
      pagamentos: [],
      total: 0,
      page: page,
      limit: limit,
    };
  }
}

// Função única para atualizar status do pagamento
export async function atualizarStatusPagamento(
  pagamentoId: string,
  status: "confirmado" | "rejeitado",
  motivo?: string
): Promise<ConfirmPaymentResponse> {
  try {
    console.log("=== atualizarStatusPagamento ===");
    console.log("ID do pagamento:", pagamentoId);
    console.log("Novo status:", status);
    console.log("Motivo:", motivo);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.log("ERRO: Token não encontrado");
      return { success: false, error: "Não autorizado" };
    }

    // Construir payload
    const payload: any = { status };
    
    // Adicionar motivo apenas para rejeitado
    if (status === "rejeitado" && motivo) {
      payload.motivo = motivo;
    }

    console.log("Payload a ser enviado:", payload);

    // Usar o mesmo endpoint para ambos os casos
    const endpoint = `https://backend-politec.unitec.ac.mz/admin/mudar-status-pagamento/${pagamentoId}`;

    const response = await fetch(
      endpoint,
      {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("Status da resposta:", response.status);
    console.log("OK?", response.ok);

    const data = await response.json();
    console.log("Resposta da API:", data);

    if (!response.ok) {
      console.log("ERRO na resposta:", data);
      throw new Error(data.error || `Erro ao atualizar status para ${status}`);
    }

    console.log("SUCESSO:", data.message);
    return { 
      success: true, 
      message: data.message || `Status atualizado para ${status} com sucesso!` 
    };
  } catch (error: any) {
    console.error("ERRO catch:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao atualizar status do pagamento" 
    };
  }
}

// Funções de conveniência (opcionais - mantidas para compatibilidade)
export async function confirmarPagamento(
  pagamentoId: string
): Promise<ConfirmPaymentResponse> {
  return await atualizarStatusPagamento(pagamentoId, "confirmado");
}

export async function rejeitarPagamento(
  pagamentoId: string,
  motivo: string
): Promise<ConfirmPaymentResponse> {
  return await atualizarStatusPagamento(pagamentoId, "rejeitado", motivo);
}

// Obter estatísticas de pagamentos
export async function getPaymentStats() {
  try {
    const pagamentos = await listarPagamentos(1, 1000);
    
    if (!pagamentos.success) {
      return null;
    }

    const total = pagamentos.pagamentos.length;
    const confirmados = pagamentos.pagamentos.filter(p => p.status === "confirmado").length;
    const pendentes = pagamentos.pagamentos.filter(p => p.status === "pendente" || p.status === "processando").length;
    const falhados = pagamentos.pagamentos.filter(p => p.status === "falhou").length;
    
    const totalValor = pagamentos.pagamentos
      .filter(p => p.status === "confirmado")
      .reduce((sum, p) => sum + Number(p.valor), 0);
    
    const mpesaCount = pagamentos.pagamentos.filter(p => p.metodoPagamento === "mpesa").length;
    const transferenciaCount = pagamentos.pagamentos.filter(p => p.metodoPagamento === "transferencia").length;

    return {
      total,
      confirmados,
      pendentes,
      falhados,
      totalValor,
      mpesaCount,
      transferenciaCount,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return null;
  }
}