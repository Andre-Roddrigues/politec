"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Building, Upload, Check, Copy, CreditCard, X, Award } from "lucide-react";
import toast from "react-hot-toast";
import { CerticadosUnitec, getCerticadosUnitec } from "../../lib/certificado-payments-actions";
import { efectuarPagamento } from "../../lib/pagamento-actions";

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
    emola: {
      name: "Emola",
      conta: "0014102004789",
      nib: "000200141410200478905",
      titular: "Unitec Moçambique Lda.",
    },
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field.toUpperCase()} copiado!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentMethod = methods[selectedMethod as keyof typeof methods];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Dados Bancários
        </h4>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Object.entries(methods).map(([key, method]) => (
            <button
              key={key}
              onClick={() => setSelectedMethod(key)}
              className={`px-4 py-3 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                selectedMethod === key
                  ? "bg-brand-main text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {method.name}
            </button>
          ))}
        </div>
      </div>

      {selectedMethod !== "emola" && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dados para Transferência
          </h5>
          <div className="space-y-3">
            {[
              { label: "Número da Conta", value: currentMethod.conta, field: "conta" },
              { label: "NIB", value: currentMethod.nib, field: "nib" },
              { label: "Titular da Conta", value: currentMethod.titular, field: "titular" },
            ].map(({ label, value, field }) => (
              <div key={field} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded border">
                    {value}
                  </code>
                  <button
                    onClick={() => copyToClipboard(value, field)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={`Copiar ${label}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMethod === "emola" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <CreditCard className="w-5 h-5" />
            Como pagar usando Emola:
          </h4>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">1.</span>Digite *898# no seu telemóvel</div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">2.</span>Selecione a opção 9 → Pagamentos</div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">3.</span>Escolha a opção 1 → Comerciante</div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">4.</span>Digite o ID do comerciante: <strong className="text-blue-900 dark:text-blue-100">801335</strong></div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">5.</span>Insira o valor: <strong className="text-blue-900 dark:text-blue-100">{valor} MT</strong></div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">6.</span>No campo conteúdo digite: <strong className="text-blue-900 dark:text-blue-100">Certificado</strong></div>
            <div className="flex gap-2"><span className="font-bold min-w-[20px]">7.</span>Confirme: Unitec Moçambique US</div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ModalPagamentoCertificadoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalPagamentoCertificado: React.FC<ModalPagamentoCertificadoProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const [certificado, setCertificado] = useState<CerticadosUnitec | null>(null);
  const [metodo, setMetodo] = useState<"mpesa" | "transferencia">("mpesa");
  const [numero, setNumero] = useState("");
  const [comprovativo, setComprovativo] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [numeroErro, setNumeroErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificado = async () => {
      try {
        const data = await getCerticadosUnitec();
        if (data?.length) setCertificado(data[0]);
      } catch (error) {
        toast.error("Erro ao carregar dados do certificado");
      }
    };
    
    if (isOpen) {
      fetchCertificado();
    }
  }, [isOpen]);

  const validarNumero = (valor: string) => /^(84|85)\d{7}$/.test(valor);

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
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
      toast.error("Formato inválido. Apenas PDF, PNG ou JPG.");
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
    toast.success("Comprovativo anexado com sucesso!");
  };

  const handleConfirm = async () => {
    if (!certificado) return;

    if (metodo === "mpesa" && !validarNumero(numero)) {
      toast.error("Número inválido. Use formato 84XXXXXXX ou 85XXXXXXX");
      return;
    }

    if (metodo === "transferencia" && !comprovativo) {
      toast.error("Por favor, anexe o comprovativo de transferência");
      return;
    }

    setLoading(true);
    try {
      const result = await efectuarPagamento({
        metodoPagamento: metodo,
        itemId: certificado.id,
        itemNome: "certificado",
        comprovativo: metodo === "transferencia" ? comprovativo! : undefined,
        phoneNumber: metodo === "mpesa" ? numero : undefined,
      });

      if (result.success) {
        toast.success("Pagamento do certificado processado com sucesso!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Erro ao processar pagamento do certificado.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar pagamento do certificado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!certificado && isOpen) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-10 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-brand-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando dados do Certificado...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-main rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Pagar Certificado
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Emissão de Certificado Digital</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="text-left p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl mb-8">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Valor do Certificado</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">{certificado?.preco} MT</p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Escolha o Método de Pagamento</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setMetodo("mpesa")}
                          className={`p-6 rounded-xl border-2 flex flex-col items-center transition-all ${
                            metodo === "mpesa" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                          }`}
                        >
                          <Smartphone className={`w-8 h-8 mb-2 ${metodo === "mpesa" ? "text-purple-500" : "text-gray-500"}`} />
                          <span className="font-medium">M-pesa</span>
                          <span className="text-xs text-gray-500 mt-1">Pagamento rápido e seguro</span>
                        </button>

                        <button
                          onClick={() => setMetodo("transferencia")}
                          className={`p-6 rounded-xl border-2 flex flex-col items-center transition-all ${
                            metodo === "transferencia" ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                          }`}
                        >
                          <Building className={`w-8 h-8 mb-2 ${metodo === "transferencia" ? "text-green-500" : "text-gray-500"}`} />
                          <span className="font-medium">Transferência Bancária</span>
                          <span className="text-xs text-gray-500 mt-1">Via banco ou Emola</span>
                        </button>
                      </div>
                    </div>

                    {metodo === "transferencia" && <CompactPaymentMethods valor={certificado?.preco || 0} />}

                    <div className="space-y-6">
                      {metodo === "mpesa" && (
                        <div>
                          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Número do Telefone M-pesa
                          </label>
                          <input
                            type="tel"
                            value={numero}
                            onChange={handleNumeroChange}
                            placeholder="84XXXXXXX ou 85XXXXXXX"
                            maxLength={9}
                            className={`w-full pl-4 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg ${
                              numeroErro
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
                            }`}
                          />
                          {numeroErro && (
                            <p className="text-sm text-red-500 mt-2">{numeroErro}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Certifique-se que tem saldo suficiente no seu M-pesa
                          </p>
                        </div>
                      )}

                      {metodo === "transferencia" && (
                        <div>
                          <label className="block mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Anexar Comprovativo de Transferência
                          </label>
                          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-800">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-12 h-12 text-gray-400 mb-3" />
                              <p className="text-base text-gray-500 dark:text-gray-400">
                                Clique para enviar o comprovativo
                              </p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                PNG, JPG, PDF (Máximo 5MB)
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
                            <div className="mt-3 flex items-center text-base text-green-600 dark:text-green-400">
                              <Check className="w-5 h-5 mr-2" />
                              <span className="truncate">{fileName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={handleConfirm}
                        disabled={loading || 
                          (metodo === "mpesa" && (!!numeroErro || !numero)) ||
                          (metodo === "transferencia" && !comprovativo)
                        }
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processando Pagamento...
                          </div>
                        ) : (
                          `Emitir Certificado - ${certificado?.preco} MT`
                        )}
                      </button>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Certificado emitido em 24 horas após confirmação do pagamento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-left">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Benefícios do Certificado
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <li>• Certificado válido nacionalmente</li>
                      <li>• Reconhecimento por empregadores</li>
                      <li>• Validade permanente</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                      Informações Importantes
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <li>• Certificado emitido em 24 horas úteis</li>
                      <li>• Dúvidas? Contacte: +258 870088787</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalPagamentoCertificado;