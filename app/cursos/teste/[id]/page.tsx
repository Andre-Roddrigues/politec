"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Flag,
  CheckSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
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

  // Buscar teste da API
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
        
        toast.success("Teste carregado!");
      } catch (error) {
        toast.error("Erro ao carregar o teste");
      } finally {
        setLoading(false);
      }
    };

    carregarTeste();
  }, [idCurso]);

  // Timer do teste
  useEffect(() => {
    if (!teste || testeFinalizado) return;

    const start = Date.now();
    const durationMs = teste.duracao * 60 * 1000;
    const end = start + durationMs;

    const interval = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.round((end - Date.now()) / 1000));
      setTempoRestante(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        handleFinalizarTeste();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [teste, testeFinalizado]);

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
  };

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

  const voltarParaCandidaturas = () => {
    router.push("/cursos");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-brand-main mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Carregando Teste</h2>
          <p className="text-gray-600">Preparando ambiente...</p>
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
            onClick={() => router.push("/cursos")}
            className="mt-4 px-6 py-2 bg-brand-main text-white rounded-lg hover:bg-brand-main/90 transition-colors"
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    );
  }

  if (testeFinalizado && resultado) {
    const percentual = (resultado.acertos / resultado.total) * 100;
    const aprovado = percentual >= 50;
    const questoesRespondidas = respostas.length;

    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border-4 border-white">
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

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {aprovado 
                ? "Excelente desempenho! Você está pronto para prosseguir com sua formação."
                : "Não desanime! Podes tentar um outro Curso ou revise o conteúdo e tente novamente para melhorar seu desempenho."
              }
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={voltarParaCandidaturas}
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-main to-purple-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-bold text-lg"
            >
              {aprovado ? '🎊 Ir para os Cursos' : '📋 Voltar aos Cursos'}
            </button>
            
            <p className="text-sm text-gray-500">
              Clique no botão acima para retornar à página de Cursos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <CheckSquare className="w-4 h-4" />
                  <span>{respostas.length}/{questoes.length} respondidas</span>
                </div>
              </div>
            </div>
            
            <div className={`rounded-2xl p-6 min-w-[200px] text-center ${
              tempoRestante < 300 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-brand-main'
            } text-white`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-2xl font-bold">{formatarTempo(tempoRestante)}</span>
              </div>
              <div className="text-sm opacity-90">Tempo Restante</div>
            </div>
          </div>

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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-4 sticky top-8 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5 text-brand-main" />
                Navegação Rápida
              </h3>
              
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 max-h-screen overflow-y-auto">
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

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-100">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {questao?.enunciado}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {questao?.opcoes.map((opcao, i) => (
                  <button
                    key={opcao.id}
                    onClick={() => handleSelecionarOpcao(opcao.id)}
                    className={`w-full p-5 text-left rounded-2xl border-3 transition-all duration-300 ${
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
                    className="px-6 py-3 bg-brand-main text-white rounded-xl hover:bg-brand-main/90 transition-all flex items-center gap-2 font-semibold shadow-lg"
                  >
                    Próxima
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalizarTeste}
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-brand-lime to-green-500 text-white rounded-xl hover:shadow-xl disabled:opacity-50 transition-all font-bold flex items-center gap-2"
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
    </div>
  );
}