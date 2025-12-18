"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Versão compacta do componente
const CompactPaymentMethods = () => {
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
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentMethod = methods[selectedMethod as keyof typeof methods];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Seletor de Método */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(methods).map(([key, method]) => (
          <button
            key={key}
            onClick={() => setSelectedMethod(key)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedMethod === key
                ? "bg-brand-main text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {method.name}
          </button>
        ))}
      </div>

      {/* Dados da Conta */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="space-y-3">
          {[
            { label: "Conta", value: currentMethod.conta, field: "conta" },
            { label: "NIB", value: currentMethod.nib, field: "nib" },
            { label: "Titular", value: currentMethod.titular, field: "titular" },
          ].map(({ label, value, field }) => (
            <div key={field} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm">{value}</code>
                <button
                  onClick={() => copyToClipboard(value, field)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passos */}
      <div className="text-sm space-y-2">
        <h4 className="font-semibold mb-2">Como pagar:</h4>
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>Digite *898#</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>Opção 9 → Pagamentos</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>Opção 1 → Comerciante</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>ID: <strong>801335</strong></span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">5.</span>
            <span>Valor do curso</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">6.</span>
            <span>Conteúdo: <strong>Inscricao</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};