"use client";

import React, { useState } from "react";
import { X, Smartphone, Building, Upload, Check, CreditCard, Copy } from "lucide-react";
import toast from "react-hot-toast";

type ModalPagamentoProps = {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  valor: number;
  onConfirm: (dados: {
    metodo: string;
    numero?: string;
    comprovativo?: File;
  }) => Promise<void>;
};

// Componente CompactPaymentMethods integrado
const CompactPaymentMethods = ({ valor }: { valor: number }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("mbim");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const methods = {
    mbim: {
      name: "Millennium BIM",
      conta: "1024762418",
      nib: "000100000102476241857",
      titular: "Unitec Moçambique Lda.",
    },
    bci: {
      name: "BCI",
      conta: "25418442710001",
      nib: "000800005418442710113",
      titular: "Unitec Moçambique Lda.",
    },
    absa: {
      name: "ABSA",
      conta: "0014102004789",
      nib: "000200141410200478905",
      titular: "Unitec Moçambique Lda.",
    },
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentMethod = methods[selectedMethod as keyof typeof methods];

  return (
    <div className="space-y-4">
      {/* Seletor de Método */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dados Bancários
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(methods).map(([key, method]) => (
            <button
              key={key}
              onClick={() => setSelectedMethod(key)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap text-xs transition-all ${
                selectedMethod === key
                  ? "bg-brand-main text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {method.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dados da Conta */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="space-y-2">
          {[
            { label: "Conta", value: currentMethod.conta, field: "conta" },
            { label: "NIB", value: currentMethod.nib, field: "nib" },
            { label: "Titular", value: currentMethod.titular, field: "titular" },
          ].map(({ label, value, field }) => (
            <div key={field} className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">{label}:</span>
              <div className="flex items-center gap-1">
                <code className="font-mono text-xs  dark:bg-gray-700 px-1 rounded">
                  {value}
                </code>
                <button
                  onClick={() => copyToClipboard(value, field)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs"
                  title="Copiar"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passos para Pagamento */}
      <div className="text-xs space-y-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <h4 className="font-semibold mb-1 flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Como pagar usando Emola:
        </h4>
        <div className="space-y-1">
          <div className="flex gap-1">
            <span className="font-semibold">1.</span>
            <span>Digite *898#</span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">2.</span>
            <span>Opção 9 → Pagamentos</span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">3.</span>
            <span>Opção 1 → Comerciante</span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">4.</span>
            <span>ID: <strong>801335</strong></span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">5.</span>
            <span>Digite o valor: <strong>{valor} MT</strong></span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">6.</span>
            <span>Conteúdo: <strong>Inscricao</strong></span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">7.</span>
            <span>Confirme Unitec Moçambique US</span>
          </div>
        </div>
        <p className="font-semibold mt-2 text-blue-600 dark:text-blue-400">
          Bons estudos! Aproveite o seu aprendizado!
        </p>
      </div>
    </div>
  );
};

const ModalPagamento: React.FC<ModalPagamentoProps> = ({
  isOpen,
  onClose,
  titulo,
  valor,
  onConfirm,
}) => {
  const [metodo, setMetodo] = useState<"mpesa" | "transferencia">("mpesa");
  const [numero, setNumero] = useState("");
  const [comprovativo, setComprovativo] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [numeroErro, setNumeroErro] = useState<string | null>(null);

  const validarNumero = (valor: string) => {
    const regex = /^(84|85)\d{7}$/;
    return regex.test(valor);
  };

  const handleConfirm = async () => {
    if (metodo === "mpesa" && !validarNumero(numero)) {
      toast.error("Número inválido. Use formato 84XXXXXXX ou 85XXXXXXX");
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        metodo,
        numero: numero || undefined,
        comprovativo: comprovativo || undefined,
      });

      // Mantém o modal aberto por 3 segundos antes de fechar
      setTimeout(() => {
        onClose();

        // Reset campos
        setNumero("");
        setComprovativo(null);
        setFileName("");
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      setLoading(false);
    }
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // apenas dígitos
    setNumero(value);
    if (value && !validarNumero(value)) {
      setNumeroErro("Número deve começar por 84/85 e ter 9 dígitos.");
    } else {
      setNumeroErro(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato inválido. apenas PDF, PNG ou JPG.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo permitido: 5MB.");
      e.target.value = "";
      return;
    }

    setComprovativo(file);
    setFileName(file.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl relative transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Finalizar Pagamento
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Valor */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor a pagar</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {valor} MT
          </p>
        </div>

        {/* Métodos de Pagamento */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Métodos de Pagamento
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMetodo("mpesa")}
              className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                metodo === "mpesa"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Smartphone
                className={`w-5 h-5 ${
                  metodo === "mpesa" ? "text-purple-500" : "text-gray-500"
                }`}
              />
              <span className="text-xs mt-1">M-pesa</span>
            </button>

            <button
              onClick={() => setMetodo("transferencia")}
              className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                metodo === "transferencia"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Building
                className={`w-5 h-5 ${
                  metodo === "transferencia"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              />
              <span className="text-xs mt-1">Transferência</span>
            </button>
          </div>
        </div>

        {/* Componente CompactPaymentMethods - aparece APENAS para transferência */}
        {metodo === "transferencia" && (
          <div className="mb-6">
            <CompactPaymentMethods valor={valor} />
          </div>
        )}

        {/* Campos de entrada baseados no método selecionado */}
        <div className="space-y-4 mb-6">
          {metodo === "mpesa" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número do Telefone
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={numero}
                  onChange={handleNumeroChange}
                  placeholder="84/85"
                  maxLength={9}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    numeroErro
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                  }`}
                />
              </div>
              {numeroErro && (
                <p className="text-xs text-red-500 mt-1">{numeroErro}</p>
              )}
            </div>
          )}

          {metodo === "transferencia" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enviar Comprovativo
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Clique para enviar o comprovativo
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    PNG, JPG, PDF (Max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
              </label>
              {fileName && (
                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  <span className="truncate">{fileName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (metodo === "mpesa" && !!numeroErro)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-60"
          >
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPagamento;
