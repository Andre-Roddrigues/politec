"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  BookOpen,
  Target,
  BarChart3,
  Shield,
  Eye,
  EyeOff,
  Zap,
  Trophy,
  Star,
  ChevronRight,
  ChevronLeft,
  Flag,
  CheckSquare,
  AlertTriangle,
  Save,
} from "lucide-react";
import { getTesteByCursoAction } from "../../../../lib/getTesteByCursoAction";
import { finalizarTesteAction } from "../../../../lib/FinalizarTesteAction";

type Opcao = {
  id: string;
  questaoId: string;
  texto: string;
  correcta: boolean;
};

type Questao = {
  id: string;
  enunciado: string;
  opcoes: Opcao[];
};

type Teste = {
  id: string;
  idCurso: string;
  titulo: string;
  descricao: string;
  duracao: number;
  dataTeste: string;
  questoes: Questao[];
};

type RespostaUsuario = {
  questaoId: string;
  opcaoId: string;
};

export default function RealizarTeste() {
  const params = useParams();
  const router = useRouter();
  const idCurso = params.id as string;

  const [teste, setTeste] = useState<Teste | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [testeFinalizado, setTesteFinalizado] = useState(false);
  const [resultado, setResultado] = useState<{ acertos: number; total: number } | null>(null);
  const [mostrarResumo, setMostrarResumo] = useState(false);

  // Referências para controle de segurança
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const perdaFocoRef = useRef<number>(0);
  const tentativaSaidaRef = useRef<boolean>(false);
  const toastIdRef = useRef<string | null>(null);
  const redirecionamentoRef = useRef<boolean>(false);
  const tempoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIniciadoRef = useRef<boolean>(false);

  // 🔹 Função para limpar todos os timers
  const limparTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (tempoIntervalRef.current) {
      clearInterval(tempoIntervalRef.current);
      tempoIntervalRef.current = null;
    }
    timerIniciadoRef.current = false;
  };

  // 🔹 Buscar teste real da API
  useEffect(() => {
    if (!idCurso) return;

    const carregarTeste = async () => {
      setLoading(true);
      try {
        const dados = await getTesteByCursoAction(idCurso);
        if (!dados) {
          toast.error("Nenhum teste encontrado para este curso");
          return;
        }

        setTeste(dados);
        setQuestoes(dados.questoes || []);
        setTempoRestante((dados.duracao || 45) * 60);
        
        toast.success("Teste carregado! Mantenha o foco na janela.");
      } catch (error) {
        toast.error("Erro ao carregar o teste");
      } finally {
        setLoading(false);
      }
    };

    carregarTeste();

    return () => {
      limparTimers();
    };
  }, [idCurso]);

  // 🔹 Timer do teste CORRIGIDO - usando 1000ms (1 segundo) - AGORA SÓ INICIA UMA VEZ
  useEffect(() => {
  if (!teste || testeFinalizado) return;

  // Marca o início e calcula o final com base na duração em minutos
  const start = Date.now();
  const durationMs = teste.duracao * 60 * 1000; // duração total em ms
  const end = start + durationMs;

  // Atualiza o tempo restante de acordo com o relógio real
  const interval = setInterval(() => {
    const remainingSeconds = Math.max(0, Math.round((end - Date.now()) / 1000));
    setTempoRestante(remainingSeconds);

    // Finaliza automaticamente quando o tempo acaba
    if (remainingSeconds <= 0) {
      clearInterval(interval);
      handleFinalizarTeste();
    }
  }, 1000);

  return () => clearInterval(interval);
}, [teste, testeFinalizado]);
 // Adicionado tempoRestante como dependência

  // 🔹 Função para finalizar teste automaticamente por segurança
  const finalizarPorSeguranca = async () => {
    if (testeFinalizado || submitting) return;

    console.log("Finalizando teste por segurança - Perda de foco detectada");
    
    setSubmitting(true);
    
    try {
      const dadosEnvio = {
        testeId: teste?.id || "",
        respostas: respostas.map((r) => ({
          questaoId: r.questaoId,
          opcaoId: r.opcaoId,
        })),
      };

      const result = await finalizarTesteAction(dadosEnvio);

      if (result) {
        // Calcular resultado local
        const acertos = respostas.filter((resposta) => {
          const questao = questoes.find((q) => q.id === resposta.questaoId);
          const opcao = questao?.opcoes.find((o) => o.id === resposta.opcaoId);
          return opcao?.correcta;
        }).length;

        setResultado({ acertos, total: questoes.length });
        setTesteFinalizado(true);
        limparTimers(); // Para todos os timers
        
        toast.success(
          <div className="text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="font-bold">Teste Enviado Automaticamente</div>
            <div className="text-sm">Perda de foco detectada</div>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar por segurança:", error);
      toast.error("Erro ao enviar automaticamente");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Controle de perda de foco (REGRA 1 e 2)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !testeFinalizado && !submitting) {
        // REGRA 1: Saiu da aba - inicia contagem de 5s
        perdaFocoRef.current = Date.now();
        
        toastIdRef.current = toast.loading(
          <div className="text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="font-semibold">Volte para a janela!</div>
            <div className="text-sm">Teste será enviado em 5 segundos</div>
          </div>,
          { 
            duration: 5000,
            id: 'focus-warning'
          }
        );

        timerRef.current = setTimeout(() => {
          if (document.hidden && !testeFinalizado) {
            // REGRA 1: Passaram 5s - Finaliza automaticamente
            toast.dismiss('focus-warning');
            finalizarPorSeguranca();
          }
        }, 5000);
      } else {
        // REGRA 2: Voltou antes de 5s - Cancela a contagem
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
          }
          
          if (perdaFocoRef.current > 0) {
            const tempoFora = Date.now() - perdaFocoRef.current;
            if (tempoFora < 5000) {
              toast.success("Bem-vindo de volta!", { duration: 2000 });
            }
          }
        }
      }
    };

    // 🔹 Prevenção de saída/recarregamento (REGRA 3)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!testeFinalizado && !submitting && respostas.length > 0) {
        // REGRA 3: Exibe alerta do navegador
        e.preventDefault();
        e.returnValue = "O teste será enviado com suas respostas atuais. A aprovação depende disso.";
        
        // Toast informativo adicional
        if (!tentativaSaidaRef.current) {
          tentativaSaidaRef.current = true;
          toast.error(
            <div className="text-center">
              <Save className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="font-semibold">Atenção! 🚨</div>
              <div className="text-sm">Se sair, o teste será enviado automaticamente</div>
              <div className="text-xs mt-1">Respostas: {respostas.length}/{questoes.length}</div>
            </div>,
            { 
              duration: 3000,
              icon: '⚠️'
            }
          );
        } else {
          // Segunda tentativa de saída - envia automaticamente
          setTimeout(() => {
            finalizarPorSeguranca();
          }, 100);
        }
      }
    };

    // Só adiciona os event listeners se o teste não estiver finalizado
    if (!testeFinalizado) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!testeFinalizado) {
        limparTimers();
      }
    };
  }, [testeFinalizado, submitting, respostas.length, questoes.length]);

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const questao = questoes[questaoAtual];
  const respostaAtual = respostas.find((r) => r.questaoId === questao?.id);
  const opcaoSelecionada = respostaAtual?.opcaoId;

  const handleSelecionarOpcao = (opcaoId: string) => {
    if (testeFinalizado) return;

    setRespostas((prev) => {
      const outras = prev.filter((r) => r.questaoId !== questao.id);
      return [...outras, { questaoId: questao.id, opcaoId }];
    });
  };

  const handleProximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual((prev) => prev + 1);
    }
  };

  const handleQuestaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual((prev) => prev - 1);
    }
  };

  const irParaQuestao = (index: number) => {
    setQuestaoAtual(index);
    setMostrarResumo(false);
  };

  // 🔹 Finalizar teste manualmente
  const handleFinalizarTeste = async () => {
    const confirmar = window.confirm(
      `📊 Status do Teste:\n\n• Respondidas: ${respostas.length}/${questoes.length}\n• Não respondidas: ${questoes.length - respostas.length}\n\nDeseja finalizar o teste agora?${
        respostas.length < questoes.length ? 
        "\n\n⚠️ As questões não respondidas serão marcadas como erradas." : 
        ""
      }`
    );
    
    if (!confirmar) return;

    setSubmitting(true);
    limparTimers(); // Para o timer ao finalizar

    try {
      const dadosEnvio = {
        testeId: teste?.id || "",
        respostas: respostas.map((r) => ({
          questaoId: r.questaoId,
          opcaoId: r.opcaoId,
        })),
      };

      const result = await finalizarTesteAction(dadosEnvio);

      if (result) {
        toast.success(
          <div className="text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-bold text-lg">Teste Enviado! 📤</div>
            <div className="text-sm">
              {respostas.length < questoes.length ? 
                `Enviado com ${respostas.length} de ${questoes.length} questões` : 
                "Todas as questões respondidas!"
              }
            </div>
          </div>,
          { duration: 5000 }
        );

        // Calcular acertos
        const acertos = respostas.filter((resposta) => {
          const questao = questoes.find((q) => q.id === resposta.questaoId);
          const opcao = questao?.opcoes.find((o) => o.id === resposta.opcaoId);
          return opcao?.correcta;
        }).length;

        setResultado({ acertos, total: questoes.length });
        setTesteFinalizado(true);
      } else {
        toast.error("Erro ao enviar teste. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao finalizar teste.");
    } finally {
      setSubmitting(false);
    }
  };

  const getProgresso = () => (questoes.length ? (respostas.length / questoes.length) * 100 : 0);
  const getStatusQuestao = (index: number) => {
    const questaoId = questoes[index]?.id;
    return respostas.some(r => r.questaoId === questaoId) ? "respondida" : "pendente";
  };

  // 🔹 Função para voltar às candidaturas
  const voltarParaCandidaturas = () => {
    router.push("/user/candidaturas");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-brand-main mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Carregando Teste</h2>
          <p className="text-gray-600">Preparando ambiente seguro...</p>
        </div>
      </div>
    );
  }

  if (!teste) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum Teste Encontrado</h2>
          <p className="text-gray-600">Verifique se o curso possui testes disponíveis.</p>
          <button
            onClick={() => router.push("/user/candidaturas")}
            className="mt-4 px-6 py-2 bg-brand-main text-white rounded-lg hover:bg-brand-main/90 transition-colors"
          >
            Voltar às Candidaturas
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Resultado final - MODAL QUE NÃO FECHA SOZINHO
  if (testeFinalizado && resultado) {
    const percentual = (resultado.acertos / resultado.total) * 100;
    const aprovado = percentual >= 50;
    const questoesRespondidas = respostas.length;

    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center transform transition-all duration-300 border-4 border-white">
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              aprovado 
                ? "bg-brand-main to-brand-lime text-white" 
                : "bg-brand-lime text-white"
            } shadow-lg`}
          >
            {aprovado ? 
              <Trophy className="w-12 h-12" /> : 
              <Target className="w-12 h-12" />
            }
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-main to-purple-600 bg-clip-text text-transparent">
            {aprovado ? "Parabéns!" : "Continue Estudando!"}
          </h1>
          
          {/* Estatísticas do Resultado */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">{resultado.acertos}</div>
                <div className="text-gray-600 text-sm">Acertos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{resultado.total - resultado.acertos}</div>
                <div className="text-gray-600 text-sm">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-main">{questoesRespondidas}</div>
                <div className="text-gray-600 text-sm">Respondidas</div>
              </div>
            </div>
            
            {questoesRespondidas < resultado.total && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                <div className="text-yellow-700 text-sm">
                  <strong>Teste Incompleto:</strong> {resultado.total - questoesRespondidas} questão(ões) não respondida(s)
                </div>
              </div>
            )}
            
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  aprovado ? "bg-gradient-to-r from-green-400 to-brand-lime" : "bg-gradient-to-r from-red-400 to-orange-500"
                }`}
                style={{ width: `${percentual}%` }}
              ></div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {percentual.toFixed(1)}%
            </div>
            <div className={`text-sm font-semibold ${aprovado ? 'text-green-600' : 'text-red-600'}`}>
              {aprovado ? 'APROVADO' : 'REPROVADO'}
            </div>
          </div>

          {/* Mensagem personalizada */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {aprovado 
                ? "Excelente desempenho! Você está pronto para prosseguir com sua formação."
                : "Não desanime! Revise o conteúdo e tente novamente para melhorar seu desempenho."
              }
            </p>
          </div>

          {/* Botão para voltar às candidaturas - AGORA O USUÁRIO DECIDE QUANDO SAIR */}
          <div className="space-y-3">
            <button
              onClick={voltarParaCandidaturas}
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-main to-purple-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-lg"
            >
              {aprovado ? '🎊 Ir para Minhas Candidaturas' : '📋 Voltar às Candidaturas'}
            </button>
            
            <p className="text-sm text-gray-500">
              Clique no botão acima para retornar à página de candidaturas
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Tela do teste ativo
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com Alertas de Segurança */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-main p-3 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-main">{teste.titulo}</h1>
                  <p className="text-gray-600 mt-1">{teste.descricao}</p>
                </div>
              </div>
              
              {/* Alertas de Segurança */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span>Protegido contra saída</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span>Ao sair da página o teste será enviado Automáticamente</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <CheckSquare className="w-4 h-4" />
                  <span>{respostas.length}/{questoes.length} respondidas</span>
                </div>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`rounded-2xl p-6 min-w-[200px] text-center transition-all duration-300 ${
              tempoRestante < 300 ? 'bg-gradient-to-r from-orange-500 to-red-500 animate-pulse' : 'bg-brand-main'
            } text-white`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-2xl font-bold">{formatarTempo(tempoRestante)}</span>
              </div>
              <div className="text-sm opacity-90">Tempo Restante</div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso: {respostas.length}/{questoes.length} questões</span>
              <span>{Math.round(getProgresso())}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-brand-lime to-green-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${getProgresso()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-4 sticky top-8 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5 text-brand-main" />
                Navegação Rápida
              </h3>
              
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 max-h-screen overflow-y-auto overflow-x-none">
                {questoes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => irParaQuestao(index)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      index === questaoAtual
                        ? "bg-brand-main text-white shadow-lg transform scale-105"
                        : getStatusQuestao(index) === "respondida"
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-semibold">{index + 1}</div>
                    {getStatusQuestao(index) === "respondida" && (
                      <CheckCircle className="w-4 h-4 mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Área Principal da Questão */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {/* Header da Questão */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-brand-main text-white p-2 rounded-full">
                      <span className="font-bold text-lg">{questaoAtual + 1}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Questão {questaoAtual + 1}</h2>
                  </div>
                  <p className="text-gray-600">
                    {getStatusQuestao(questaoAtual) === "respondida" ? "Respondida" : "Aguardando resposta"}
                  </p>
                </div>
              </div>

              {/* Enunciado */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-100">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {questao?.enunciado}
                </p>
              </div>

              {/* Opções de Resposta */}
              <div className="space-y-4 mb-8">
                {questao?.opcoes.map((opcao, i) => (
                  <button
                    key={opcao.id}
                    onClick={() => handleSelecionarOpcao(opcao.id)}
                    className={`w-full p-5 text-left rounded-2xl border-3 transition-all duration-300 transform hover:scale-[1.02] ${
                      opcaoSelecionada === opcao.id
                        ? "border-brand-main bg-brand-main/10 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        opcaoSelecionada === opcao.id
                          ? "bg-brand-main text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-800 font-medium flex-1">{opcao.texto}</span>
                      {opcaoSelecionada === opcao.id && (
                        <CheckCircle className="w-6 h-6 text-brand-main" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navegação e Finalização */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={handleQuestaoAnterior}
                  disabled={questaoAtual === 0}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2 font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>

                <div className="text-center">
                  <span className="text-gray-600 text-sm">
                    Questão {questaoAtual + 1} de {questoes.length}
                  </span>
                </div>

                {questaoAtual < questoes.length - 1 ? (
                  <button
                    onClick={handleProximaQuestao}
                    className="px-6 py-3 bg-brand-main text-white rounded-xl hover:bg-brand-main/90 transition-all transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
                  >
                    Próxima
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalizarTeste}
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-xl hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105 font-bold flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Finalizando...
                      </>
                    ) : (
                      <>
                        <Flag className="w-5 h-5" />
                        Finalizar Teste
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Tempo Crítico */}
      {/* {tempoRestante < 300 && !testeFinalizado && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse border-2 border-white">
          <AlertCircle className="w-6 h-6" />
          <div>
            <div className="font-bold">Atenção! Tempo acabando</div>
            <div className="text-sm">Restam apenas {formatarTempo(tempoRestante)}</div>
          </div>
        </div>
      )} */}
    </div>
  );
}