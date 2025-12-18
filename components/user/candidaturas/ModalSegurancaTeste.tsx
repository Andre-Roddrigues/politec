"use client";

import React from 'react';
import { X, AlertTriangle, Shield, Monitor, Mouse, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ModalSegurancaTesteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cursoNome: string;
}

const ModalSegurancaTeste: React.FC<ModalSegurancaTesteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cursoNome
}) => {
  if (!isOpen) return null;

  const medidasSeguranca = [
    {
      icon: Shield,
      title: "Não Feche a Página",
      description: "O teste será enviado automaticamente se fechar a janela do navegador."
    },
    {
      icon: Monitor,
      title: "Não Troque de Aba/Janela",
      description: "Se mudar para outra aba por mais de 5 segundos, o teste será enviado automaticamente."
    },
    {
      icon: Mouse,
      title: "Não Recarregue a Página",
      description: "Recarregar a página resultará no envio imediato do teste e contará como teste Feito."
    },
    {
      icon: Clock,
      title: "Tempo Limitado",
      description: "O teste tem tempo determinado. Certifique-se de ter uma conexão estável de internet."
    },
    {
      icon: AlertTriangle,
      title: "Abra se estiver PRONTO!",
      description: "Você não poderá pausar ou SAIR do teste depois de iniciado."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Medidas de Segurança do Teste
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Curso: {cursoNome}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-700">
            <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
              <strong>Importante:</strong> Estas medidas garantem a integridade do processo avaliativo. 
              Leia atentamente antes de prosseguir.
            </p>
          </div>

          {/* Lista de Medidas */}
          <div className="space-y-4 mb-6">
            {medidasSeguranca.map((medida, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="p-2 bg-brand-main rounded-lg flex-shrink-0">
                  <medida.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {medida.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {medida.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Informações Adicionais */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-700">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                  Recomendações Importantes
                </h4>
                <ul className="text-amber-800 dark:text-amber-400 text-sm space-y-1">
                  <li>• Use uma conexão de internet estável</li>
                  <li>• Feche outros programas e abas do navegador</li>
                  <li>• Certifique-se de que seu dispositivo está carregado</li>
                  <li>• Escolha um local tranquilo para realizar o teste</li>
                  <li>• Tenha em mente que você tem apenas 2 tentativas no total</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Checkbox de Confirmação */}
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 mb-6">
            <input
              type="checkbox"
              id="confirmar-seguranca"
              className="mt-1 w-4 h-4 text-brand-main bg-white border-gray-300 rounded focus:ring-brand-main focus:ring-2"
            />
            <label htmlFor="confirmar-seguranca" className="text-sm text-green-800 dark:text-green-300">
              <strong>Confirmo que li e compreendi todas as medidas de segurança</strong> e estou ciente de que 
              qualquer violação resultará no envio automático do teste e contará como uma tentativa utilizada.
            </label>
          </div>
        </div>

        {/* Footer com Botões */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById('confirmar-seguranca') as HTMLInputElement;
              if (!checkbox?.checked) {
                toast.error('Por favor, confirme que leu e compreendeu as medidas de segurança.');
                return;
              }
              onConfirm();
            }}
            className="px-6 py-3 bg-brand-main text-white font-medium rounded-lg hover:bg-brand-lime transition-all duration-200 transform hover:scale-105"
          >
            Iniciar Teste
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSegurancaTeste;