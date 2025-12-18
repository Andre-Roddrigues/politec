"use server";
import { routes } from "../config/routes";
import { cookies } from "next/headers";

const API_URL = routes.backend_url;

// Tipos para o pagamento
type PagamentoResponse = {
  pagamento: {
    id: string;
    candidatoId: string;
    itemNome: string;
    itemId: string;
    valor: number;
    metodoPagamento: string;
    referencia?: string;
    status: "pendente" | "concluido" | "falhou";
    edicaoId?: string;
    createdAt: string;
    updatedAt: string;
  };
  mpesa?: {
    id: string;
    pagamentoId: string;
    contacto: string;
    transacaoId: string;
    status: boolean;
    statusCode: number;
    mensagem?: string;
    createdAt: string;
    updatedAt: string;
  };
  gatewayResponse?: {
    success: boolean;
    statusCode: number;
    mensagem?: string;
  };
};

type EfectuarPagamentoArgs = {
  metodoPagamento: string;
  itemId: string;
  itemNome: string;
  comprovativo?: File;
  phoneNumber?: string;
};

type EfectuarPagamentoResult = {
  success: boolean;
  data?: PagamentoResponse;
  error?: string;
};

export async function efectuarPagamento({
  metodoPagamento,
  itemId,
  itemNome,
  comprovativo,
  phoneNumber,
}: EfectuarPagamentoArgs): Promise<EfectuarPagamentoResult> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    let res: Response;

    // Pagamento por transferência com comprovativo
    if (metodoPagamento === "transferencia" && comprovativo) {
      const formData = new FormData();
      formData.append("metodoPagamento", metodoPagamento);
      formData.append("itemId", itemId);
      formData.append("itemNome", itemNome);
      formData.append("comprovativo", comprovativo);

      res = await fetch(`${API_URL}/efectuar-pagamento`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } 
    // Pagamento Mpesa
    else if (metodoPagamento === "mpesa" && phoneNumber) {
      res = await fetch(`${API_URL}/efectuar-pagamento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metodoPagamento,
          itemId,
          itemNome,
          phoneNumber,
        }),
      });
    } 
    else {
      res = await fetch(`${API_URL}/efectuar-pagamento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metodoPagamento,
          itemId,
          itemNome,
        }),
      });
    }

    const data: PagamentoResponse = await res.json();

    if (res.status === 200 || res.status === 201) {
      if (data.mpesa && data.mpesa.statusCode >= 400) {
        return {
          success: false,
          error: data.mpesa.mensagem || "Pagamento falhou via Mpesa. Verifique o PIN e tente novamente.",
          data,
        };
      }

      if (data.gatewayResponse && data.gatewayResponse.statusCode >= 400) {
        return {
          success: false,
          error: data.gatewayResponse.mensagem || "Falha no pagamento. Tente novamente.",
          data,
        };
      }

      if (data.pagamento.status === "falhou") {
        return {
          success: false,
          error: "O pagamento não foi concluído. Por favor, tente novamente ou contacte suporte.",
          data,
        };
      }

      // Pagamento concluído
      return { success: true, data };
    } else {
      return {
        success: false,
        error: data.gatewayResponse?.mensagem || "Erro ao efectuar pagamento.",
        data,
      };
    }
  } catch (error: any) {
    console.error("Pagamento falhou:", error);
    return { success: false, error: error.message || "Erro inesperado no pagamento." };
  }
}
