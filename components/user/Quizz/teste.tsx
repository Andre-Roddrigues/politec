'use client';

import { useState, useEffect } from 'react';

// Interfaces
interface Alternativas {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Pergunta {
  id: number;
  pergunta: string;
  alineas: Alternativas;
  respostaCorreta: keyof Alternativas;
}

interface QuizData {
  quiz: Pergunta[];
}

type RespostasUsuario = {
  [perguntaId: number]: keyof Alternativas | null;
};

const Quiz = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostasUsuario>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(1200);
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Carregar perguntas
  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        setCarregando(true);
        const response = await fetch('/data/quiz.json');
        const data: QuizData = await response.json();
        const todasPerguntas = data.quiz;
        const perguntasEmbaralhadas = [...todasPerguntas]
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setPerguntas(perguntasEmbaralhadas);

        // Inicializar respostas
        const respostasIniciais: RespostasUsuario = {};
        perguntasEmbaralhadas.forEach((p) => (respostasIniciais[p.id] = null));
        setRespostas(respostasIniciais);
      } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarPerguntas();
  }, []);

  // Timer
  useEffect(() => {
    if (!quizIniciado || mostrarResultado || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizarQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizIniciado, mostrarResultado, tempoRestante]);

  const handleResposta = (alternativa: keyof Alternativas) => {
    const pergunta = perguntas[perguntaAtual];
    if (!pergunta) return;

    setRespostas((prev) => ({
      ...prev,
      [pergunta.id]: alternativa,
    }));
  };

  const proximaPergunta = () => {
    if (perguntaAtual < perguntas.length - 1) setPerguntaAtual(perguntaAtual + 1);
  };

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) setPerguntaAtual(perguntaAtual - 1);
  };

  const finalizarQuiz = () => {
    setMostrarResultado(true);
  };

  const reiniciarQuiz = () => {
    setPerguntaAtual(0);

    const respostasIniciais: RespostasUsuario = {};
    perguntas.forEach((p) => (respostasIniciais[p.id] = null));
    setRespostas(respostasIniciais);

    setMostrarResultado(false);
    setTempoRestante(1200);
    setQuizIniciado(false);

    const perguntasEmbaralhadas = [...perguntas].sort(() => Math.random() - 0.5);
    setPerguntas(perguntasEmbaralhadas);
  };

  const calcularResultado = () => {
    let acertos = 0;
    perguntas.forEach((p) => {
      if (respostas[p.id] === p.respostaCorreta) acertos++;
    });
    const percentual = (acertos / perguntas.length) * 100;
    return { acertos, total: perguntas.length, percentual };
  };

  const iniciarQuiz = () => {
    setQuizIniciado(true);
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (carregando || perguntas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Carregando perguntas...</p>
      </div>
    );
  }

  if (!quizIniciado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-2">Teste de Conhecimentos</h1>
          <p className="text-gray-600 mb-8">Desafie seus conhecimentos!</p>
          <button
            onClick={iniciarQuiz}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Iniciar Teste
          </button>
        </div>
      </div>
    );
  }

  if (mostrarResultado) {
    const resultado = calcularResultado();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-4">🎉 Resultado do Teste</h1>
          <div
            className={`rounded-2xl p-8 mb-8 ${
              resultado.percentual >= 70
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : resultado.percentual >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                : 'bg-gradient-to-r from-red-500 to-pink-600'
            } text-white`}
          >
            <div className="text-6xl font-bold mb-2">
              {resultado.acertos}/{resultado.total}
            </div>
            <div className="text-2xl">{resultado.percentual.toFixed(1)}% de acerto</div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto mb-8">
            {perguntas.map((p, idx) => {
              const respostaUsuario = respostas[p.id];
              const isCorreta = respostaUsuario === p.respostaCorreta;
              return (
                <div
                  key={p.id}
                  className={`border-l-4 p-4 rounded-r-lg ${
                    isCorreta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <p className="font-semibold text-gray-800">
                    Pergunta {idx + 1}: {p.pergunta}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Sua resposta:</span>{' '}
                    <span className={isCorreta ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {respostaUsuario || 'Não respondida'} {isCorreta ? '✓' : '✗'}
                    </span>
                  </p>
                  {!isCorreta && (
                    <p className="text-green-600 font-medium">Resposta correta: {p.respostaCorreta}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={reiniciarQuiz}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Fazer Novo Teste
          </button>
        </div>
      </div>
    );
  }

  // Quiz em andamento
  const pergunta = perguntas[perguntaAtual];
  if (!pergunta) return null; // segurança extra
  const respostaSelecionada = respostas[pergunta.id];
  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">
                Pergunta {perguntaAtual + 1} de {perguntas.length}
              </span>
              <span className="text-sm text-gray-500">{progresso.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
            <span className="text-lg">⏱️</span>
            <span className="font-mono font-bold text-lg">{formatarTempo(tempoRestante)}</span>
          </div>
        </div>

        {/* Pergunta */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">{pergunta.pergunta}</h2>
          <div className="space-y-4">
            {Object.entries(pergunta.alineas).map(([letra, texto]) => (
              <label
                key={letra}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  respostaSelecionada === letra
                    ? 'border-blue-500 bg-blue-50 transform scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <input
                  type="radio"
                  name={`pergunta-${pergunta.id}`}
                  value={letra}
                  checked={respostaSelecionada === letra}
                  onChange={() => handleResposta(letra as keyof Alternativas)}
                  className="hidden"
                />
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 font-semibold ${
                    respostaSelecionada === letra ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {letra}
                </div>
                <span className="text-gray-700 text-lg">{texto}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <button
            onClick={perguntaAnterior}
            disabled={perguntaAtual === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              perguntaAtual === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 transform hover:scale-105'
            }`}
          >
            ← Anterior
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">
              {perguntaAtual + 1} / {perguntas.length}
            </span>
          </div>

          {perguntaAtual < perguntas.length - 1 ? (
            <button
              onClick={proximaPergunta}
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Próxima →
            </button>
          ) : (
            <button
              onClick={finalizarQuiz}
              className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              ✅ Finalizar Teste
            </button>
          )}
        </div>

        {/* Dica */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          💡 Dica: Você pode alterar suas respostas a qualquer momento antes de finalizar o teste.
        </div>
      </div>
    </div>
  );
};

export default Quiz;
