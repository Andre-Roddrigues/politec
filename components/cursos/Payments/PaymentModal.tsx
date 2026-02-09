// components/cursos/Payments/PaymentModal.tsx
"use client";

import { useState } from "react";
import { X, Percent, Info } from "lucide-react";
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
  itemNome: "inscricao" | "matricula" | "mensalidade" | "curso";
  valor: number;
  gratuito?: boolean;
  valorBase?: number; // Valor sem desconto
  descontoPercentual?: number; // Percentual de desconto
  ivaPercentual?: number; // Percentual de IVA
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  itemId, 
  cursoId,
  horarioId,
  itemNome, 
  valor,
  valorBase = 0,
  descontoPercentual = 0,
  ivaPercentual = 0.05
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"digital" | "transfer">("digital");
  const router = useRouter();

  // Calcular valores detalhados
  const valorSemIVA = valor / (1 + ivaPercentual);
  const valorIVA = valor - valorSemIVA;
  const temDesconto = descontoPercentual > 0;

  // Função para obter o nome completo do item
  const getItemName = () => {
    switch(itemNome) {
      case 'inscricao': return 'Inscrição';
      case 'matricula': return 'Matrícula';
      case 'mensalidade': return 'Mensalidade';
      case 'curso': return 'Inscrição + Matrícula + 1ª Mensalidade';
      default: return 'Item';
    }
  };

  // Função para mensagem de sucesso
  const getSuccessMessage = () => {
    switch(itemNome) {
      case 'inscricao': return 'Inscrição paga com sucesso!';
      case 'matricula': return 'Matrícula paga com sucesso!';
      case 'mensalidade': return 'Mensalidade paga com sucesso!';
      case 'curso': return 'Pagamento completo realizado com sucesso!';
      default: return 'Pagamento realizado com sucesso!';
    }
  };

  const handlePaymentSuccess = () => {
    // Mostra o toaster de sucesso
    toast.success(
      getSuccessMessage(),
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
                Pagar {getItemName()}
              </h3>
              {itemNome === "curso" && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Inscrição + Matrícula + 1ª Mensalidade
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Valor - Com informações de desconto e IVA */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl mb-6">
            <div className="flex flex-col">
              {/* Título */}
              {/* <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Total a pagar
                {temDesconto && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full inline-flex items-center">
                    <Percent className="w-3 h-3 mr-1" />
                    {descontoPercentual}% de desconto aplicado
                  </span>
                )}
              </div> */}
              
              {/* Valor principal */}
              <div className="flex items-baseline gap-3 mb-3">
                <div className="text-3xl font-bold text-brand-lime dark:text-white">
                  {valor.toLocaleString("pt-MZ")} MT
                </div>
                
                {/* Mostrar valor original riscado se tiver desconto */}
                {temDesconto && valorBase > 0 && (
                  <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {calcularValorComIVA(valorBase, ivaPercentual).toLocaleString("pt-MZ")} MT
                  </div>
                )}
              </div>

              {/* Detalhamento do valor */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Valor base:</span>
                    <span className="font-medium">
                      {valorSemIVA.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>
                </div>
                
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>IVA ({ivaPercentual * 100}%):</span>
                    <span className="font-medium">
                      +{valorIVA.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo do desconto se aplicável */}
              {/* {temDesconto && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700/30">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Info className="w-4 h-4 mr-2 text-green-500" />
                    <span>
                      Você economizou <span className="font-semibold text-green-600 dark:text-green-400">
                        {calcularEconomia(valorBase, descontoPercentual, ivaPercentual).toLocaleString("pt-MZ")} MT
                      </span> com o desconto!
                    </span>
                  </div>
                </div>
              )} */}
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

          {/* Footer com informações adicionais */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Após o pagamento, sua inscrição será processada automaticamente. 
                  Você receberá uma confirmação por email em até 24 horas.
                </span>
              </div>
              
              {itemNome === 'matricula' && (
                <div className="flex items-start gap-2 text-blue-600 dark:text-blue-400">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Nota:</strong> A matrícula só pode ser paga após a confirmação da inscrição.
                  </span>
                </div>
              )}
            </div>

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

// Funções auxiliares
function calcularValorComIVA(valor: number, ivaPercentual: number): number {
  return valor * (1 + ivaPercentual);
}

function calcularValorComDesconto(valor: number, descontoPercentual: number): number {
  return valor * (1 - descontoPercentual / 100);
}

function calcularEconomia(valorBase: number, descontoPercentual: number, ivaPercentual: number): number {
  const valorComDesconto = calcularValorComDesconto(valorBase, descontoPercentual);
  const valorOriginalComIVA = calcularValorComIVA(valorBase, ivaPercentual);
  const valorDescontoComIVA = calcularValorComIVA(valorComDesconto, ivaPercentual);
  
  return valorOriginalComIVA - valorDescontoComIVA;
}