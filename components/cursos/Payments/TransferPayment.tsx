"use client";

import { useState } from "react";
import { Upload, File, Loader2 } from "lucide-react";
import { createTransferPayment } from "../../../lib/Payments-actions";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface TransferPaymentProps {
  itemId: string;
  cursoId: string;
  horarioId: string;
  itemNome: "inscricao" | "mensalidade" | "curso" | "matricula";
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
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Por favor, selecione um comprovativo", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    // Verificar tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5MB", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    // Verificar tipo do arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de arquivo inválido. Use JPG, PNG ou PDF", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    setLoading(true);

    try {
      await createTransferPayment({
        itemId,
        cursoId,
        horarioId,
        itemNome,
        metodoPagamento: "transferencia",
        file,
      });

      // Sucesso
      toast.success("Comprovativo enviado com sucesso! Aguarde a confirmação.", {
        duration: 5000,
        position: "top-right",
        icon: '✅',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });

      // Limpar formulário
      setFile(null);
      
      // Chamar callback de sucesso
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }

    } catch (err: any) {
      console.error("Erro no envio:", err);
      
      // Erro específico ou genérico
      const errorMessage = err.message || "Erro ao enviar comprovativo. Tente novamente.";
      
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Verificar tamanho
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5MB", {
        duration: 4000,
        position: "top-right",
      });
      e.target.value = ''; // Limpar input
      return;
    }

    // Verificar tipo
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Formato de arquivo inválido. Use JPG, PNG ou PDF", {
        duration: 4000,
        position: "top-right",
      });
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    
    // Feedback de arquivo selecionado
    toast.success(`Arquivo "${selectedFile.name}" selecionado`, {
      duration: 2000,
      position: "top-right",
      icon: '📎',
    });
  };

  const handleRemoveFile = () => {
    if (file) {
      toast.success("Arquivo removido", {
        duration: 2000,
        position: "top-right",
      });
    }
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-green-800 dark:text-green-300">
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-lg">Transferência Bancária</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Envie o comprovativo da sua transferência
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Comprovativo de Transferência
          </label>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-green-500 dark:hover:border-green-500 transition-colors bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50">
            {file ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <File className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Remover arquivo
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Arraste ou selecione um arquivo
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG ou PDF (Max. 5MB)
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-medium inline-block transition-all"
                  >
                    Selecionar arquivo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            Instruções importantes:
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Faça a transferência para nossa conta bancária</li>
            <li>• Capture o comprovativo ou faça download</li>
            <li>• Envie através deste formulário</li>
            <li>• Aguarde a confirmação por email (24-48h)</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="font-semibold">Enviar Comprovativo</span>
            </>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Seus dados estão protegidos por criptografia
        </div>
      </div>
    </div>
  );
}