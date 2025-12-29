// app/cursos/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  BookOpen,
  GraduationCap,
  CreditCard,
  DollarSign,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Shield,
  Globe,
  Home,
  BookMarked,
  Zap,
  ChevronRight,
  Target,
  BarChart3,
  UserCheck,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { getCursoById } from "../../../lib/cursos-actions";
import { getHorarioPrice, type CursoHorario } from "../../../lib/get-horario-price";
import PaymentModal from "../../../components/cursos/Payments/PaymentModal";

export default function CursoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cursoId = params.id as string;

  const [curso, setCurso] = useState<any>(null);
  const [horarios, setHorarios] = useState<CursoHorario[]>([]);
  const [loading, setLoading] = useState(true);
  const [horariosLoading, setHorariosLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<CursoHorario | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    type: "inscricao" | "mensalidade" | "curso";
    valor: number;
    itemId: string; // ID do cursoHorario para o pagamento
    cursoId: string; // ID do curso
    horarioId: string; // ID do horário
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
      const data = await getHorarioPrice();

      // Filtrar horários para este curso específico
      const horariosDoCurso = data.filter(horario =>
        horario.cursoId === cursoId || horario.curso?.id === cursoId
      );

      setHorarios(horariosDoCurso);

      // Selecionar o primeiro horário por padrão
      if (horariosDoCurso.length > 0) {
        setSelectedHorario(horariosDoCurso[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    } finally {
      setHorariosLoading(false);
    }
  }

  function checkAuth() {
    const token = getCookie("auth_token");
    setIsAuthenticated(!!token);
  }

  // Função para abrir modal de pagamento
  const handleOpenPaymentModal = (type: "inscricao" | "mensalidade" | "curso") => {
    if (!selectedHorario) {
      alert("Por favor, selecione um horário antes de prosseguir.");
      return;
    }

    let valor = 0;
    switch (type) {
      case "inscricao":
        valor = parseFloat(selectedHorario.inscricao) || 0;
        break;
      case "mensalidade":
        valor = parseFloat(selectedHorario.mensalidade) || 0;
        break;
      case "curso":
        valor = (parseFloat(selectedHorario.inscricao) || 0) + (parseFloat(selectedHorario.mensalidade) || 0);
        break;
    }

    setPaymentModal({
      open: true,
      type,
      valor,
      itemId: selectedHorario.id, // cursoHorarioId
      cursoId: selectedHorario.cursoId || cursoId, // ID do curso
      horarioId: selectedHorario.horarioId, // ID do horário
    });
  };

  // Calcular preços com base no horário selecionado
  const getPrecoInscricao = () => {
    if (!selectedHorario) return 0;
    return parseFloat(selectedHorario.inscricao) || 0;
  };

  const getPrecoMensalidade = () => {
    if (!selectedHorario) return 0;
    return parseFloat(selectedHorario.mensalidade) || 0;
  };

  const getPrecoCurso = () => {
    return getPrecoInscricao() + getPrecoMensalidade();
  };

  // Animações
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Função para obter ícone do período
  const getPeriodIcon = (periodo: string) => {
    if (!periodo) return <Clock className="w-4 h-4 text-gray-500" />;

    const periodoLower = periodo.toLowerCase();
    if (periodoLower.includes('manhã') || periodoLower.includes('manha')) {
      return <Sun className="w-4 h-4 text-yellow-500" />;
    }
    if (periodoLower.includes('tarde')) {
      return <Sun className="w-4 h-4 text-orange-500" />;
    }
    if (periodoLower.includes('noite') || periodoLower.includes('laboral') || periodoLower.includes('noturno')) {
      return <Moon className="w-4 h-4 text-indigo-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  // Função para formatar hora
  const formatHora = (hora: string) => {
    if (!hora) return '--:--';
    return hora;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Carregando informações do curso...</p>
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
      {/* Header Fixo */}
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
              <div className="flex items-start justify-between">
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
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 ${curso.inscricoesAbertas
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      {curso.inscricoesAbertas ? "Inscrições Abertas" : "Inscrições Encerradas"}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {curso.titulo}
                  </h1>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {curso.descricao}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cards de Informações */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-brand-main/30 dark:hover:border-brand-lime/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-main/10 to-brand-lime/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-main dark:text-brand-lime" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Objetivos</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">O que você vai aprender</p>
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">Mercado</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Oportunidades</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Alta demanda no mercado com oportunidades em diversas áreas.
                </p>
              </div>
            </motion.div>

            {/* Detalhes do Curso */}
            <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
                      {/* {new Date(curso.dataInicio).toLocaleDateString("pt-MZ")} */}
                      Em breve
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Modalidade</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {curso.modalidade || "Online"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Seleção de Horários */}
            <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
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
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhum horário disponível para este curso.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {horarios.map((horario) => (
                        <button
                          key={horario.id}
                          onClick={() => setSelectedHorario(horario)}
                          className={`p-4 rounded-xl border transition-all duration-200 text-left ${selectedHorario?.id === horario.id
                              ? "border-brand-main dark:border-brand-lime bg-brand-main/5 dark:bg-brand-main/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getPeriodIcon(horario.horario?.periodo)}
                              <span className={`font-medium ${selectedHorario?.id === horario.id
                                  ? "text-brand-main dark:text-brand-lime"
                                  : "text-gray-900 dark:text-white"
                                }`}>
                                {horario.horario?.periodo || 'Período'}
                              </span>
                            </div>
                            {selectedHorario?.id === horario.id && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Horário:</span> {formatHora(horario.horario?.hora)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Inscrição:</span>{" "}
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {parseFloat(horario.inscricao || "0").toLocaleString('pt-MZ')} MT
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Mensalidade:</span>{" "}
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {parseFloat(horario.mensalidade || "0").toLocaleString('pt-MZ')} MT
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedHorario && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Horário selecionado:</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedHorario.horario?.periodo} • {formatHora(selectedHorario.horario?.hora)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valores:</p>
                            <p className="font-bold text-lg text-brand-main dark:text-brand-lime">
                              Inscrição: {parseFloat(selectedHorario.inscricao || "0").toLocaleString('pt-MZ')} MT
                            </p>
                            <p className="font-bold text-lg text-brand-lime dark:text-brand-main">
                              Mensal: {parseFloat(selectedHorario.mensalidade || "0").toLocaleString('pt-MZ')} MT
                            </p>
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
              {/* Card com horário selecionado */}
              {selectedHorario && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Horário Selecionado
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {selectedHorario.horario?.periodo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Período:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedHorario.horario?.periodo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Horário:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatHora(selectedHorario.horario?.hora)}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Card de Inscrição */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pagar Inscrição
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Taxa única de inscrição
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedHorario
                        ? parseFloat(selectedHorario.inscricao || "0").toLocaleString("pt-MZ")
                        : "0"}
                      <span className="text-base text-gray-500 dark:text-gray-400"> MT</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedHorario
                        ? `Inscrição para ${selectedHorario.horario?.periodo}`
                        : "Selecione um horário"}
                    </p>
                  </div>

                  {isAuthenticated && curso.inscricoesAbertas ? (
                    <button
                      onClick={() => handleOpenPaymentModal("inscricao")}
                      disabled={!selectedHorario}
                      className={`w-full py-3 font-medium rounded-lg transition-colors ${selectedHorario
                          ? "bg-brand-main hover:bg-brand-main/90 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {selectedHorario ? "Garanta sua Vaga" : "Selecione um horário"}
                    </button>
                  ) : (
                    <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {!isAuthenticated ? "Faça login para pagar" : "Inscrições encerradas"}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Card de Mensalidade */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Pagar Mensalidade
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mensalidade do curso
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedHorario
                        ? parseFloat(selectedHorario.mensalidade || "0").toLocaleString("pt-MZ")
                        : "0"}
                      <span className="text-base text-gray-500 dark:text-gray-400"> MT</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedHorario
                        ? `Mensalidade para ${selectedHorario.horario?.periodo}`
                        : "Selecione um horário"}
                    </p>
                  </div>

                  {isAuthenticated && curso.inscricoesAbertas ? (
                    <button
                      onClick={() => handleOpenPaymentModal("mensalidade")}
                      disabled={!selectedHorario}
                      className={`w-full py-3 font-medium rounded-lg transition-colors ${selectedHorario
                          ? "bg-brand-lime hover:bg-brand-lime/90 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {selectedHorario ? "Pagar Mensalidade" : "Selecione um horário"}
                    </button>
                  ) : (
                    <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {!isAuthenticated ? "Faça login para pagar" : "Inscrições encerradas"}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Card Curso - Destaque */}
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
                        Pagamento Total
                      </h3>
                      {/* <p className="text-xs text-brand-main dark:text-brand-lime font-medium">
                        Economia garantida
                      </p> */}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedHorario
                          ? getPrecoCurso().toLocaleString("pt-MZ")
                          : "0"}
                        <span className="text-base text-gray-500 dark:text-gray-400"> MT</span>
                      </div>
                      {/* {selectedHorario && (
                        <div className="text-sm text-gray-500 line-through">
                          {(getPrecoInscricao() + getPrecoMensalidade() + 200).toLocaleString("pt-MZ")} MT
                        </div>
                      )} */}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedHorario
                        ? `Inscrição + 1ª Mensalidade (${selectedHorario.horario?.periodo})`
                        : "Inscrição + 1ª Mensalidade"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {isAuthenticated && curso.inscricoesAbertas ? (
                      <>
                        <button
                          onClick={() => handleOpenPaymentModal("curso")}
                          disabled={!selectedHorario}
                          className={`w-full py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${selectedHorario
                              ? "bg-gradient-to-r from-brand-main to-brand-lime text-white hover:opacity-90"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <Zap className="w-4 h-4" />
                          {selectedHorario ? "Pagar Tudo Agora" : "Selecione um horário"}
                        </button>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Shield className="w-3 h-3" />
                          <span>Pagamento 100% seguro</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {!isAuthenticated ? "Faça login para pagar" : "Inscrições encerradas"}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Benefícios */}
              {/* <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-main" />
                  O que você recebe
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Acesso completo ao curso
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Material didático incluso
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Certificado reconhecido
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Suporte durante o curso
                    </span>
                  </div>
                </div>
              </motion.div> */}

              {/* Aviso de Login */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        Faça login para continuar
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Entre com sua conta para realizar a inscrição.
                      </p>
                      <button
                        onClick={() => router.push("/login")}
                        className="text-xs px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors"
                      >
                        Entrar na conta
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
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
          itemNome={paymentModal.type === "curso" ? "inscricao" : paymentModal.type}
          valor={paymentModal.valor}
        />
      )}
    </div>
  );
}