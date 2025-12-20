'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, Loader2, CheckCircle, ChevronDown
} from 'lucide-react';
import { 
  getAllHorarios,
  type HorarioAPI 
} from '../../lib/horarios-actions';
import { 
  inscreverUsuario, 
  type InscricaoRequest 
} from '../../lib/inscrever-actions-client'; // Mude para o client wrapper
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface InscreverModalProps {
  isOpen: boolean;
  onClose: () => void;
  cursoId: string;
  cursoNome: string;
}

export default function InscreverModal({ 
  isOpen, 
  onClose, 
  cursoId, 
  cursoNome
}: InscreverModalProps) {
  const [horarios, setHorarios] = useState<HorarioAPI[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);
  const [loadingInscricao, setLoadingInscricao] = useState(false);
  const [selectedHorarioId, setSelectedHorarioId] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [inscricaoSucesso, setInscricaoSucesso] = useState(false);
  const [inscricaoData, setInscricaoData] = useState<{
    inscricaoId?: string;
    inscricaoCode?: string;
  }>({});
  const router = useRouter();

  // Buscar horários quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadHorarios();
    }
  }, [isOpen]);

  // Limpar estado quando fechar
  useEffect(() => {
    if (!isOpen) {
      setSelectedHorarioId('');
      setInscricaoSucesso(false);
      setInscricaoData({});
      setShowDropdown(false);
    }
  }, [isOpen]);

  async function loadHorarios() {
    setLoadingHorarios(true);
    try {
      const horariosData = await getAllHorarios();
      setHorarios(horariosData);
      
      // Selecionar o primeiro horário por padrão
      if (horariosData.length > 0) {
        setSelectedHorarioId(horariosData[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      toast.error('Erro ao carregar horários disponíveis');
    } finally {
      setLoadingHorarios(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedHorarioId) {
      toast.error('Selecione um horário');
      return;
    }

    setLoadingInscricao(true);
    
    try {
      const inscricaoDataRequest: InscricaoRequest = {
        cursoId,
        horarioId: selectedHorarioId,
      };

      const resultado = await inscreverUsuario(inscricaoDataRequest);

      if (resultado.success) {
        setInscricaoSucesso(true);
        setInscricaoData({
          inscricaoId: resultado.inscricaoId,
          inscricaoCode: resultado.inscricaoCode
        });
        toast.success(resultado.message);
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        // Tratar erros específicos
        if (resultado.error?.includes('Autenticação') || resultado.error?.includes('login')) {
          toast.error('Sessão expirada. Faça login novamente.');
          router.push('/login');
          onClose();
        } else {
          toast.error(resultado.message || 'Erro ao realizar inscrição');
        }
      }
    } catch (error: any) {
      console.error('Erro ao inscrever:', error);
      
      if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        toast.error('Acesso negado. Faça login novamente.');
        router.push('/login');
        onClose();
      } else if (error.message?.includes('401')) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        onClose();
      } else {
        toast.error('Erro inesperado ao processar inscrição');
      }
    } finally {
      setLoadingInscricao(false);
    }
  }

  // Obter horário selecionado
  const horarioSelecionado = horarios.find(h => h.id === selectedHorarioId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {inscricaoSucesso ? 'Inscrição Confirmada!' : `Inscrever-se`}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {inscricaoSucesso 
                      ? 'Sua inscrição foi registrada com sucesso!' 
                      : `Curso: ${cursoNome}`
                    }
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {inscricaoSucesso ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Parabéns! Você está inscrito
                    </h3>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-brand-main/10 dark:from-blue-900/20 dark:to-brand-main/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                      <p className="font-medium text-blue-800 dark:text-blue-300">
                        {cursoNome}
                      </p>
                      {inscricaoData.inscricaoCode && (
                        <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Código de confirmação:</p>
                          <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                            {inscricaoData.inscricaoCode}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                        Enviaremos um email com os detalhes da inscrição.
                      </p>
                    </div>
                    
                    <div className="animate-pulse text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Fechando automaticamente...
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dropdown de Horários */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Horário *
                      </label>
                      
                      {loadingHorarios ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Carregando horários...</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-900 dark:text-white">
                                {horarioSelecionado 
                                  ? `${horarioSelecionado.periodo} - ${horarioSelecionado.hora}`
                                  : 'Selecione um horário'
                                }
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {showDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                              >
                                <div className="max-h-48 overflow-y-auto">
                                  {horarios.map((horario) => (
                                    <button
                                      key={horario.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedHorarioId(horario.id);
                                        setShowDropdown(false);
                                      }}
                                      className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors ${
                                        selectedHorarioId === horario.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                      }`}
                                    >
                                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                      <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                          {horario.periodo}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {horario.hora}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          * Selecione um horário para se inscrever
                        </p>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            Cancelar
                          </button>
                          
                          <button
                            type="submit"
                            disabled={loadingInscricao || !selectedHorarioId || horarios.length === 0}
                            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-brand-main text-white font-medium rounded-lg hover:from-blue-700 hover:to-brand-main/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                          >
                            {loadingInscricao ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processando...
                              </>
                            ) : (
                              'Confirmar Inscrição'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}