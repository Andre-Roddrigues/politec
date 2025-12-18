"use client";

import React from 'react';
import { FileText, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import programasData from '../../../lib/programas-testes.json';

interface ProgramaTesteProps {
  cursoId: string;
  cursoNome?: string;
}

const ProgramaTeste: React.FC<ProgramaTesteProps> = ({ cursoId, cursoNome }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  // Encontrar o programa do curso pelo ID
  const programa = programasData.programas.find(p => p.cursoId === cursoId);

  if (!programa) {
    return null; // Não mostra nada se não encontrar o programa
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
              Programa do Teste
            </h4>
            <p className="text-blue-700 dark:text-blue-400 text-xs">
              {isExpanded ? 'Clique para recolher' : 'Clique para ver os temas do teste'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-blue-200 dark:border-blue-700">
          <div className="mb-3">
            <h5 className="font-medium text-blue-900 dark:text-blue-300 text-sm mb-2">
              Curso: {programa.cursoNome}
            </h5>
            <p className="text-blue-700 dark:text-blue-400 text-xs mb-3">
              O teste de diagnóstico abrange os seguintes temas:
            </p>
          </div>
          
          <div className="grid gap-2">
            {programa.temas.map((tema, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-700/50"
              >
                <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {tema}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400 text-center">
              <strong>Dica:</strong> Estude estes temas para se preparar para o teste de diagnóstico
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramaTeste;