// components/Cursos/CursosUser.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  ClockIcon,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  CreditCard,
  ChevronRight,
  Users,
  BarChart,
  Target,
} from "lucide-react";
import Link from "next/link";
import { InscricaoCurso } from "../../../lib/get-user-cursos";

interface CursosUserProps {
  inscricoes: InscricaoCurso[];
  loading?: boolean;
}

export default function CursosUser({ inscricoes, loading = false }: CursosUserProps) {
  const [filter, setFilter] = useState<"all" | "pendente" | "aprovado" | "mensalidade-pendente">("all");

  // Filtrar inscrições
  const filteredInscricoes = inscricoes.filter((inscricao) => {
    if (filter === "all") return true;
    if (filter === "pendente") return inscricao.status === "pendente";
    if (filter === "aprovado") return inscricao.status === "aprovado";
    if (filter === "mensalidade-pendente") return !inscricao.mensalidadePaga;
    return true;
  });

  // Obter cor do status
  const getStatusColor = (status: string, mensalidadePaga: boolean) => {
    if (status === "aprovado") {
      return mensalidadePaga 
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (status === "pendente") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
    if (status === "rejeitado") {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  // Obter ícone do status
  const getStatusIcon = (status: string, mensalidadePaga: boolean) => {
    if (status === "aprovado") {
      return mensalidadePaga 
        ? <CheckCircle className="w-4 h-4" />
        : <CreditCard className="w-4 h-4" />;
    }
    if (status === "pendente") return <ClockIcon className="w-4 h-4" />;
    if (status === "rejeitado") return <XCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Obter texto do status
  const getStatusText = (status: string, mensalidadePaga: boolean) => {
    if (status === "aprovado") {
      return mensalidadePaga ? "Ativo" : "Aguardando Mensalidade";
    }
    if (status === "pendente") return "Aguardando Aprovação";
    if (status === "rejeitado") return "Rejeitado";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Calcular total de valores
  const calcularTotais = () => {
    const totalInscricoes = filteredInscricoes.length;
    const totalInvestido = filteredInscricoes.reduce((sum, inscricao) => {
      return sum + parseFloat(inscricao.cursoHorario.inscricao || "0");
    }, 0);
    const totalMensalidades = filteredInscricoes.reduce((sum, inscricao) => {
      return sum + parseFloat(inscricao.cursoHorario.mensalidade || "0");
    }, 0);

    return { totalInscricoes, totalInvestido, totalMensalidades };
  };

  const totais = calcularTotais();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-white animate-pulse" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Carregando seus cursos...</p>
      </div>
    );
  }

  if (inscricoes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum curso encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Você ainda não se inscreveu em nenhum curso. Explore nossa oferta formativa e comece sua jornada!
        </p>
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-main to-brand-lime text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <BookOpen className="w-5 h-5" />
          Explorar Cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros e estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Cursos</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie suas inscrições e acompanhe o progresso
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-brand-main text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Todos ({inscricoes.length})
            </button>
            <button
              onClick={() => setFilter("pendente")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "pendente"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pendentes ({inscricoes.filter(i => i.status === "pendente").length})
            </button>
            <button
              onClick={() => setFilter("aprovado")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "aprovado"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Aprovados ({inscricoes.filter(i => i.status === "aprovado").length})
            </button>
            <button
              onClick={() => setFilter("mensalidade-pendente")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "mensalidade-pendente"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pagar Mensalidade ({inscricoes.filter(i => !i.mensalidadePaga && i.status === "aprovado").length})
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total de Cursos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totais.totalInscricoes}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Inscrição</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totais.totalInvestido.toLocaleString("pt-MZ")} MT
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Mensalidade</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totais.totalMensalidades.toLocaleString("pt-MZ")} MT
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="space-y-4">
        {filteredInscricoes.map((inscricao, index) => (
          <motion.div
            key={inscricao.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Informações do Curso */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(inscricao.status, inscricao.mensalidadePaga)}`}>
                      {getStatusIcon(inscricao.status, inscricao.mensalidadePaga)}
                      {getStatusText(inscricao.status, inscricao.mensalidadePaga)}
                    </span>
                    
                    {inscricao.status === "aprovado" && !inscricao.mensalidadePaga && (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Mensalidade Pendente
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {inscricao.cursoHorario.curso.nome}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {inscricao.cursoHorario.curso.descricao}
                  </p>

                  {/* Detalhes do Curso */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Horário</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {inscricao.cursoHorario.horario.periodo}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {inscricao.cursoHorario.horario.hora}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Data de Inscrição</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(inscricao.createdAt).toLocaleDateString("pt-MZ")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(inscricao.createdAt).toLocaleTimeString("pt-MZ", { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Duração</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {inscricao.cursoHorario.curso.duracao}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Valores e Ações */}
                <div className="lg:w-72 space-y-4">
                  {/* Valores */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Inscrição:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {parseFloat(inscricao.cursoHorario.inscricao || "0").toLocaleString("pt-MZ")} MT
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mensalidade:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {parseFloat(inscricao.cursoHorario.mensalidade || "0").toLocaleString("pt-MZ")} MT
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
                      <span className="font-bold text-lg text-brand-main dark:text-brand-lime">
                        {(parseFloat(inscricao.cursoHorario.inscricao || "0") + parseFloat(inscricao.cursoHorario.mensalidade || "0")).toLocaleString("pt-MZ")} MT
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/cursos/${inscricao.cursoHorario.curso.id}`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Link>

                    {inscricao.status === "aprovado" && !inscricao.mensalidadePaga && (
                      <button className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-brand-main to-brand-lime text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                        <CreditCard className="w-4 h-4" />
                        Pagar Mensalidade
                      </button>
                    )}

                    {/* <button className="flex items-center justify-center gap-2 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors">
                      <Download className="w-4 h-4" />
                      Comprovativo
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com Progresso */}
            {/* <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progresso:</span>
                  </div>
                  <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-main to-brand-lime rounded-full"
                      style={{ 
                        width: inscricao.status === "aprovado" ? 
                          (inscricao.mensalidadePaga ? "100%" : "50%") : 
                          (inscricao.status === "pendente" ? "25%" : "0%") 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {inscricao.status === "aprovado" ? 
                      (inscricao.mensalidadePaga ? "100%" : "50%") : 
                      (inscricao.status === "pendente" ? "25%" : "0%")}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {inscricao.id.substring(0, 8)}...
                </div>
              </div>
            </div> */}
          </motion.div>
        ))}
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Resumo</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredInscricoes.length} de {inscricoes.length} cursos
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pago:</p>
            <p className="text-2xl font-bold text-brand-main dark:text-brand-lime">
              {inscricoes.reduce((sum, inscricao) => {
                return sum + parseFloat(inscricao.cursoHorario.inscricao || "0");
              }, 0).toLocaleString("pt-MZ")} MT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}