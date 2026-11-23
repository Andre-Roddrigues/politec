// components/cursos/Payments/PaymentModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Lock, UserPlus, CreditCard, Landmark, Loader2, CheckCircle } from "lucide-react";
import TransferPayment from "./TransferPayment";
import BankInfo from "./Bankinfo";
import DigitalPayment from "./DigitalPayments";
import EnrollmentForm from "./EnrollmentForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { checkEnrollmentStatus } from "../../../lib/enrollment-actions";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  cursoId: string;
  horarioId: string;
  itemNome: "inscricao" | "matricula" | "mensalidade" | "curso";
  valor: number;
  gratuito?: boolean;
  valorBase?: number;
  descontoPercentual?: number;
  ivaPercentual?: number;
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
  
  // Nova Tab: 'ficha' | 'digital' | 'transfer'
  const [activeTab, setActiveTab] = useState<"ficha" | "digital" | "transfer">("ficha");
  
  const [hasEnrollment, setHasEnrollment] = useState<boolean | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Verifica se já tem ficha ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setLoadingCheck(true);
      checkEnrollmentStatus(cursoId).then((res) => {
        setHasEnrollment(res.hasEnrollment);
        // Se já tiver ficha, abre logo na tab de pagamento
        if (res.hasEnrollment) setActiveTab("digital");
        setLoadingCheck(false);
      });
    }
  }, [isOpen, cursoId]);

  // ... (cálculos de IVA mantidos) ...

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold">Finalizar Pagamento</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 shrink-0 bg-gray-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab("ficha")}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "ficha" ? "border-brand-main text-brand-main" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Ficha de Inscrição
          </button>
          
          <button
            onClick={() => hasEnrollment && setActiveTab("digital")}
            disabled={!hasEnrollment}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "digital" ? "border-brand-main text-brand-main" : "border-transparent text-gray-500"
            } ${!hasEnrollment ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"}`}
          >
            {!hasEnrollment ? <Lock className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />} Pagamento Digital
          </button>
          
          <button
            onClick={() => hasEnrollment && setActiveTab("transfer")}
            disabled={!hasEnrollment}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "transfer" ? "border-brand-main text-brand-main" : "border-transparent text-gray-500"
            } ${!hasEnrollment ? "opacity-50 cursor-not-allowed" : "hover:text-gray-700"}`}
          >
            {!hasEnrollment ? <Lock className="w-4 h-4" /> : <Landmark className="w-4 h-4" />} Transferência
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="p-6 overflow-y-auto">
          {loadingCheck ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-main" /></div>
          ) : (
            <>
              {activeTab === "ficha" && !hasEnrollment && (
                <div>
                  <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                    É necessário preencher a sua ficha de inscrição antes de prosseguir com o pagamento.
                  </div>
                  <EnrollmentForm 
                    courseId={cursoId} 
                    horarioId={horarioId} 
                    onSuccess={() => {
                      setHasEnrollment(true);
                      setActiveTab("digital"); // Muda automaticamente para pagamento
                    }} 
                  />
                </div>
              )}

              {activeTab === "ficha" && hasEnrollment && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Ficha já preenchida!</h3>
                  <p className="text-gray-500 mt-2">Já pode prosseguir para o pagamento.</p>
                  <button onClick={() => setActiveTab("digital")} className="mt-6 px-6 py-2 bg-brand-main text-white rounded-lg">
                    Ir para Pagamento
                  </button>
                </div>
              )}

              {activeTab === "digital" && (
                <DigitalPayment
                  itemId={itemId}
                  cursoId={cursoId}
                  horarioId={horarioId}
                  itemNome={itemNome}
                  valor={valor}
                  onSuccess={() => {
                    toast.success("Pagamento efetuado!");
                    onClose();
                  }}
                />
              )}

              {activeTab === "transfer" && (
                <>
                  <TransferPayment
                    itemId={itemId}
                    cursoId={cursoId}
                    horarioId={horarioId}
                    itemNome={itemNome}
                    onSuccess={() => {
                      toast.success("Comprovativo enviado!");
                      onClose();
                    }}
                  />
                  <BankInfo valor={valor.toLocaleString("pt-MZ")} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}