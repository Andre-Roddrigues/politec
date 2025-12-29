// components/admin/estudantes/ModalDetalhes.tsx
"use client";

import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Clock, 
  DollarSign, 
  CheckCircle,
  XCircle,
  Clock3,
  CreditCard,
  FileText,
  Download,
  Printer,
  MessageSquare
} from "lucide-react";
import { Estudante } from "../../../lib/listar-estudantes";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ModalDetalhesProps {
  estudante: Estudante | null;
  isOpen: boolean;
  onClose: () => void;
  onExport?: (estudante: Estudante) => void;
}

export default function ModalDetalhes({ 
  estudante, 
  isOpen, 
  onClose,
  onExport 
}: ModalDetalhesProps) {
  if (!isOpen || !estudante) return null;

  // Função para status
  const getStatusInfo = (status: string, mensalidadePaga: boolean) => {
    switch (status) {
      case "aprovado":
        return {
          text: "Aprovado",
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
          icon: <CheckCircle className="w-5 h-5" />
        };
      case "pendente":
        return {
          text: mensalidadePaga ? "Ativo" : "Pendente Pagamento",
          color: mensalidadePaga 
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
          icon: mensalidadePaga 
            ? <CheckCircle className="w-5 h-5" />
            : <Clock3 className="w-5 h-5" />
        };
      case "rejeitado":
        return {
          text: "Rejeitado",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
          icon: <XCircle className="w-5 h-5" />
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
          icon: <Clock3 className="w-5 h-5" />
        };
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt });
    } catch {
      return dateString;
    }
  };

  const statusInfo = getStatusInfo(estudante.status, estudante.mensalidadePaga);

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
          <div className="sticky top-0 z-10 bg-brand-main px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {estudante.user.nome} {estudante.user.apelido}
                  </h2>
                  <p className="text-sm text-blue-100">
                    Detalhes do Estudante
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onExport?.(estudante)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Exportar ficha"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* Quick Actions Bar */}
              {/* <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40">
                    <MessageSquare className="w-4 h-4" />
                    Enviar mensagem
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40">
                    <Printer className="w-4 h-4" />
                    Imprimir ficha
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/40">
                    <FileText className="w-4 h-4" />
                    Gerar contrato
                  </button>
                </div>
              </div> */}

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna 1: Informações Pessoais */}
                <div className="space-y-6">
                  {/* Informações Pessoais */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Informações Pessoais
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Nome
                          </label>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {estudante.user.nome} 
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                           Apelido
                          </label>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {estudante.user.apelido}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`mailto:${estudante.user.email}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                            >
                              {estudante.user.email}
                            </a>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Contacto
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`tel:${estudante.user.contacto}`}
                              className="text-gray-900 dark:text-white hover:text-blue-600"
                            >
                              {estudante.user.contacto}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status da Inscrição */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Status da Inscrição
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {statusInfo.icon}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Status
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Situação atual
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg font-medium ${statusInfo.color} border`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Data de Inscrição
                        </label>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(estudante.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Mensalidade
                        </label>
                        <div className="flex items-center gap-2">
                          <CreditCard className={`w-4 h-4 ${estudante.mensalidadePaga ? 'text-green-500' : 'text-yellow-500'}`} />
                          <span className={`font-medium ${estudante.mensalidadePaga ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                            {estudante.mensalidadePaga ? 'Pagamento confirmado' : 'Pagamento pendente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Informações do Curso e Valores */}
                <div className="space-y-6">
                  {/* Informações do Curso */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      Informações do Curso
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Curso
                        </label>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900 dark:text-white font-medium">
                            {estudante.cursoHorario.curso.nome}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Período
                          </label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">
                              {estudante.cursoHorario.horario.periodo}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Horário
                          </label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">
                              {estudante.cursoHorario.horario.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valores e Pagamentos */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Valores e Pagamentos
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Taxa de Inscrição
                          </label>
                          <div className="flex items-center justify-between">
                            <DollarSign className="w-8 h-8 text-green-500" />
                            <div className="text-right">
                              <p className="text-xl font-bold text-brand-lime dark:text-white">
                                {Number(estudante.cursoHorario.inscricao).toLocaleString("pt-MZ")} MT
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Mensalidade
                          </label>
                          <div className="flex items-center justify-between">
                            <CreditCard className="w-8 h-8 text-blue-500" />
                            <div className="text-right">
                              <p className="text-xl font-bold text-brand-lime dark:text-white">
                                {Number(estudante.cursoHorario.mensalidade).toLocaleString("pt-MZ")} MT
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Resumo Financeiro
                        </label>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Taxa de Inscrição:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {Number(estudante.cursoHorario.inscricao).toLocaleString("pt-MZ")} MT
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Mensalidade (12 meses):</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {(Number(estudante.cursoHorario.mensalidade) * 12).toLocaleString("pt-MZ")} MT
                            </span>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span className="text-gray-900 dark:text-white">Total estimado:</span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {(Number(estudante.cursoHorario.inscricao) + (Number(estudante.cursoHorario.mensalidade) * 12)).toLocaleString("pt-MZ")} MT
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Última atualização: {format(new Date(), "dd/MM/yyyy HH:mm")}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => onExport?.(estudante)}
                  className="px-4 py-2 bg-brand-lime text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Exportar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}