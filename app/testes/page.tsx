"use client"
import React, { useState, useEffect } from 'react';
import { Curso, getCursos } from "../../lib/cursos-actions";
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ArrowRight, 
  Rocket, 
  Clock, 
  Calendar,
  HelpCircle,
  Lightbulb,
  Save,
  ChevronLeft,
  Award,
  ListChecks,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';

interface TesteFormData {
  idCurso: string;
  titulo: string;
  dataTeste: string;
  duracao: string;
  descricao: string;
}

interface ApiResponse {
  message: string;
  data: {
    createdAt: string;
    updatedAt: string;
    id: string;
    titulo: string;
    dataTeste: string;
    duracao: string;
    idCurso: string;
  };
}

interface QuestaoResponse {
  message: string;
  data: {
    id: string;
    enunciado: string;
    idTeste: string;
    createdAt: string;
    updatedAt: string;
  };
}

const LIMITE_QUESTOES = 15;

const AdicionarTeste: React.FC = () => {
  const [formData, setFormData] = useState<TesteFormData>({
    idCurso: '',
    titulo: '',
    dataTeste: '',
    duracao: '',
    descricao: ''
  });

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [testeCriado, setTesteCriado] = useState<ApiResponse['data'] | null>(null);
  const [modo, setModo] = useState<'criarTeste' | 'adicionarQuestoes' | 'adicionarOpcoes'>('criarTeste');
  const [questaoAtual, setQuestaoAtual] = useState<QuestaoResponse['data'] | null>(null);
  const [questoesAdicionadas, setQuestoesAdicionadas] = useState<QuestaoResponse['data'][]>([]);

  useEffect(() => {
    const carregarCursos = async () => {
      try {
        const cursosData = await getCursos();
        setCursos(cursosData);
        toast.success(`${cursosData.length} cursos carregados com sucesso`);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        toast.error('Erro ao carregar a lista de cursos');
      }
    };

    carregarCursos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Criando teste...');

    try {
      const response = await fetch('https://backend-promet.unitec.academy/adicionar-teste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        
        toast.success(
          <div className="text-center">
            <div className="font-bold text-brand-main text-lg">🎉 Teste Criado com Sucesso!</div>
            <div className="text-sm text-gray-600 mt-2">
              <div><strong>Título:</strong> {result.data.titulo}</div>
              <div><strong>ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{result.data.id}</code></div>
            </div>
          </div>,
          { duration: 4000 }
        );

        setTesteCriado(result.data);
        setModo('adicionarQuestoes');
        setQuestoesAdicionadas([]);

        setTimeout(() => {
          toast.success(
            `Agora adicione as ${LIMITE_QUESTOES} questões necessárias para o teste`,
            { duration: 5000, icon: '📝' }
          );
        }, 1000);

      } else {
        toast.dismiss(loadingToast);
        toast.error(`${result.message || 'Falha ao criar o teste'}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Erro ao adicionar teste:', error);
      toast.error('🌐 Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const voltarParaCriarTeste = () => {
    setModo('criarTeste');
    setTesteCriado(null);
    setQuestaoAtual(null);
    setQuestoesAdicionadas([]);
    setFormData({
      idCurso: '',
      titulo: '',
      dataTeste: '',
      duracao: '',
      descricao: ''
    });
    toast.success('📝 Iniciando novo teste');
  };

  const finalizarProcesso = () => {
    toast.success(
      <div className="text-center">
        <div className="font-bold text-lg text-brand-main">🎉 Processo Concluído!</div>
        <div className="text-sm">
          {questoesAdicionadas.length} questões adicionadas ao teste<br/>
          <strong>{testeCriado?.titulo}</strong>
        </div>
      </div>,
      { duration: 6000 }
    );
    voltarParaCriarTeste();
  };

  // Componente para adicionar questões
  const AdicionarQuestaoComponent = () => {
    const [questaoForm, setQuestaoForm] = useState({ enunciado: '' });
    const [loadingQuestao, setLoadingQuestao] = useState(false);

    const handleQuestaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestaoForm({ enunciado: e.target.value });
    };

    const handleQuestaoSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!testeCriado) return;

      setLoadingQuestao(true);
      const loadingToast = toast.loading(`Adicionando questão ${questoesAdicionadas.length + 1}...`);

      try {
        const response = await fetch('https://backend-promet.unitec.academy/adicionar-questao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idTeste: testeCriado.id,
            enunciado: questaoForm.enunciado
          }),
        });

        const result: QuestaoResponse = await response.json();

        if (response.ok) {
          toast.dismiss(loadingToast);
          toast.success(`✅ Questão ${questoesAdicionadas.length + 1} adicionada!`);
          
          setQuestaoAtual(result.data);
          setQuestoesAdicionadas(prev => [...prev, result.data]);
          setModo('adicionarOpcoes');
          setQuestaoForm({ enunciado: '' });

          setTimeout(() => {
            toast.success('Agora configure as opções de resposta', {
              duration: 4000,
              icon: '➡️'
            });
          }, 1000);

        } else {
          toast.dismiss(loadingToast);
          toast.error(`${result.message || 'Falha ao adicionar questão'}`);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Erro ao adicionar questão:', error);
        toast.error('🌐 Erro de conexão');
      } finally {
        setLoadingQuestao(false);
      }
    };

    const progresso = (questoesAdicionadas.length / LIMITE_QUESTOES) * 100;
    const questaoAtualNumero = questoesAdicionadas.length + 1;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header com Informações do Teste */}
        <div className="bg-brand-main text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{testeCriado?.titulo}</h1>
                  <p className="text-white/80">Criação de Questionário</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{questoesAdicionadas.length}</div>
                  <div className="text-white/80 text-sm">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{LIMITE_QUESTOES - questoesAdicionadas.length}</div>
                  <div className="text-white/80 text-sm">Restantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{questaoAtualNumero}</div>
                  <div className="text-white/80 text-sm">Próxima</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{LIMITE_QUESTOES}</div>
                  <div className="text-white/80 text-sm">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Progresso do Questionário</span>
              <span>{Math.round(progresso)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {questoesAdicionadas.length >= LIMITE_QUESTOES ? (
          <div className="bg-brand-lime text-white rounded-2xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <Award size={64} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Parabéns!</h2>
            <p className="text-xl mb-6 opacity-90">
              Você completou todas as {LIMITE_QUESTOES} questões do teste.
            </p>
            <div className="space-y-3">
              <button
                onClick={finalizarProcesso}
                className="bg-white text-brand-lime px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} className="text-brand-lime" />
                Finalizar Questionário
              </button>
              <button
                onClick={voltarParaCriarTeste}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={20} className="text-brand-lime" />
                Criar Novo Teste
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header da Questão */}
            <div className="bg-brand-main text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Questão {questaoAtualNumero}</h2>
                    <p className="text-white/80">
                      de {LIMITE_QUESTOES} questões totais
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{questaoAtualNumero}</div>
                  <div className="text-white/80 text-sm">Nº da Questão</div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="p-8">
              <form onSubmit={handleQuestaoSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-brand-main mb-4">
                    <span className="flex items-center gap-2">
                      <FileText size={24} />
                      Enunciado da Questão
                    </span>
                    <span className="text-sm font-normal text-gray-600 mt-1 block">
                      Escreva claramente a pergunta que será apresentada aos formandos
                    </span>
                  </label>
                  <textarea
                    value={questaoForm.enunciado}
                    onChange={handleQuestaoChange}
                    required
                    placeholder="Digite a questão aqui..."
                    rows={6}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all resize-vertical text-lg"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loadingQuestao}
                  className="w-full bg-brand-main text-white py-5 px-6 rounded-xl font-bold text-lg hover:bg-brand-main/90 focus:outline-none focus:ring-4 focus:ring-brand-main/20 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
                >
                  {loadingQuestao ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Adicionando Questão {questaoAtualNumero}...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <ArrowRight size={20} className="text-brand-lime" />
                      Adicionar Questão {questaoAtualNumero} e Configurar Opções
                    </span>
                  )}
                </button>
              </form>

              {/* Dicas */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-brand-main text-lg mb-3 flex items-center gap-2">
                  <Lightbulb size={20} className="text-brand-lime" />
                  Dicas para uma boa questão
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-main mt-1">•</span>
                    <span>Seja claro e objectivo no enunciado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-main mt-1">•</span>
                    <span>Evite ambiguidades na pergunta</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-main mt-1">•</span>
                    <span>Use linguagem apropriada para o nível</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-main mt-1">•</span>
                    <span>Verifique a gramática e ortografia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-6">
          <button
            onClick={voltarParaCriarTeste}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} className="text-brand-lime" />
            Voltar
          </button>
          {questoesAdicionadas.length > 0 && (
            <button
              onClick={finalizarProcesso}
              className="px-6 py-3 bg-brand-lime text-white rounded-xl font-semibold hover:bg-brand-lime/90 transition-all flex items-center gap-2"
            >
              <CheckCircle size={20} className="text-brand-lime" />
              Finalizar ({questoesAdicionadas.length}/{LIMITE_QUESTOES})
            </button>
          )}
        </div>
      </div>
    );
  };

  // Componente para adicionar opções
  const AdicionarOpcoesComponent = () => {
    const [opcoes, setOpcoes] = useState<Array<{ texto: string; correcta: boolean }>>([
      { texto: '', correcta: false },
      { texto: '', correcta: false },
      { texto: '', correcta: false },
      { texto: '', correcta: false }
    ]);
    const [loadingOpcoes, setLoadingOpcoes] = useState(false);

    const handleOpcaoChange = (index: number, field: string, value: string | boolean) => {
      const newOpcoes = [...opcoes];
      
      if (field === 'correcta' && value === true) {
        newOpcoes.forEach((opcao, i) => {
          newOpcoes[i].correcta = i === index;
        });
      } else {
        newOpcoes[index] = { ...newOpcoes[index], [field]: value };
      }
      setOpcoes(newOpcoes);
    };

    const handleAdicionarOpcao = () => {
      if (opcoes.length < 6) {
        setOpcoes([...opcoes, { texto: '', correcta: false }]);
        toast.success('Nova opção adicionada');
      } else {
        toast.error('Máximo de 6 opções permitidas');
      }
    };

    const handleRemoverOpcao = (index: number) => {
      if (opcoes.length > 2) {
        setOpcoes(opcoes.filter((_, i) => i !== index));
        toast.success('Opção removida');
      } else {
        toast.error('Mínimo de 2 opções necessárias');
      }
    };

    const handleSubmitOpcoes = async () => {
      if (!questaoAtual) return;

      const temOpcaoCorreta = opcoes.some(opcao => opcao.correcta);
      if (!temOpcaoCorreta) {
        toast.error('Selecione uma opção como correta');
        return;
      }

      const opcoesInvalidas = opcoes.some(opcao => !opcao.texto.trim());
      if (opcoesInvalidas) {
        toast.error('Todas as opções devem ter texto');
        return;
      }

      setLoadingOpcoes(true);
      const loadingToast = toast.loading(`Adicionando ${opcoes.length} opções...`);

      try {
        let sucessos = 0;
        
        for (const opcao of opcoes) {
          const response = await fetch('https://backend-promet.unitec.academy/adicionar-opcao', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idQuestao: questaoAtual.id,
              texto: opcao.texto,
              correcta: opcao.correcta
            }),
          });

          if (response.ok) sucessos++;
        }

        toast.dismiss(loadingToast);
        
        if (sucessos === opcoes.length) {
          toast.success(`✅ ${sucessos} opções adicionadas à questão ${questoesAdicionadas.length}!`);
          
          if (questoesAdicionadas.length >= LIMITE_QUESTOES) {
            setTimeout(finalizarProcesso, 1500);
          } else {
            setTimeout(() => {
              setModo('adicionarQuestoes');
              toast.success(`📝 Próxima: Questão ${questoesAdicionadas.length + 1} de ${LIMITE_QUESTOES}`);
            }, 1000);
          }
        } else {
          toast.error(`⚠️ ${sucessos}/${opcoes.length} opções adicionadas`);
        }

      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('🌐 Erro de conexão');
      } finally {
        setLoadingOpcoes(false);
      }
    };

    const questaoNumero = questoesAdicionadas.length;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-brand-lime text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Questão {questaoNumero} Concluída!</h1>
                <p className="text-white/80">
                  Agora configure as opções de resposta
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{questaoNumero}/{LIMITE_QUESTOES}</div>
              <div className="text-white/80 text-sm">Progresso</div>
            </div>
          </div>
        </div>

        {/* Preview da Questão */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-brand-main mb-3 flex items-center gap-2">
            <FileText size={20} className="text-brand-lime" />
            Preview da Questão
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
            <p className="text-gray-700 text-lg">
              {questaoAtual?.enunciado || 'Carregando...'}
            </p>
          </div>
        </div>

        {/* Opções */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-brand-main text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ListChecks size={24} />
              Opções de Resposta
            </h2>
            <p className="text-white/80 mt-1">
              Configure as alternativas e marque a correta
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              {opcoes.map((opcao, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-main/50 transition-all bg-white">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                          opcao.correcta ? 'bg-brand-lime' : 'bg-gray-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        Opção {index + 1}
                        {opcao.correcta && (
                          <span className="bg-brand-lime/20 text-brand-lime px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle size={12} />
                            Correta
                          </span>
                        )}
                      </span>
                    </label>
                    <textarea
                      value={opcao.texto}
                      onChange={(e) => handleOpcaoChange(index, 'texto', e.target.value)}
                      placeholder={`Texto da opção ${String.fromCharCode(65 + index)}...`}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-main focus:ring-2 focus:ring-brand-main/20 resize-vertical"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 mt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={opcao.correcta}
                        onChange={(e) => handleOpcaoChange(index, 'correcta', e.target.checked)}
                        className="w-5 h-5 text-brand-main bg-gray-100 border-gray-300 rounded focus:ring-brand-main/20"
                      />
                      <span className="text-sm font-medium text-gray-700">Correta</span>
                    </label>

                    {opcoes.length > 2 && (
                      <button
                        onClick={() => handleRemoverOpcao(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Remover opção"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAdicionarOpcao}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus size={18} />
                Adicionar Opção
              </button>
            </div>

            <button 
              onClick={handleSubmitOpcoes}
              disabled={loadingOpcoes}
              className="w-full bg-brand-main text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-brand-main/90 focus:outline-none focus:ring-4 focus:ring-brand-main/20 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {loadingOpcoes ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Salvando {opcoes.length} Opções...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Save size={20} className="text-brand-lime" />
                  Salvar Opções e {questoesAdicionadas.length >= LIMITE_QUESTOES ? 'Finalizar' : 'Continuar'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modo Criar Teste
  if (modo === 'criarTeste') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 mx-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-brand-main">Criar Novo Teste</h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Configure seu questionário com {LIMITE_QUESTOES} questões
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <Settings size={24} className="text-brand-lime" />
                  </div>
                  <h3 className="font-semibold text-brand-main">Criar Teste</h3>
                  <p className="text-gray-600 text-sm">Informações básicas</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <HelpCircle size={24} className="text-brand-lime" />
                  </div>
                  <h3 className="font-semibold text-brand-main">{LIMITE_QUESTOES} Questões</h3>
                  <p className="text-gray-600 text-sm">Enunciados das perguntas</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <ListChecks size={24} className="text-brand-lime" />
                  </div>
                  <h3 className="font-semibold text-brand-main">Opções</h3>
                  <p className="text-gray-600 text-sm">Alternativas de resposta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl shadow-xl mx-6 overflow-hidden">
            <div className="bg-brand-main text-white p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Settings size={24} className="text-brand-lime"/>
                Configurações do Teste
              </h2>
              <p className="text-white/80 mt-1">
                Preencha as informações básicas do questionário
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-lg font-semibold text-brand-main mb-3">
                    <span className="flex items-center gap-2">
                      <BookOpen size={20} className="text-brand-lime" />
                      Curso
                    </span>
                  </label>
                  <select
                    name="idCurso"
                    value={formData.idCurso}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all text-lg"
                  >
                    <option value="">Selecione um curso</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-lg font-semibold text-brand-main mb-3">
                    <span className="flex items-center gap-2">
                      <FileText size={20} className="text-brand-lime" />
                      Título do Teste
                    </span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Avaliação de Conhecimentos Gerais - 2024"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-brand-main mb-3">
                    <span className="flex items-center gap-2">
                      <Calendar size={20} className="text-brand-lime" />
                      Data e Hora
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    name="dataTeste"
                    value={formData.dataTeste}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-brand-main mb-3">
                    <span className="flex items-center gap-2">
                      <Clock size={20} className="text-brand-lime" />
                      Duração (minutos)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleChange}
                    required
                    placeholder="45"
                    min="1"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all text-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-lg font-semibold text-brand-main mb-3">
                    <span className="flex items-center gap-2">
                      <FileText size={20} className="text-brand-lime" />
                      Descrição
                    </span>
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    placeholder="Descreva o conteúdo, objetivos e instruções do teste..."
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-main focus:ring-4 focus:ring-brand-main/20 transition-all resize-vertical text-lg"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-brand-main text-white py-5 px-6 rounded-xl font-bold text-lg hover:bg-brand-main/90 focus:outline-none focus:ring-4 focus:ring-brand-main/20 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Criando Teste...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Criar Teste e Iniciar Questionário
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Renderização dos outros modos
  switch (modo) {
    case 'adicionarOpcoes':
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-8">
          <AdicionarOpcoesComponent />
        </div>
      );
    case 'adicionarQuestoes':
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
          <AdicionarQuestaoComponent />
        </div>
      );
    default:
      return null;
  }
};

export default AdicionarTeste;