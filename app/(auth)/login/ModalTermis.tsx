"use client";

import { X } from "lucide-react";
import React from "react";

interface ModalTermosProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalTermos({ isOpen, onClose }: ModalTermosProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl border border-blue-100 relative">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Termos e Condições de Uso</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-white hover:text-red-300 transition" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto text-sm text-gray-700 space-y-4">
          <p>
            Ao acessar ou utilizar a plataforma Unitec Academy, você concorda com os seguintes termos:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>Você deve fornecer informações verdadeiras ao se registrar.</li>
            <li>É proibido compartilhar sua senha ou conta com terceiros.</li>
            <li>O conteúdo criado na plataforma pode ser utilizado para fins educacionais.</li>
            <li>A monetização está sujeita a critérios internos e políticas de pagamento.</li>
            <li>Reservamo-nos o direito de suspender contas em caso de uso indevido.</li>
            <li>Você deve respeitar os direitos autorais e a propriedade intelectual de outros.</li>
          </ul>
          <p>
            Para mais detalhes, entre em contato conosco através do nosso suporte oficial.
          </p>
        </div>
      </div>
    </div>
  );
}
