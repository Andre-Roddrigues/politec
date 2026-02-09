// app/cursos/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Globe,
  MapPin,
  Home,
  Target,
  BarChart3,
  GraduationCap,
  FileText,
  CreditCard,
  DollarSign,
  Zap,
  Shield,
  Calendar,
  Clock,
  Users,
  Tag,
  Gift,
  Percent,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { getCursoById } from "../../../lib/cursos-actions";
import { getHorarios, type Horario } from "../../../lib/get-horario-price";
import {
  getItensFinanceirosPorTipo,
  calcularValorComIVA,
} from "../../../lib/inscricao-actions";
import PaymentModal from "../../../components/cursos/Payments/PaymentModal";

// Componentes

// Utils
import {
  calcularValorComDescontoAPICorrigido,
  isGratuito,
  formatarPorcentagemAPI,
} from "../../../utils/price-calculations";
import { getPeriodIcon, formatHora } from "../../../utils/ui-helpers";
import HorarioCard from "../../../components/cursos/HorarioCard";
import PaymentCard from "../../../components/cursos/PaymentCard";

// Animações
const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CursoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cursoId = params.id as string;

  const [curso, setCurso] = useState<any>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [horariosLoading, setHorariosLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

  // Estados para preços
  const [precoInscricao, setPrecoInscricao] = useState<number>(0);
  const [precoMatricula, setPrecoMatricula] = useState<number>(0);
  const [ivaPercentual, setIvaPercentual] = useState<number>(0.05);
  const [descontoInscricao, setDescontoInscricao] = useState<number>(0);
  const [descontoMatricula, setDescontoMatricula] = useState<number>(0);
  const [inscricaoGratuita, setInscricaoGratuita] = useState<boolean>(false);
  const [matriculaGratuita, setMatriculaGratuita] = useState<boolean>(false);
  const [precosLoading, setPrecosLoading] = useState(true);

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    type: "inscricao" | "matricula" | "mensalidade" | "curso";
    valor: number;
    itemId: string;
    cursoId: string;
    horarioId: string;
    valorBase?: number;
    descontoPercentual?: number;
    ivaPercentual?: number;
    gratuito?: boolean;
  }>({
    open: false,
    type: "inscricao",
    valor: 0,
    itemId: "",
    cursoId: "",
    horarioId: "",
  });

  useEffect(() => {
    checkAuth();
    loadCurso();
    loadHorarios();
    loadPrecosComDescontos();
  }, [cursoId]);

  async function loadCurso() {
    try {
      const data = await getCursoById(cursoId);
      setCurso(data);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHorarios() {
    try {
      setHorariosLoading(true);
      const data = await getHorarios();
      setHorarios(data);

      if (data.length > 0) {
        setSelectedHorario(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    } finally {
      setHorariosLoading(false);
    }
  }

  async function loadPrecosComDescontos() {
    try {
      setPrecosLoading(true);

      const [itensInscricao, itensMatricula] = await Promise.all([
        getItensFinanceirosPorTipo("inscricao"),
        getItensFinanceirosPorTipo("matricula"),
      ]);

      // Inscrição
      if (itensInscricao.length > 0) {
        const inscricaoRecente = itensInscricao.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        setPrecoInscricao(inscricaoRecente.valor);
        setDescontoInscricao(inscricaoRecente.descontPercentual);
        setInscricaoGratuita(isGratuito(inscricaoRecente.descontPercentual));

        if (inscricaoRecente.iva) {
          setIvaPercentual(inscricaoRecente.iva);
        }
      }

      // Matrícula
      if (itensMatricula.length > 0) {
        const matriculaRecente = itensMatricula.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        setPrecoMatricula(matriculaRecente.valor);
        setDescontoMatricula(matriculaRecente.descontPercentual);
        setMatriculaGratuita(isGratuito(matriculaRecente.descontPercentual));

        if (matriculaRecente.iva && matriculaRecente.iva !== ivaPercentual) {
          setIvaPercentual(matriculaRecente.iva);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar preços com descontos:", error);
      setPrecoInscricao(1400);
      setPrecoMatricula(500);
    } finally {
      setPrecosLoading(false);
    }
  }

  function checkAuth() {
    const token = getCookie("auth_token");
    setIsAuthenticated(!!token);
  }

  const handleOpenPaymentModal = (
    type: "inscricao" | "matricula" | "mensalidade" | "curso"
  ) => {
    if (!selectedHorario) {
      alert("Por favor, selecione um horário antes de prosseguir.");
      return;
    }

    let valorBase = 0;
    let descontoPercentual = 0;
    let valorComDesconto = 0;
    let valorFinal = 0;
    let gratuito = false;

    switch (type) {
      case "inscricao":
        valorBase = precoInscricao;
        descontoPercentual = descontoInscricao;
        if (isGratuito(descontoPercentual)) {
          gratuito = true;
          valorFinal = 0;
        } else {
          valorComDesconto = calcularValorComDescontoAPICorrigido(
            valorBase,
            descontoPercentual
          );
          valorFinal = calcularValorComIVA(valorComDesconto, ivaPercentual);
        }
        break;

      case "matricula":
        valorBase = precoMatricula;
        descontoPercentual = descontoMatricula;
        if (isGratuito(descontoPercentual)) {
          gratuito = true;
          valorFinal = 0;
        } else {
          valorComDesconto = calcularValorComDescontoAPICorrigido(
            valorBase,
            descontoPercentual
          );
          valorFinal = calcularValorComIVA(valorComDesconto, ivaPercentual);
        }
        break;

      case "mensalidade":
        valorBase = curso?.preco || 0;
        valorFinal = calcularValorComIVA(valorBase, ivaPercentual);
        break;

      case "curso":
        const inscricaoComDesconto = isGratuito(descontoInscricao)
          ? 0
          : calcularValorComDescontoAPICorrigido(
              precoInscricao,
              descontoInscricao
            );
        const matriculaComDesconto = isGratuito(descontoMatricula)
          ? 0
          : calcularValorComDescontoAPICorrigido(
              precoMatricula,
              descontoMatricula
            );
        const valorCursoComIVA = calcularValorComIVA(curso?.preco || 0, ivaPercentual);

        valorBase = precoInscricao + precoMatricula + (curso?.preco || 0);
        valorFinal =
          calcularValorComIVA(inscricaoComDesconto, ivaPercentual) +
          calcularValorComIVA(matriculaComDesconto, ivaPercentual) +
          valorCursoComIVA;
        gratuito = isGratuito(descontoInscricao) && isGratuito(descontoMatricula);
        break;
    }

    setPaymentModal({
      open: true,
      type,
      valor: valorFinal,
      valorBase,
      descontoPercentual,
      ivaPercentual,
      gratuito,
      itemId: selectedHorario.id,
      cursoId: cursoId,
      horarioId: selectedHorario.id,
    });
  };

  // Funções auxiliares para exibição
  const getPrecoFormatado = (valor: number) => {
    const valorComIVA = calcularValorComIVA(valor, ivaPercentual);
    return valorComIVA.toLocaleString("pt-MZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Carregando informações do curso...
        </p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Curso não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Este curso não está disponível no momento.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-main hover:bg-brand-main/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-main dark:hover:text-brand-lime transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Detalhes do curso
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Conteúdo do Curso */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-8 space-y-8"
          >
            {/* Header do Curso */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {curso.nivel || "Nível"}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full flex items-center gap-1.5">
                    {curso.modalidade === "Online" ? (
                      <Globe className="w-3.5 h-3.5" />
                    ) : curso.modalidade === "Presencial" ? (
                      <MapPin className="w-3.5 h-3.5" />
                    ) : (
                      <Home className="w-3.5 h-3.5" />
                    )}
                    {curso.modalidade}
                  </span>
                  <span className="px-3 py-1.5 bg-brand-main/10 text-brand-main dark:text-brand-lime text-xs font-medium rounded-full flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {curso.preco?.toLocaleString("pt-MZ") || "0"} MT
                  </span>
                  {(inscricaoGratuita ||
                    matriculaGratuita ||
                    descontoInscricao > 0 ||
                    descontoMatricula > 0) && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Descontos Disponíveis
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {curso.titulo}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {curso.descricao}
                </p>
              </div>
            </motion.div>

            {/* Cards de Informações */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-main/10 to-brand-lime/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-main dark:text-brand-lime" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Objetivos
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      O que você vai aprender
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Formação completa com foco em mercado e prática profissional.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Mercado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Oportunidades
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Alta demanda no mercado com oportunidades em diversas áreas.
                </p>
              </div>
            </motion.div>

            {/* Detalhes do Curso */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-main" />
                  Detalhes do Curso
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Duração</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {curso.duracao}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Nível</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {curso.nivel || "Médio"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Início</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Em breve
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Mensalidade</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getPrecoFormatado(curso.preco || 0)} MT
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    * Valores incluem IVA de {ivaPercentual * 100}%
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {(inscricaoGratuita || descontoInscricao > 0) && (
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          inscricaoGratuita
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30"
                            : "bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap
                            className={`w-4 h-4 ${
                              inscricaoGratuita
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Inscrição:
                          </span>
                          {inscricaoGratuita ? (
                            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                              GRATUITA
                            </span>
                          ) : (
                            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                              -{formatarPorcentagemAPI(descontoInscricao)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {(matriculaGratuita || descontoMatricula > 0) && (
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          matriculaGratuita
                            ? "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800/30"
                            : "bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText
                            className={`w-4 h-4 ${
                              matriculaGratuita
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Matrícula:
                          </span>
                          {matriculaGratuita ? (
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                              GRATUITA
                            </span>
                          ) : (
                            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                              -{formatarPorcentagemAPI(descontoMatricula)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </motion.div>

            {/* Seleção de Horários */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-main" />
                    Selecione o Horário
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {horarios.length} opções disponíveis
                  </span>
                </div>

                {horariosLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-brand-main animate-spin" />
                  </div>
                ) : horarios.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhum horário disponível para este curso.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {horarios.map((horario) => (
                        <HorarioCard
                          key={horario.id}
                          horario={horario}
                          isSelected={selectedHorario?.id === horario.id}
                          onClick={() => setSelectedHorario(horario)}
                          // precoInscricao={precoInscricao}
                          // descontoInscricao={descontoInscricao}
                          // precoMatricula={precoMatricula}
                          // descontoMatricula={descontoMatricula}
                          // precoMensalidade={curso?.preco || 0}
                          // ivaPercentual={ivaPercentual}
                        />
                      ))}
                    </div>

                    {selectedHorario && !precosLoading && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Horário selecionado:
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedHorario.periodo} •{" "}
                              {formatHora(selectedHorario.hora)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Resumo dos valores:
                            </p>
                            <div className="space-y-1">
                              <p className="font-semibold text-brand-main dark:text-brand-lime">
                                Inscrição:{" "}
                                {inscricaoGratuita
                                  ? "GRATUITA"
                                  : `${getPrecoFormatado(
                                      calcularValorComDescontoAPICorrigido(
                                        precoInscricao,
                                        descontoInscricao
                                      )
                                    )} MT`}
                              </p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">
                                Matrícula:{" "}
                                {matriculaGratuita
                                  ? "GRATUITA"
                                  : `${getPrecoFormatado(
                                      calcularValorComDescontoAPICorrigido(
                                        precoMatricula,
                                        descontoMatricula
                                      )
                                    )} MT`}
                              </p>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                Mensal: {getPrecoFormatado(curso?.preco || 0)} MT
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar de Pagamentos */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Card de Inscrição */}
              <PaymentCard
                titulo="Inscrição"
                subtitulo={
                  inscricaoGratuita
                    ? "Aproveite esta promoção!"
                    : "Taxa única de inscrição"
                }
                icone={GraduationCap}
                iconeBg={
                  inscricaoGratuita
                    ? "linear-gradient(135deg, #10b98110 0%, #05966910 100%)"
                    : "linear-gradient(135deg, #3b82f610 0%, #1d4ed810 100%)"
                }
                iconeColor={inscricaoGratuita ? "#10b981" : "#3b82f6"}
                valorBase={precoInscricao}
                descontPercentual={descontoInscricao}
                ivaPercentual={ivaPercentual}
                tipo="inscricao"
                estaAutenticado={isAuthenticated}
                inscricoesAbertas={curso.inscricoesAbertas}
                selectedHorario={!!selectedHorario}
                loading={precosLoading}
                onClick={() => handleOpenPaymentModal("inscricao")}
              />

              {/* Card de Matrícula */}
              <PaymentCard
                titulo="Matrícula"
                subtitulo={
                  matriculaGratuita
                    ? "Não pague matrícula!"
                    : "Taxa de matrícula obrigatória"
                }
                icone={FileText}
                iconeBg={
                  matriculaGratuita
                    ? "linear-gradient(135deg, #10b98110 0%, #05966910 100%)"
                    : "linear-gradient(135deg, #8b5cf610 0%, #7c3aed10 100%)"
                }
                iconeColor={matriculaGratuita ? "#10b981" : "#8b5cf6"}
                valorBase={precoMatricula}
                descontPercentual={descontoMatricula}
                ivaPercentual={ivaPercentual}
                tipo="matricula"
                estaAutenticado={isAuthenticated}
                inscricoesAbertas={curso.inscricoesAbertas}
                selectedHorario={!!selectedHorario}
                loading={precosLoading}
                onClick={() => handleOpenPaymentModal("matricula")}
              />

              {/* Card de Mensalidade */}
              <PaymentCard
                titulo="Mensalidade"
                subtitulo="Mensalidade do curso"
                icone={CreditCard}
                iconeBg="linear-gradient(135deg, #10b98110 0%, #05966910 100%)"
                iconeColor="#10b981"
                valorBase={curso?.preco || 0}
                descontPercentual={0}
                ivaPercentual={ivaPercentual}
                tipo="mensalidade"
                estaAutenticado={isAuthenticated}
                inscricoesAbertas={curso.inscricoesAbertas}
                selectedHorario={!!selectedHorario}
                loading={loading}
                onClick={() => handleOpenPaymentModal("mensalidade")}
              />

              {/* Card de Pagamento Completo */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-brand-main/5 via-brand-main/10 to-brand-lime/5 dark:from-brand-main/10 dark:via-brand-main/5 dark:to-brand-lime/10 rounded-2xl overflow-hidden border border-brand-main/20 dark:border-brand-lime/20 relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-main/10 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pagamento Completo
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Inscrição + Matrícula + 1ª Mensalidade
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    {precosLoading || loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-6 h-6 border-2 border-brand-main border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {inscricaoGratuita && matriculaGratuita
                            ? `${getPrecoFormatado(curso?.preco || 0)} MT`
                            : `${getPrecoFormatado(
                                calcularValorComDescontoAPICorrigido(
                                  precoInscricao,
                                  descontoInscricao
                                ) +
                                  calcularValorComDescontoAPICorrigido(
                                    precoMatricula,
                                    descontoMatricula
                                  ) +
                                  (curso?.preco || 0)
                              )} MT`}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isAuthenticated && curso.inscricoesAbertas ? (
                      <>
                        <button
                          onClick={() => handleOpenPaymentModal("curso")}
                          disabled={!selectedHorario || precosLoading || loading}
                          className={`w-full py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                            selectedHorario && !precosLoading && !loading
                              ? "bg-gradient-to-r from-brand-main to-brand-lime text-white hover:opacity-90"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                          {selectedHorario
                            ? "Pagar Tudo Agora"
                            : "Selecione um horário"}
                        </button>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Shield className="w-3 h-3" />
                          <span>Pagamento 100% seguro</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {!isAuthenticated
                          ? "Faça login para pagar"
                          : "Inscrições encerradas"}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {selectedHorario && (
        <PaymentModal
          isOpen={paymentModal.open}
          onClose={() => setPaymentModal({ ...paymentModal, open: false })}
          itemId={paymentModal.itemId}
          cursoId={paymentModal.cursoId}
          horarioId={paymentModal.horarioId}
          itemNome={paymentModal.type}
          valor={paymentModal.valor}
          valorBase={paymentModal.valorBase}
          descontoPercentual={paymentModal.descontoPercentual}
          ivaPercentual={paymentModal.ivaPercentual}
          gratuito={paymentModal.gratuito}
        />
      )}
    </div>
  );
}