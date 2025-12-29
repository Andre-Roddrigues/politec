'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, Loader2, CheckCircle, ChevronDown,
  Calendar, AlertCircle, Smartphone
} from 'lucide-react';
import { 
  getAllHorarios,
  type HorarioAPI 
} from '../../lib/horarios-actions';
import { 
  inscreverUsuario, 
  type InscricaoRequest 
} from '../../lib/inscrever-actions-client';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Fechar modal com ESC
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Focar no modal quando abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

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
        
        // Fechar modal após 5 segundos
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
          {/* Backdrop com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
            
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[95dvh] overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-t-3xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-brand-main/20 dark:from-blue-900/30 dark:to-brand-main/30">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {inscricaoSucesso ? '🎉 Inscrição Confirmada!' : `Inscrever-se`}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {inscricaoSucesso 
                        ? 'Sua inscrição foi registrada com sucesso!' 
                        : cursoNome
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(95dvh-140px)]">
                {inscricaoSucesso ? (
                  <div className="text-center py-4 md:py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                      Parabéns! Você está inscrito
                    </h3>
                    
                    <div className="relative bg-gradient-to-r from-blue-50 via-white to-brand-main/5 dark:from-blue-900/20 dark:via-gray-800 dark:to-brand-main/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5 md:p-6 mb-6 overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-12 translate-x-12" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-main/5 rounded-full translate-y-8 -translate-x-8" />
                      
                      <div className="relative">
                        <p className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-4">
                          {cursoNome}
                        </p>
                        {inscricaoData.inscricaoCode && (
                          <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                              Código de confirmação
                            </p>
                            <div className="flex items-center justify-center gap-3">
                              <div className="p-3 bg-gradient-to-br from-blue-100 to-brand-main/20 dark:from-blue-900/30 rounded-lg">
                                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <p className="font-mono font-bold text-xl md:text-2xl text-gray-900 dark:text-white tracking-wider">
                                {inscricaoData.inscricaoCode}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                              Guarde este código para referência futura
                            </p>
                          </div>
                        )}
                        <div className="mt-6 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            Enviaremos um email com os detalhes da inscrição.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-pulse text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fechando automaticamente em 5 segundos...
                      </div>
                      <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Fechar agora
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Dropdown de Horários */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Selecione o Horário *
                      </label>
                      
                      {loadingHorarios ? (
                        <div className="flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carregando horários...</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">Por favor, aguarde</span>
                          </div>
                        </div>
                      ) : horarios.length === 0 ? (
                        <div className="py-6 px-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 text-center">
                          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                          <p className="font-medium text-amber-800 dark:text-amber-300">Nenhum horário disponível</p>
                          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">
                            Entre em contato para mais informações
                          </p>
                        </div>
                      ) : (
                        <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-expanded={showDropdown}
                            aria-haspopup="listbox"
                            aria-label={horarioSelecionado 
                              ? `Horário selecionado: ${horarioSelecionado.periodo} - ${horarioSelecionado.hora}` 
                              : 'Selecione um horário'
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-left">
                                <span className="block font-semibold text-gray-900 dark:text-white">
                                  {horarioSelecionado 
                                    ? horarioSelecionado.periodo
                                    : 'Selecione um horário'
                                  }
                                </span>
                                {horarioSelecionado && (
                                  <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {horarioSelecionado.hora}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {showDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-30 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl overflow-hidden"
                                role="listbox"
                                aria-label="Lista de horários disponíveis"
                              >
                                <div className="max-h-64 md:max-h-72 overflow-y-auto">
                                  {horarios.map((horario, index) => (
                                    <motion.button
                                      key={horario.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedHorarioId(horario.id);
                                        setShowDropdown(false);
                                      }}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className={`w-full px-4 py-3.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                        selectedHorarioId === horario.id 
                                          ? 'bg-gradient-to-r from-blue-50 to-brand-main/10 dark:from-blue-900/30 dark:to-brand-main/20' 
                                          : ''
                                      }`}
                                      role="option"
                                      aria-selected={selectedHorarioId === horario.id}
                                    >
                                      <div className={`p-2 rounded-lg ${
                                        selectedHorarioId === horario.id 
                                          ? 'bg-blue-600 dark:bg-blue-500' 
                                          : 'bg-gray-100 dark:bg-gray-700'
                                      }`}>
                                        <Clock className={`w-4 h-4 ${
                                          selectedHorarioId === horario.id 
                                            ? 'text-white' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`} />
                                      </div>
                                      <div className="flex-1">
                                        <div className={`font-medium ${
                                          selectedHorarioId === horario.id 
                                            ? 'text-blue-700 dark:text-blue-300' 
                                            : 'text-gray-900 dark:text-white'
                                        }`}>
                                          {horario.periodo}
                                        </div>
                                        <div className={`text-sm ${
                                          selectedHorarioId === horario.id 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                          {horario.hora}
                                        </div>
                                      </div>
                                      {selectedHorarioId === horario.id && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      
                      {horarioSelecionado && !loadingHorarios && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
                        >
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Horário selecionado
                          </p>
                          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                            {horarioSelecionado.periodo} • {horarioSelecionado.hora}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center md:text-left px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg">
                          <span className="font-medium">* Obrigatório</span> • Após a inscrição, você receberá um email de confirmação
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex-1 sm:flex-none"
                          >
                            Cancelar
                          </button>
                          
                          <button
                            type="submit"
                            disabled={loadingInscricao || !selectedHorarioId || horarios.length === 0}
                            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-brand-main hover:from-blue-700 hover:via-blue-600 hover:to-brand-main/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 flex-1 sm:flex-none"
                          >
                            {loadingInscricao ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Processando...</span>
                                <span className="inline sm:hidden">Processando...</span>
                              </>
                            ) : (
                              <>
                                Confirmar Inscrição
                                <CheckCircle className="w-4 h-4" />
                              </>
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