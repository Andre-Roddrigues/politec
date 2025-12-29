// components/admin/pagamentos/ModalConfirmacao.tsx
"use client";

import { useState } from "react";
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye,
  FileText,
  Calendar,
  User,
  Smartphone,
  CreditCard,
  DollarSign
} from "lucide-react";
import { Pagamento, atualizarStatusPagamento } from "../../../lib/admin-payments";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ModalConfirmacaoProps {
  pagamento: Pagamento | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalConfirmacao({ 
  pagamento, 
  isOpen, 
  onClose,
  onConfirm 
}: ModalConfirmacaoProps) {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"confirmar" | "rejeitar">("confirmar");
  const [showImage, setShowImage] = useState(false);

  if (!isOpen || !pagamento) return null;

  const handleAtualizarStatus = async () => {
    if (!pagamento) return;

    setLoading(true);
    try {
      console.log("=== ATUALIZAR STATUS ===");
      console.log("Pagamento ID:", pagamento.id);
      console.log("Ação:", actionType);
      console.log("Motivo:", motivo);

      // Validar motivo para rejeição
      if (actionType === "rejeitar" && !motivo.trim()) {
        toast.error("Por favor, informe o motivo da rejeição");
        setLoading(false);
        return;
      }

      // Definir status com base na ação
      const status = actionType === "confirmar" ? "confirmado" : "rejeitado";
      const motivoOpcional = actionType === "rejeitar" ? motivo : undefined;

      // Chamar a função única
      const result = await atualizarStatusPagamento(
        pagamento.id,
        status,
        motivoOpcional
      );

      console.log("Resultado:", result);

      if (result.success) {
        toast.success(result.message || `Pagamento ${status} com sucesso!`);
        onConfirm();
        onClose();
        setMotivo(""); // Limpar campo de motivo
      } else {
        toast.error(result.error || `Erro ao ${actionType} pagamento`);
      }
    } catch (error: any) {
      console.error("Erro no processamento:", error);
      toast.error(error.message || "Erro ao processar a solicitação");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectFetch = async () => {
    if (!pagamento) return;

    setLoading(true);
    try {
      console.log("=== FETCH DIRETO ===");
      
      if (actionType === "rejeitar" && !motivo.trim()) {
        toast.error("Por favor, informe o motivo da rejeição");
        setLoading(false);
        return;
      }

      // Obter token dos cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const token = getCookie('auth_token');
      console.log("Token:", token ? "Presente" : "Ausente");

      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        setLoading(false);
        return;
      }

      // Construir payload
      const payload = actionType === "confirmar" 
        ? { status: "confirmado" }
        : { status: "rejeitado", motivo };

      console.log("Payload:", payload);

      const endpoint = `https://backend-politec.unitec.ac.mz/admin/confirmar-pagamento/${pagamento.id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("Status:", response.status);

      const data = await response.json();
      console.log("Resposta:", data);

      if (!response.ok) {
        throw new Error(data.error || `Erro: ${response.statusText}`);
      }

      toast.success(data.message || `${actionType === "confirmar" ? "Confirmado" : "Rejeitado"} com sucesso!`);
      onConfirm();
      onClose();
      setMotivo("");
      
    } catch (error: any) {
      console.error("Erro no fetch direto:", error);
      toast.error(error.message || "Erro ao processar a solicitação");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: pt });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processando":
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "falhou":
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "processando":
        return "Processando";
      case "pendente":
        return "Pendente";
      case "falhou":
        return "Falhou";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`px-6 py-4 ${actionType === "confirmar" ? "bg-gradient-to-r from-brand-main to-brand-lime" : "bg-gradient-to-r from-red-600 to-red-400"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {actionType === "confirmar" ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {actionType === "confirmar" ? "Confirmar Pagamento" : "Rejeitar Pagamento"}
                  </h2>
                  <p className="text-sm text-white/80">
                    Referência: {pagamento.referencia}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* Alert */}
              <div className={`mb-6 p-4 rounded-lg ${
                actionType === "confirmar" 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    actionType === "confirmar" 
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      actionType === "confirmar" 
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}>
                      {actionType === "confirmar" 
                        ? "Você está prestes a confirmar este pagamento."
                        : "Você está prestes a rejeitar este pagamento."
                      }
                    </p>
                    <p className={`text-sm mt-1 ${
                      actionType === "confirmar" 
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }`}>
                      {actionType === "confirmar"
                        ? "Esta ação irá marcar o pagamento como confirmado e atualizar o status do estudante."
                        : "Esta ação irá marcar o pagamento como rejeitado."
                      }
                    </p>
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs font-mono">
                        <div>ID: {pagamento.id}</div>
                        <div>Payload: {JSON.stringify(
                          actionType === "confirmar" 
                            ? { status: "confirmado" }
                            : { status: "rejeitado", motivo }
                        )}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações do Pagamento */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Coluna 1: Informações do Pagamento */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Informações do Pagamento
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Referência:</span>
                          <span className="font-medium text-gray-900 dark:text-white ml-2">{pagamento.referencia}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {Number(pagamento.valor).toLocaleString("pt-MZ")} MT
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pagamento.metodoPagamento === 'mpesa' ? (
                          <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Método:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {pagamento.metodoPagamento === 'mpesa' ? 'M-Pesa' : 'Transferência'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {pagamento.itemNome === 'inscricao' ? 'Inscrição' : 
                             pagamento.itemNome === 'mensalidade' ? 'Mensalidade' : 'Curso'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status atual:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pagamento.status)}`}>
                            {getStatusText(pagamento.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Usuário */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Informações do Usuário
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white truncate">
                          {pagamento.user.nome} {pagamento.user.apelido}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white truncate">{pagamento.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">{pagamento.user.contacto}</span>
                      </div>
                      {pagamento.telefone && (
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900 dark:text-white">M-Pesa: {pagamento.telefone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Comprovante e Data */}
                <div className="space-y-4">
                  {/* Data e Detalhes */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Data e Tempo
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-gray-600 dark:text-gray-400 text-sm">Data do Pagamento:</div>
                          <div className="text-gray-900 dark:text-white">{formatDate(pagamento.dataPagamento)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-gray-600 dark:text-gray-400 text-sm">Criado em:</div>
                          <div className="text-gray-900 dark:text-white">{formatDate(pagamento.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comprovante de Transferência */}
                  {pagamento.metodoPagamento === 'transferencia' && pagamento.transferencias.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Comprovante de Transferência
                      </h3>
                      <div className="space-y-3">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          {showImage && pagamento.transferencias[0].imageUrl ? (
                            <img 
                              src={pagamento.transferencias[0].imageUrl} 
                              alt="Comprovante de transferência"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex flex-col items-center justify-center p-4">
                                      <Eye className="w-12 h-12 text-gray-400 mb-2" />
                                      <p class="text-gray-500 text-sm text-center">Imagem não disponível</p>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                              <Eye className="w-12 h-12 text-gray-400 mb-2" />
                              <p className="text-gray-500 text-sm text-center">Clique para visualizar o comprovante</p>
                              <button
                                onClick={() => setShowImage(true)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Visualizar Comprovante
                              </button>
                            </div>
                          )}
                        </div>
                        {showImage && (
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Status: <span className="font-medium">{pagamento.transferencias[0].status}</span>
                            </div>
                            <button
                              onClick={() => setShowImage(false)}
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              Ocultar imagem
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Campo de Motivo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {actionType === "confirmar" 
                    ? "Observações (opcional)"
                    : "Motivo da Rejeição *"
                  }
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder={
                    actionType === "confirmar"
                      ? "Adicione observações sobre esta confirmação..."
                      : "Informe o motivo da rejeição do pagamento..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required={actionType === "rejeitar"}
                />
                {actionType === "rejeitar" && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    * Campo obrigatório para rejeição
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActionType(actionType === "confirmar" ? "rejeitar" : "confirmar");
                    setMotivo(""); // Limpar motivo ao mudar de ação
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    actionType === "confirmar"
                      ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                  } transition-colors`}
                >
                  {actionType === "confirmar"
                    ? "Mudar para Rejeição"
                    : "Mudar para Confirmação"
                  }
                </button>
                
                {/* Botão principal - usar função única */}
                <button
                  onClick={handleAtualizarStatus}
                  disabled={loading || (actionType === "rejeitar" && !motivo.trim())}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                    actionType === "confirmar"
                      ? "bg-gradient-to-r from-brand-main to-brand-lime hover:from-brand-main/70 hover:to-brand-lime/70 text-white"
                      : "bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-600 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {actionType === "confirmar" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      {actionType === "confirmar" ? "Confirmar Pagamento" : "Rejeitar Pagamento"}
                    </div>
                  )}
                </button>
              </div>

              {/* Botão de teste direto (apenas em desenvolvimento) */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Teste Direto (Debug):</p>
                  <button
                    onClick={handleDirectFetch}
                    className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                  >
                    Testar Fetch Direto (Console F12)
                  </button>
                </div>
              )} */}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                ID: {pagamento.id}
              </div> */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}