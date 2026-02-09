// app/components/PromocoesBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, ArrowRight, Percent, Zap } from "lucide-react";
import { getItensFinanceiros, calcularValorComDesconto } from "../../../lib/inscricao-actions";
import Link from "next/link";

const PROMO_STORAGE_KEY = "promo_modal_shown";

interface PromocaoItem {
  tipo: string;
  desconto: number; // em decimal (ex: 1 = 100%, 0.5 = 50%)
  descontoPercentual: number; // em percentual (ex: 100, 50)
  valorOriginal: number;
  valorComDesconto: number;
  descricao: string;
}

export default function PromocoesBanner() {
  const [showModal, setShowModal] = useState(false);
  const [promocoes, setPromocoes] = useState<PromocaoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarPromocoes();
  }, []);

  const verificarPromocoes = async () => {
    try {
      setLoading(true);
      const itens = await getItensFinanceiros();
      
      // Filtrar itens com desconto > 0
      const itensComDesconto = itens.filter(item => item.descontPercentual > 0);
      
      if (itensComDesconto.length === 0) {
        return;
      }

      // Converter para formato de promoções
      const promocoesFormatadas: PromocaoItem[] = itensComDesconto.map(item => ({
        tipo: formatarTipoItem(item.tipoItem),
        desconto: item.descontPercentual, // mantém o decimal (1, 0.5, etc.)
        descontoPercentual: item.descontPercentual * 100, // converte para percentual (100, 50, etc.)
        valorOriginal: item.valor,
        valorComDesconto: calcularValorComDesconto(item.valor, item.descontPercentual),
        descricao: item.descricao
      }));

      setPromocoes(promocoesFormatadas);
      
      // Verificar se já foi mostrado recentemente
      const lastShown = localStorage.getItem(PROMO_STORAGE_KEY);
      const now = new Date().getTime();
      
      if (!lastShown || (now - parseInt(lastShown)) > 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          setShowModal(true);
          localStorage.setItem(PROMO_STORAGE_KEY, now.toString());
        }, 2000); // Mostrar após 2 segundos
      }
    } catch (error) {
      console.error("Erro ao verificar promoções:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarTipoItem = (tipo: string): string => {
    switch (tipo) {
      case 'inscricao': return 'Inscrição';
      case 'matricula': return 'Matrícula';
      case 'mensalidade': return 'Mensalidade';
      default: return tipo;
    }
  };

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 2
    });
  };

  const calcularEconomiaTotal = (): number => {
    return promocoes.reduce((total, promo) => {
      return total + (promo.valorOriginal - promo.valorComDesconto);
    }, 0);
  };

  const handleFecharModal = () => {
    setShowModal(false);
  };

  const handleProsseguir = () => {
    setShowModal(false);
    // Scroll para a seção de pagamentos se existir
    const pagamentosSection = document.getElementById('pagamentos');
    if (pagamentosSection) {
      pagamentosSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || promocoes.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleFecharModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl">
              <div className="relative bg-gradient-to-br from-brand-main to-brand-lime rounded-3xl overflow-hidden shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20" />
                
                <div className="relative p-8 md:p-10">
                  {/* Close button */}
                  <button
                    onClick={handleFecharModal}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Promoção Especial!
                      </h2>
                      <p className="text-white/90 text-lg">
                        Descontos imperdíveis disponíveis por tempo limitado
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {promocoes.length}
                      </div>
                      <div className="text-white/80 text-sm">
                        Itens com desconto
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {Math.max(...promocoes.map(p => p.descontoPercentual))}%
                      </div>
                      <div className="text-white/80 text-sm">
                        Maior desconto
                      </div>
                    </div>
                    {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatarMoeda(calcularEconomiaTotal())}
                      </div>
                      <div className="text-white/80 text-sm">
                        Economia total
                      </div>
                    </div> */}
                  </div>

                  {/* Promoções list */}
                  <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2">
                    {promocoes.map((promo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/15 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-brand-main/80 to-brand-lime/80 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {promo.tipo}
                            </h3>
                            <p className="text-white/70 text-sm">
                              {promo.descricao}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {promo.descontoPercentual === 100 ? (
                              <span className="text-lg font-bold text-brand-lime">
                                GRATUITO
                              </span>
                            ) : (
                              <span className="text-lg font-bold text-white">
                                {formatarMoeda(promo.valorComDesconto)}
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gradient-to-r from-brand-main to-brand-lime text-white text-xs font-medium rounded-full">
                              -{promo.descontoPercentual}%
                            </span>
                          </div>
                          <div className="text-white/60 text-sm line-through">
                            {formatarMoeda(promo.valorOriginal)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleFecharModal}
                      className="flex-1 py-4 px-6 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors text-center"
                    >
                      Ver mais tarde
                    </button>
                    <Link href="/cursos" className="flex-1">
                    <button
                      onClick={handleProsseguir}
                      className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-white to-white/90 hover:from-white hover:to-white text-brand-main font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Aproveitar promoção
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    </Link>
                  </div>

                  {/* Timer */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                      <Tag className="w-4 h-4 text-white" />
                      <span className="text-white/80 text-sm">
                        Oferta válida por 24 horas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent via-white/10 to-transparent transform rotate-45 translate-x-12 -translate-y-12" />
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}