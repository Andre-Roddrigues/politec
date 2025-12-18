import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { routes } from '../../config/routes';

interface AdicionarQuestaoProps {
  idTeste: string;
  tituloTeste: string;
  onVoltar: () => void;
}

interface QuestaoFormData {
  enunciado: string;
}

const AdicionarQuestao: React.FC<AdicionarQuestaoProps> = ({ 
  idTeste, 
  tituloTeste, 
  onVoltar 
}) => {
  const [formData, setFormData] = useState<QuestaoFormData>({
    enunciado: ''
  });
  const [loading, setLoading] = useState(false);
  const [questoesAdicionadas, setQuestoesAdicionadas] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Adicionando questão...');

    try {
      const response = await fetch(routes.adicionarquestao, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idTeste,
          enunciado: formData.enunciado
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(`✅ Questão adicionada com sucesso!`);
        
        // Incrementar contador e limpar formulário
        setQuestoesAdicionadas(prev => prev + 1);
        setFormData({ enunciado: '' });

        // Toast informativo após algumas questões
        if (questoesAdicionadas + 1 === 5) {
          toast.success('📝 Continue adicionando questões! Você pode adicionar quantas quiser.');
        }

      } else {
        toast.dismiss(loadingToast);
        toast.error(`❌ ${result.message || 'Falha ao adicionar questão'}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Erro ao adicionar questão:', error);
      toast.error('🌐 Erro de conexão ao adicionar questão');
    } finally {
      setLoading(false);
    }
  };

  const finalizarAdicaoQuestoes = () => {
    toast.success(`🎉 Processo finalizado! ${questoesAdicionadas} questões adicionadas ao teste "${tituloTeste}"`);
    onVoltar();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Adicionar Questões</h2>
          <p className="text-gray-600">
            Teste: <span className="font-semibold">{tituloTeste}</span> | 
            Questões adicionadas: <span className="font-bold text-blue-600">{questoesAdicionadas}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={finalizarAdicaoQuestoes}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Finalizar ✅
          </button>
          <button
            onClick={onVoltar}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Voltar ↩️
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 Dicas para adicionar questões:</h3>
        <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
          <li>Escreva enunciados claros e objetivos</li>
          <li>Você poderá adicionar alternativas depois</li>
          <li>Adicione quantas questões desejar</li>
          <li>Clique em Finalizar quando terminar</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="enunciado" className="block text-sm font-semibold text-gray-700 mb-2">
            Enunciado da Questão *
          </label>
          <textarea
            id="enunciado"
            name="enunciado"
            value={formData.enunciado}
            onChange={handleChange}
            required
            placeholder="Digite o enunciado da questão aqui..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adicionando...
              </span>
            ) : (
              '➕ Adicionar Questão'
            )}
          </button>
        </div>
      </form>

      {questoesAdicionadas > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-center">
            <strong>{questoesAdicionadas}</strong> questão(ões) adicionada(s) com sucesso!
          </p>
        </div>
      )}
    </div>
  );
};

export default AdicionarQuestao;