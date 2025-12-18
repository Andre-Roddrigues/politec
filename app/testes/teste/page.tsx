"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getTesteByCursoAction } from "../../../lib/getTesteByCursoAction";

type Opcao = {
  id: string;
  idQuestao: string;
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
  const { idCurso } = useParams(); // 🔹 Pega o id do curso da URL
  const [teste, setTeste] = useState<Teste | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [testeFinalizado, setTesteFinalizado] = useState(false);
  const [resultado, setResultado] = useState<{ acertos: number; total: number } | null>(null);

  // 🔹 Buscar teste real da API
  useEffect(() => {
    if (!idCurso) return;

    const carregarTeste = async () => {
      setLoading(true);
      try {
        const dados = await getTesteByCursoAction(idCurso as string);

        if (!dados) {
          toast.error("Nenhum teste encontrado para este curso");
          return;
        }

        setTeste(dados);
        setQuestoes(dados.questoes || []);
        setTempoRestante((dados.duracao || 45) * 60); // duração em minutos → segundos
      } catch (error) {
        toast.error("Erro ao carregar o teste");
      } finally {
        setLoading(false);
      }
    };

    carregarTeste();
  }, [idCurso]);

  // 🔹 Timer do teste
  useEffect(() => {
    if (loading || testeFinalizado || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalizarTeste();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, testeFinalizado]);

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

  const handleFinalizarTeste = async () => {
    if (respostas.length < questoes.length) {
      const confirmar = window.confirm(
        `Você respondeu ${respostas.length} de ${questoes.length} questões. Deseja finalizar mesmo assim?`
      );
      if (!confirmar) return;
    }

    setSubmitting(true);
    try {
      const acertos = respostas.filter((resposta) => {
        const questao = questoes.find((q) => q.id === resposta.questaoId);
        const opcao = questao?.opcoes.find((o) => o.id === resposta.opcaoId);
        return opcao?.correcta;
      }).length;

      setResultado({ acertos, total: questoes.length });
      setTesteFinalizado(true);
      toast.success("Teste finalizado!");
    } catch {
      toast.error("Erro ao finalizar teste");
    } finally {
      setSubmitting(false);
    }
  };

  const getProgresso = () => (questoes.length ? (respostas.length / questoes.length) * 100 : 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-main mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Carregando teste...</h2>
        </div>
      </div>
    );
  }

  if (!teste) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Nenhum teste encontrado.
      </div>
    );
  }

  // 🔹 Resultado final
  if (testeFinalizado && resultado) {
    const percentual = (resultado.acertos / resultado.total) * 100;
    const aprovado = percentual >= 50;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-2xl w-full text-center">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              aprovado ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {aprovado ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {aprovado ? "Parabéns!" : "Continue Estudando"}
          </h1>
          <p className="text-gray-600 mb-6">
            {aprovado
              ? "Você foi aprovado no teste!"
              : "Você precisa atingir pelo menos 50% de acertos."}
          </p>

          <p className="mt-2 text-gray-700">
            {resultado.acertos} de {resultado.total} questões corretas (
            {percentual.toFixed(0)}%)
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-brand-main text-white rounded-xl hover:bg-brand-main/90 transition"
          >
            Refazer Teste
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Tela do teste
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{teste.titulo}</h1>
            <p className="text-gray-600">{teste.descricao}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-brand-main" />
            <span className="font-mono text-lg">{formatarTempo(tempoRestante)}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 h-2 rounded-full">
            <div
              className="bg-brand-lime h-2 rounded-full"
              style={{ width: `${getProgresso()}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Questão {questaoAtual + 1}</h2>
        <p className="text-gray-800 mb-6">{questao?.enunciado}</p>

        <div className="space-y-3">
          {questao?.opcoes.map((opcao, i) => (
            <button
              key={opcao.id}
              onClick={() => handleSelecionarOpcao(opcao.id)}
              className={`w-full p-4 text-left rounded-xl border-2 transition ${
                opcaoSelecionada === opcao.id
                  ? "border-brand-main bg-brand-main/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <strong className="mr-3">{String.fromCharCode(65 + i)}.</strong>
              {opcao.texto}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleQuestaoAnterior}
            disabled={questaoAtual === 0}
            className="px-6 py-3 border rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Anterior
          </button>

          <button
            onClick={handleProximaQuestao}
            disabled={questaoAtual === questoes.length - 1}
            className="px-6 py-3 bg-brand-main text-white rounded-xl hover:bg-brand-main/90 disabled:opacity-50"
          >
            Próxima
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={handleFinalizarTeste}
            disabled={submitting}
            className="px-8 py-4 bg-brand-lime text-white rounded-xl hover:bg-brand-lime/90 disabled:opacity-50 font-semibold"
          >
            {submitting ? "Finalizando..." : "Finalizar Teste"}
          </button>
        </div>
      </div>

      {tempoRestante < 300 && !testeFinalizado && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-xl shadow-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">
            Atenção! Tempo restante: {formatarTempo(tempoRestante)}
          </span>
        </div>
      )}
    </div>
  );
}
