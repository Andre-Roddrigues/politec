// components/cursos/Payments/PaymentModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TransferPayment from "./TransferPayment";
import BankInfo from "./Bankinfo";
import DigitalPayment from "./DigitalPayments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string; // cursoHorarioId
  cursoId: string; // ID do curso
  horarioId: string; // ID do horário
  itemNome: "inscricao" | "mensalidade" | "curso";
  valor: number;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  itemId, 
  cursoId,
  horarioId,
  itemNome, 
  valor 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"digital" | "transfer">("digital");
  const router = useRouter();

  const handlePaymentSuccess = () => {
    // Mostra o toaster de sucesso
    toast.success(
      itemNome === "inscricao" 
        ? "Inscrição paga com sucesso!" 
        : "Mensalidade paga com sucesso!",
      {
        duration: 4000,
        position: "top-right",
        icon: "✅",
        style: {
          background: "#10b981",
          color: "#fff",
        },
      }
    );

    // Fecha o modal
    onClose();
    
    // Redireciona após um pequeno delay para o usuário ver o toaster
    setTimeout(() => {
      router.push("/user/cursos");
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Pagar {itemNome === "inscricao" ? "Inscrição" : "Mensalidade"}
              </h3>
              {/* <p className="text-gray-600 dark:text-gray-400 text-sm">
                Curso ID: {cursoId} | Horário ID: {horarioId}
              </p> */}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Valor */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  Total a pagar
                </div>
                <div className="text-3xl font-bold text-brand-lime dark:text-white">
                  {valor.toLocaleString("pt-MZ")} MT
                </div>
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setPaymentMethod("digital")}
                className={`flex-1 py-3 font-medium ${paymentMethod === "digital"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                Pagamento Digital
              </button>
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex-1 py-3 font-medium ${paymentMethod === "transfer"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
              >
                Transferência
              </button>
            </div>
          </div>

          {/* Conteúdo do Pagamento */}
          <div className="space-y-6">
            {paymentMethod === "digital" ? (
              <DigitalPayment
                itemId={itemId}
                cursoId={cursoId}
                horarioId={horarioId}
                itemNome={itemNome}
                valor={valor}
                onSuccess={handlePaymentSuccess}
              />
            ) : (
              <>
                <TransferPayment
                  itemId={itemId}
                  cursoId={cursoId}
                  horarioId={horarioId}
                  itemNome={itemNome}
                  onSuccess={handlePaymentSuccess}
                />
                <BankInfo valor={valor.toLocaleString("pt-MZ")} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Ao prosseguir, você concorda com os{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}