// components/payment/BankInfo.tsx
import { CreditCard } from "lucide-react";

interface BankInfoProps {
  valor: string;
}

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

export default function BankInfo({ valor }: BankInfoProps) {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <CreditCard className="w-5 h-5" />
        Dados para Transferência Bancária
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(methods).map(([key, bank]) => (
          <div
            key={key}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
              {bank.name}
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Conta:
                </span>{" "}
                <span className="text-gray-900 dark:text-white font-mono">
                  {bank.conta}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  NIB:
                </span>{" "}
                <span className="text-gray-900 dark:text-white font-mono">
                  {bank.nib}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Titular:
                </span>{" "}
                <span className="text-gray-900 dark:text-white">
                  {bank.titular}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <CreditCard className="w-5 h-5" />
          Como pagar usando Emola:
        </h4>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">1.</span>
            Digite *898# no seu telemóvel
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">2.</span>
            Selecione a opção 9 → Pagamentos
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">3.</span>
            Escolha a opção 1 → Comerciante
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">4.</span>
            Digite o ID do comerciante:{" "}
            <strong className="text-blue-900 dark:text-blue-100">801335</strong>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">5.</span>
            Insira o valor:{" "}
            <strong className="text-blue-900 dark:text-blue-100">{valor} MT</strong>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">6.</span>
            No campo conteúdo digite:{" "}
            <strong className="text-blue-900 dark:text-blue-100">Graduacao</strong>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[20px]">7.</span>
            Confirme: Unitec Moçambique US
          </div>
        </div>
      </div>
    </div>
  );
}