"use client";
import ModalSegurancaTeste from "./ModalSegurancaTeste";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  Loader,
  Search,
  CheckCircle,
  Clock,
  CircleAlert,
  XCircle,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  Info,
  FileText,
  BookOpen,
  CreditCard,
} from "lucide-react";
import ProgramaTeste from "./ProgramaTeste";
import { getCandidaturas } from "../../../lib/candidaturas-get";
import {
  CandidaturaTeste,
  getTestesByCandidatura,
  Pagamento,
  Teste,
} from "../../../lib/testes-actions";
import ModalPagamento from "./ModalPagamento";
import { efectuarPagamento } from "../../../lib/pagamento-actions";
import { deleteCandidatura } from "../../../lib/candidaturas-get";
import { addTesteDiagnostico } from "../../../lib/add-teste-actions";
import ListaCertificados, { Certificado } from "./certificado";
import { listarPagamentos } from "../../../lib/listar-pagamentos-actions";

const MainCandidatura = () => {
  const [candidaturas, setCandidaturas] = useState<CandidaturaTeste[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalValor, setModalValor] = useState(0);
  const [itemIdSelecionado, setItemIdSelecionado] = useState<string | null>(
    null
  );
  const [itemNomeSelecionado, setItemNomeSelecionado] = useState<
    "curso" | "teste" | null
  >(null);
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [modalSegurancaOpen, setModalSegurancaOpen] = useState(false);
  const [testeSelecionado, setTesteSelecionado] = useState<{ cursoId: string, cursoNome: string } | null>(null);

  // Adicione estas funções para gerenciar o modal de segurança:
  const abrirModalSeguranca = (cursoId: string, cursoNome: string) => {
    setTesteSelecionado({ cursoId, cursoNome });
    setModalSegurancaOpen(true);
  };

  const fecharModalSeguranca = () => {
    setModalSegurancaOpen(false);
    setTesteSelecionado(null);
  };

  const confirmarInicioTeste = () => {
    if (testeSelecionado) {
      setModalSegurancaOpen(false);
      // Redireciona para a página do teste
      window.location.href = `/user/teste/${testeSelecionado.cursoId}`;
    }
  };
  // Modal de pagamento
  const abrirModal = (id: string, tipo: "curso" | "teste", valor: number) => {
    setItemIdSelecionado(id);
    setItemNomeSelecionado(tipo);
    setModalTitulo(tipo === "curso" ? "Curso" : "Teste");
    setModalValor(valor);
    setModalOpen(true);
  };

  // Confirmar pagamento
  const handleConfirmPagamento = async (dados: {
    metodo: string;
    numero?: string;
    comprovativo?: File;
  }) => {
    if (!itemIdSelecionado || !itemNomeSelecionado) {
      toast.error("Dados do item não encontrados!");
      return;
    }

    try {
      const loadingToast = toast.loading("Processando pagamento...");
      const result = await efectuarPagamento({
        metodoPagamento: dados.metodo,
        itemId: itemIdSelecionado,
        itemNome: itemNomeSelecionado,
        comprovativo: dados.comprovativo,
        phoneNumber: dados.numero,
      });

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Pagamento realizado com sucesso!");
        setModalOpen(false);
        fetchCandidaturas();
      } else {
        toast.error(result.error || "Erro desconhecido no pagamento.");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Erro inesperado ao processar pagamento.");
    }
  };

  // Nova tentativa de teste
  const handleNovaTentativa = async (candidaturaId: string) => {
    try {
      const resp = await addTesteDiagnostico({ candidaturaId });
      if (resp.success) {
        toast.success("Novo teste gerado com sucesso!");
        fetchCandidaturas();
      } else {
        toast.error(resp.error || "Erro ao gerar novo teste");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado");
    }
  };

  // Deletar candidatura (só permite se não tiver teste aprovado)
  const handleDeletarCandidatura = (id: string, temTesteAprovado: boolean) => {
    if (temTesteAprovado) {
      toast.error("Não é possível trocar uma formação com teste aprovado.");
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Confirmar troca de candidatura
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tem certeza que deseja trocar esta candidatura? Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const resp = await deleteCandidatura(id);
                  if (resp.success) {
                    toast.success("Candidatura trocada com sucesso!");
                    fetchCandidaturas();
                  } else {
                    toast.error("Erro ao trocar candidatura");
                  }
                } catch (err: any) {
                  toast.error(err.message || "Erro ao trocar candidatura");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Sim, Trocar
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  // Buscar candidaturas + testes (Candidaturas concluídas)
  const fetchCandidaturas = async () => {
    setLoading(true);
    try {
      if (!Cookies.get("auth_token")) throw new Error("Usuário não autenticado");

      const data = await getCandidaturas();
      const pagamentosResp = await listarPagamentos();

      if (pagamentosResp.success && pagamentosResp.data) {
        setPagamentos(pagamentosResp.data);
      }

      const candidaturasConcluidas = data.filter(c => c.status === "concluido");

      let testesData: any[] = [];
      if (candidaturasConcluidas.length > 0) {
        testesData = await getTestesByCandidatura();
      }

      const candidaturasComExtras = await Promise.all(
        data.map(async (c) => {
          const testes = c.status === "concluido"
            ? testesData.find((t) => t.id === c.id)?.testesdiagnosticos || []
            : [];

          return {
            ...c,
            testesdiagnosticos: testes,
          };
        })
      );

      setCandidaturas(candidaturasComExtras);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar candidaturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidaturas();
  }, []);

  const candidaturasFiltradas = candidaturas.filter(
    (c) =>
      (filtroStatus === "todos" || c.status === filtroStatus) &&
      c.cursos.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const getStatusInfo = (status: string) => {
    const statusInfo = {
      emAvaliacao: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: "Em Avaliação",
        desc: "Sua candidatura está sendo analisada"
      },
      concluido: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        text: "Aprovado",
        desc: "Candidatura aprovada - Próximo passo: Teste"
      },
      rejeitado: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        text: "Reprovado",
        desc: "Candidatura não aprovada"
      },
      pendente: {
        icon: Clock,
        color: "text-blue-600",
        bg: "bg-blue-100",
        text: "Pendente",
        desc: "Aguardando processamento"
      },
    };
    return statusInfo[status as keyof typeof statusInfo] || statusInfo.emAvaliacao;
  };

  const podeAdicionarCandidatura = candidaturas.length < 2;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-brand-main mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando suas candidaturas...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen  dark:bg-gray-900 py-8">
      <Toaster position="top-right" />
      <ModalPagamento
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        titulo={modalTitulo}
        valor={modalValor}
        onConfirm={handleConfirmPagamento}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <BookOpen className="w-8 h-8 text-brand-main" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-brand-main dark:text-white">
                Minhas Candidaturas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Acompanhe o status das suas inscrições
              </p>
            </div>
          </div>

        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="Pesquisar por nome do curso..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-main focus:border-transparent dark:bg-gray-750 dark:text-white transition-all duration-200"
                aria-label="Pesquisar cursos"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-main focus:border-transparent dark:bg-gray-750 dark:text-white transition-all duration-200"
                aria-label="Filtrar por status"
              >
                <option value="todos">Todos os status</option>
                <option value="emAvaliacao">Em Avaliação</option>
                <option value="concluido">Aprovadas</option>
                <option value="rejeitado">Reprovadas</option>
              </select>
            </div>
          </div>
        </div>

        {candidaturas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Nenhuma candidatura encontrada
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Você ainda não se candidatou a nenhum curso. Explore nossa lista de cursos disponíveis e comece sua jornada educacional.
              </p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-brand-main text-white font-semibold py-4 px-8 rounded-xl hover:bg-brand-lime transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <GraduationCap className="w-5 h-5" />
                Explorar Cursos Disponíveis
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de Candidaturas */}
            <div className="grid gap-6">
              {candidaturasFiltradas.map((c) => {
                const { icon: Icon, color, bg, text, desc } = getStatusInfo(c.status);
                const testes: Teste[] = c.testesdiagnosticos || [];
                const temTesteAprovado = testes.some((t: Teste) => t.status === "aprovado");
                const temTesteReprovado = testes.some((t: Teste) => t.status === "reprovado");
                const totalTestes = testes.length;
                const podeFazerOutroTeste = totalTestes < 10; // Máximo 10 testes por candidatura
                const temCertificadoAprovado = certificados.some(
                  (cert) => cert.status === "aprovado"
                );
                const temCertificadoEmAvaliacao = certificados.some(
                  (cert) => cert.status === "em avaliacao"
                );
                const isEmAvaliacao = c.status === "emAvaliacao";
                const isRejeitado = c.status === "rejeitado";
                const isConcluido = c.status === "concluido";

                return (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Header da Candidatura */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${bg} transition-colors duration-200`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-brand-main dark:text-white mb-2">
                            {c.cursos.nome}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Inscrição: {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${bg} ${color} font-medium`}>
                              <Icon className="w-3 h-3" />
                              {text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificados */}
                    <div className="mb-6">
                      <ListaCertificados onLoad={setCertificados} />
                    </div>

                    {/* Conteúdo Baseado no Status */}
                    {isEmAvaliacao || isRejeitado ? (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                              {isEmAvaliacao ? "Candidatura em Análise" : "Candidatura Reprovada"}
                            </h4>
                            <p className="text-blue-800 dark:text-blue-400 leading-relaxed">
                              {isEmAvaliacao
                                ? "Sua candidatura está sendo cuidadosamente analisada pela nossa equipe. Você receberá atualizações por email em breve sobre o próximo passo do processo."
                                : "Infelizmente sua candidatura não foi aprovada. Você pode trocar esta candidatura por outro curso caso deseje tentar novamente."
                              }
                            </p>
                            {isRejeitado && (
                              <div className="flex justify-end mt-4">
                                <button
                                  onClick={() => handleDeletarCandidatura(c.id, temTesteAprovado)}
                                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
                                  disabled={temTesteAprovado}
                                >
                                  Trocar Formação
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Fluxo com Certificado Aprovado */}
                        {temCertificadoAprovado ? (
                          <div className="space-y-4">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                                    Isenção de Teste Concedida
                                  </h4>
                                  <p className="text-green-800 dark:text-green-400 leading-relaxed">
                                    Parabéns! Seu certificado UNITEC foi validado e você está isento do teste de diagnóstico.
                                    Você pode prosseguir diretamente para o pagamento do curso.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Pagamento do Curso */}
                            <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Valor do Curso</p>
                                    <p className="text-2xl font-bold text-brand-main">{c.cursos.preco} MT</p>
                                  </div>
                                </div>
                                {(() => {
                                  const pagamentoCursoAtivo = pagamentos.some(
                                    (p) => p.itemNome === "curso" && p.itemId === c.cursos.id &&
                                      (p.status === "processando" || p.status === "confirmado")
                                  );

                                  return pagamentoCursoAtivo ? (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                                      <Clock className="w-4 h-4" />
                                      <span className="font-medium">
                                        {pagamentos.find((p) => p.itemId === c.cursos.id)?.status === "confirmado"
                                          ? "Pagamento Confirmado"
                                          : "Pagamento em Processamento"}
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => abrirModal(c.cursos.id, "curso", c.cursos.preco)}
                                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                                    >
                                      Pagar Curso
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Fluxo sem Certificado Aprovado */
                          <div className="space-y-6">
                            {/* Avisos de Certificado */}
                            {temCertificadoEmAvaliacao && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-start gap-3">
                                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                                      Certificado em Verificação
                                    </h4>
                                    <p className="text-yellow-800 dark:text-yellow-400">
                                      Seu certificado está sendo analisado. Quando aprovado, você será isento do teste.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {!temCertificadoEmAvaliacao && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-blue-800 dark:text-blue-400">
                                      Se você já frequentou um curso na UNITEC, carregue seu certificado no{' '}
                                      <Link href="perfil" className="underline font-medium hover:text-blue-900 dark:hover:text-blue-200">
                                        seu perfil
                                      </Link>{' '}
                                      e seja isento do teste!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Testes (apenas para candidaturas concluídas) */}
                            {isConcluido && testes.length > 0 && (
                              <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-brand-main dark:text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-brand-lime" />
                                    Teste de Diagnóstico
                                  </h4>
                                </div>
                                <div className="mb-4">
                                  <ProgramaTeste cursoId={c.cursos.id} cursoNome={c.cursos.nome} />
                                </div>

                                <div className="space-y-3">
                                  {testes.map((t: Teste) => {
                                    const pagamentoTesteAtivo = pagamentos.some(
                                      (p) => p.itemNome === "teste" && p.itemId === t.id &&
                                        (p.status === "processando" || p.status === "confirmado")
                                    );
                                    const pagamentoConfirmado = pagamentos.some(
                                      (p) => p.itemNome === "teste" && p.itemId === t.id && p.status === "confirmado"
                                    );

                                    // 🔹 Calcular pontuação para testes aprovados/reprovados
                                    const mostrarPontuacao = t.status === "aprovado" || t.status === "reprovado";
                                    const pontuacao = t.status === "aprovado" ? "100%" : "0%"; // Exemplo de pontuação

                                    return (
                                      <div
                                        key={t.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                                              t.status === 'reprovado' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                              }`}>
                                              {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                            </span>
                                            {/* 🔹 MOSTRAR PONTUAÇÃO OU PREÇO */}
                                            {mostrarPontuacao ? (
                                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${Number(t.pontuacao) >= 80 ? 'bg-green-100 text-green-800' :
                                                  Number(t.pontuacao) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {t.pontuacao}%
                                              </span>
                                            ) : (
                                              <span className="text-sm text-gray-500">{t.preco} MT</span>
                                            )}
                                          </div>
                                          {pagamentoTesteAtivo && (
                                            <div className="flex items-center gap-2 text-sm">
                                              {pagamentos.find((p) => p.itemId === t.id)?.status === "confirmado"
                                                ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                : <Clock className="w-4 h-4 text-yellow-600" />
                                              }

                                              <span className="text-yellow-700 font-medium">
                                                {pagamentos.find((p) => p.itemId === t.id)?.status === "confirmado"
                                                  ? <span className="text-green-600">Pagamento Confirmado</span>
                                                  : "Pagamento em Processamento"}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          {pagamentoConfirmado ? (
                                            t.status === "aprovado" ? (
                                              // Teste Aprovado - Mostrar botão Pagar Curso
                                              <button
                                                onClick={() => abrirModal(c.cursos.id, "curso", c.cursos.preco)}
                                                className="hidden px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
                                              >
                                                Pagar Curso
                                              </button>
                                            ) : t.status === "reprovado" ? (
                                              // Teste Reprovado - Mostrar botão Fazer Outro Teste (se ainda puder)
                                              podeFazerOutroTeste ? (
                                                <button
                                                  onClick={() => handleNovaTentativa(c.id)}
                                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm flex items-center gap-2"
                                                >
                                                  <RefreshCw className="w-4 h-4" />
                                                  Fazer Outro Teste
                                                </button>
                                              ) : (
                                                <span className="px-4 py-2 bg-gray-400 text-white rounded-lg font-medium text-sm cursor-not-allowed">
                                                  Limite de tentativas
                                                </span>
                                              )
                                            ) : (
                                              // Teste Pendente - Mostrar botão Fazer Teste
                                              <>
                                                <ModalSegurancaTeste
                                                  isOpen={modalSegurancaOpen}
                                                  onClose={fecharModalSeguranca}
                                                  onConfirm={confirmarInicioTeste}
                                                  cursoNome={testeSelecionado?.cursoNome || ''}
                                                />

                                                <button
                                                  onClick={() => abrirModalSeguranca(c.cursos.id, c.cursos.nome)}
                                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                                                >
                                                  Fazer Teste
                                                </button>
                                              </>
                                            )
                                          ) : !pagamentoTesteAtivo ? (
                                            <button
                                              onClick={() => abrirModal(t.id, "teste", t.preco)}
                                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium text-sm"
                                            >
                                              Pagar Teste
                                            </button>
                                          ) : null}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Seção de Pagamento do Curso quando teste está aprovado */}
                            {temTesteAprovado && (
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <div>
                                      <h4 className="font-semibold text-green-900 dark:text-green-300">
                                        Teste Aprovado!
                                      </h4>
                                      <p className="text-green-800 dark:text-green-400 text-sm">
                                        Parabéns! Você pode prosseguir com o pagamento do curso.
                                      </p>
                                    </div>
                                  </div>
                                  {(() => {
                                    const pagamentoCursoAtivo = pagamentos.some(
                                      (p) => p.itemNome === "curso" && p.itemId === c.cursos.id &&
                                        (p.status === "processando" || p.status === "confirmado")
                                    );

                                    return pagamentoCursoAtivo ? (
                                      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">
                                          {pagamentos.find((p) => p.itemId === c.cursos.id)?.status === "confirmado"
                                            ? "Pagamento Confirmado"
                                            : "Pagamento em Processamento"}
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => abrirModal(c.cursos.id, "curso", c.cursos.preco)}
                                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                                      >
                                        Pagar Curso - {c.cursos.preco} MT
                                      </button>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}

                            {/* Seção para teste reprovado */}
                            {temTesteReprovado && !temTesteAprovado && podeFazerOutroTeste && (
                              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <div>
                                      <h4 className="font-semibold text-red-900 dark:text-red-300">
                                        Teste Reprovado
                                      </h4>
                                      <p className="text-red-800 dark:text-red-400 text-sm">
                                        Não desanime! Você pode tentar novamente com um novo teste.
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleNovaTentativa(c.id)}
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Fazer Outro Teste
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Aviso de limite de testes atingido */}
                            {temTesteReprovado && !temTesteAprovado && !podeFazerOutroTeste && (
                              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="w-5 h-5 text-amber-600" />
                                  <div>
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-300">
                                      Limite de Tentativas Atingido
                                    </h4>
                                    <p className="text-amber-800 dark:text-amber-400 text-sm">
                                      Você já utilizou todas as 10 tentativas disponíveis para o teste.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Botão Trocar Formação (apenas se não tiver teste aprovado) */}
                            {!temTesteAprovado && (
                              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                  onClick={() => handleDeletarCandidatura(c.id, temTesteAprovado)}
                                  className="px-6 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors duration-200"
                                >
                                  Trocar Formação
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
            <h3 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Informações Importantes
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• As vagas são limitadas</li>
              <li>• Início das aulas: : 11/11/2025</li>
              <li>• Formação : 30 Dias</li>
              <li>• Modalidade: Presencial</li>
              <li>• Local: Após a aprovação da candidatura</li>
              <li>• Horário: Segunda a Sexta, 08:35-11:35 - 16:00-19:00</li>
              <li>• Limite: Máximo 2 candidaturas por candidato</li>
            </ul>
          </div>
        {/* Botão Nova Candidatura */}
        {podeAdicionarCandidatura && (
          <div className="text-center mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Adicionar Nova Candidatura
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Você ainda pode candidatar-se a {2 - candidaturas.length} curso(s) adicional(es)
              </p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-brand-main text-white font-semibold py-4 px-8 rounded-xl hover:bg-brand-lime transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <GraduationCap className="w-5 h-5" />
                Nova Candidatura ({candidaturas.length}/2)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainCandidatura;