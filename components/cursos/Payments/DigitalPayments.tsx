// components/cursos/Payments/DigitalPayment.tsx
"use client";

import { useState } from "react";
import { Smartphone, CreditCard, Loader2 } from "lucide-react";
import { createPayment } from "../../../lib/Payments-actions";
import toast from "react-hot-toast";

interface DigitalPaymentProps {
  itemId: string;
  cursoId: string;
  horarioId: string;
  itemNome: "inscricao" | "mensalidade" | "curso";
  valor: number;
  onSuccess?: () => void;
}

export default function DigitalPayment({ 
  itemId, 
  cursoId,
  horarioId,
  itemNome, 
  valor, 
  onSuccess 
}: DigitalPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  const validatePhoneNumber = (number: string): boolean => {
    // Remove espaços e caracteres especiais
    const cleanNumber = number.replace(/\D/g, '');
    
    // Verifica se começa com 84 ou 85
    if (!cleanNumber.startsWith('84') && !cleanNumber.startsWith('85')) {
      return false;
    }
    
    // Verifica se tem exatamente 9 dígitos
    if (cleanNumber.length !== 9) {
      return false;
    }
    
    // Verifica se todos são números
    return /^\d+$/.test(cleanNumber);
  };

  const formatPhoneNumber = (input: string): string => {
    // Remove tudo que não é dígito
    let digits = input.replace(/\D/g, '');
    
    // Limita a 9 dígitos
    digits = digits.slice(0, 9);
    
    // Adiciona a barra após o segundo dígito se tiver pelo menos 2 dígitos
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove a barra para salvar apenas os números
      const cleanPhone = phone.replace('/', '');

      // Validação adicional
      if (!validatePhoneNumber(cleanPhone)) {
        throw new Error("Número de telefone inválido. Use formato 84/85 seguido de 7 dígitos (ex: 841234567)");
      }

      await createPayment({
        itemId,
        cursoId,
        horarioId,
        itemNome,
        metodoPagamento: "mpesa",
        phoneNumber: cleanPhone,
      });

      // Sucesso - não mostra alerta aqui, o toast será mostrado no PaymentModal
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao processar pagamento";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidPhone = validatePhoneNumber(phone.replace('/', ''));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <Smartphone className="w-5 h-5" />
        <h4 className="font-semibold">Pagamento Digital - M-Pesa</h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Telefone M-Pesa
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 pl-10"
              placeholder="84/841234567"
              required
              pattern="(84|85)\/\d{7}"
              title="Formato: 84/841234567 ou 85/851234567"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              +258
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Formato: 84/841234567 ou 85/851234567 (9 dígitos no total)
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Método</span>
              <span className="font-medium text-gray-900 dark:text-white">M-Pesa</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total a pagar</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {valor.toLocaleString("pt-MZ")} MT
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="font-medium mb-1">Instruções:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Insira seu número de telefone M-Pesa</li>
            <li>Clique em "Pagar com M-Pesa"</li>
            <li>Confirme a transação no seu telefone</li>
            <li>Após confirmação, você será redirecionado</li>
          </ol>
        </div>

        <button
          type="submit"
          disabled={loading || !isValidPhone}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando pagamento...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar com M-Pesa
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Pagamento seguro e criptografado
        </div>
      </div>
    </div>
  );
}