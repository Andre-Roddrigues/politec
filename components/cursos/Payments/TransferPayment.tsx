// components/cursos/Payments/TransferPayment.tsx
"use client";

import { useState } from "react";
import { Upload, File, Loader2 } from "lucide-react";
import { createTransferPayment } from "../../../lib/Payments-actions";

interface TransferPaymentProps {
  itemId: string;
  cursoId: string;
  horarioId: string;
  itemNome: "inscricao" | "mensalidade" | "curso";
  onSuccess?: () => void;
}

export default function TransferPayment({ 
  itemId, 
  cursoId,
  horarioId,
  itemNome, 
  onSuccess 
}: TransferPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Por favor, selecione um comprovativo");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTransferPayment({
        itemId,
        cursoId,
        horarioId,
        itemNome,
        metodoPagamento: "transferencia",
        file,
      });

      if (onSuccess) onSuccess();
      alert("Comprovativo enviado com sucesso! Aguarde a confirmação.");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar comprovativo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
        <Upload className="w-5 h-5" />
        <h4 className="font-semibold">Transferência Bancária</h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comprovativo de Transferência
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            {file ? (
              <div className="space-y-2">
                <File className="w-12 h-12 mx-auto text-blue-500" />
                <div className="font-medium text-gray-900 dark:text-white">
                  {file.name}
                </div>
                <div className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remover arquivo
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg inline-block"
                  >
                    Selecionar arquivo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG ou PDF (Max. 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Enviar Comprovativo
            </>
          )}
        </button>
      </form>
    </div>
  );
}