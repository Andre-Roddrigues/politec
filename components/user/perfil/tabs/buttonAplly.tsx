"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, CreditCard, Award, UserCheck } from "lucide-react";
import ModalPagamentoGraduacao from "../../../DadosGraduacao/ModalPagamentoGraduacao";
import ModalPagamentoCertificado from "../../../DadosGraduacao/ModalPagamentoCertificado";

interface ApplyButtonProps {
  isEnabled: boolean;
  onClick?: () => void;
  href?: string;
  onCompleteProfile?: () => void; // Nova prop para completar perfil
}

export default function ApplyButton({ 
  isEnabled, 
  onClick, 
  href, 
  onCompleteProfile 
}: ApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'graduacao' | 'certificado' | null>(null);

  const handleClick = (type: 'graduacao' | 'certificado') => {
    if (isEnabled) {
      setPaymentType(type);
      setIsModalOpen(true);
      onClick?.();
    }
  };

  const handleCompleteProfile = () => {
    // Redirecionar para completar perfil
    if (onCompleteProfile) {
      onCompleteProfile();
    } else if (href) {
      window.location.href = href;
    }
  };

  const handleSuccess = () => {
    // Redirecionar para cursos após pagamento bem-sucedido
    if (href) {
      window.location.href = href;
    }
  };

  // Se não estiver habilitado (perfil incompleto), mostrar apenas um botão
  if (!isEnabled) {
    return (
      <motion.button
        className="relative px-6 py-4 rounded-xl font-semibold text-base bg-gray-700 cursor-not-allowed text-white shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform flex items-center justify-center space-x-2 min-w-[200px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <UserCheck size={20} />
        <span>Completar Perfil</span>
        
        {/* Efeito de brilho no hover */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    );
  }

  // Se estiver habilitado (perfil completo), mostrar os dois botões de pagamento
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        {/* Botão Pagar Graduação */}
        <motion.button
          onClick={() => handleClick('graduacao')}
          className="relative px-4 py-3 rounded-xl font-semibold text-base bg-brand-lime text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 transform flex items-center justify-center space-x-2 min-w-[160px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CreditCard size={20} />
          <span>Pagar Graduação</span>
          
          {/* Efeito de brilho no hover */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Botão Pagar Certificação */}
        <motion.button
          onClick={() => handleClick('certificado')}
          className="relative px-4 py-3 rounded-xl font-semibold text-base bg-brand-main text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 transform flex items-center justify-center space-x-2 min-w-[160px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award size={20} />
          <span>Pagar Certificado</span>
          
          {/* Efeito de brilho no hover */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Modal para Graduação */}
      <ModalPagamentoGraduacao
        isOpen={isModalOpen && paymentType === 'graduacao'}
        onClose={() => {
          setIsModalOpen(false);
          setPaymentType(null);
        }}
        onSuccess={handleSuccess}
      />

      {/* Modal para Certificado */}
      <ModalPagamentoCertificado
        isOpen={isModalOpen && paymentType === 'certificado'}
        onClose={() => {
          setIsModalOpen(false);
          setPaymentType(null);
        }}
        onSuccess={handleSuccess}
      />
    </>
  );
}