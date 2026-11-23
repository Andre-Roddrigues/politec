// app/editais/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Printer, Download, Calendar, BookOpen, Clock, FileCheck, Info, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getItensFinanceirosPorTipo } from "../../lib/inscricao-actions"; 
import { calcularValorComDescontoAPICorrigido } from "../../utils/price-calculations"; 

export default function EditalPage() {
  const [taxaInscricao, setTaxaInscricao] = useState<number | null>(null);
  const [taxaMatricula, setTaxaMatricula] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar os preços dinâmicos da API
  useEffect(() => {
    async function fetchPrecos() {
      try {
        const [inscricoes, matriculas] = await Promise.all([
          getItensFinanceirosPorTipo("inscricao"),
          getItensFinanceirosPorTipo("matricula"),
        ]);

        // Pega o item mais recente (assumindo que a API devolve ordenado ou ordenamos aqui)
        if (inscricoes.length > 0) {
          const recente = inscricoes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          const valorComDesconto = calcularValorComDescontoAPICorrigido(recente.valor, recente.descontPercentual);
          setTaxaInscricao(valorComDesconto);
        }

        if (matriculas.length > 0) {
          const recente = matriculas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          const valorComDesconto = calcularValorComDescontoAPICorrigido(recente.valor, recente.descontPercentual);
          setTaxaMatricula(valorComDesconto);
        }
      } catch (error) {
        console.error("Erro ao carregar taxas:", error);
        // Fallback caso a API falhe
        setTaxaInscricao(1400);
        setTaxaMatricula(990);
      } finally {
        setLoading(false);
      }
    }
    fetchPrecos();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatarMT = (valor: number | null) => {
    if (valor === null) return "...";
    return `${valor.toLocaleString("pt-MZ")} MT`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Botões de Ação (Escondidos na impressão) */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-main text-white font-medium rounded-xl hover:bg-brand-main/90 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Baixar PDF
          </button>
        </div>

        {/* Documento do Edital */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-none"
        >
          {/* Cabeçalho */}
          <div className="bg-brand-main p-8 sm:p-12 text-center text-white relative overflow-hidden print:bg-white print:text-black print:border-b print:border-gray-300 print:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 print:hidden"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 print:hidden"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase mb-2">
                Edital de Inscrições
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-white/90 print:text-gray-600 mb-4">
                Ano Lectivo 2027
              </h2>
              <p className="text-sm sm:text-base text-white/80 print:text-gray-500 uppercase tracking-widest font-medium">
                POLITEC - Instituto Politécnico Unitec
              </p>
            </div>
          </div>

          {/* Corpo do Edital */}
          <div className="p-8 sm:p-12 space-y-10 text-gray-700 print:p-8">
            
            {/* Introdução */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-600 print:text-sm">
              O Instituto Politécnico Unitec (POLITEC) torna público o presente Edital de Inscrições para os Cursos Técnicos de Nível Médio, a iniciar no ano lectivo de 2027.
            </p>

            {/* 1. Período */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <Calendar className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">1. Período de Inscrições</h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 print:bg-white print:border-gray-300 print:p-3">
                <p className="text-green-800 font-bold text-lg mb-2 print:text-black print:text-base">
                  Inscrição e Matrícula GRÁTIS até 18 de Dezembro de 2026
                </p>
                <div className="text-gray-700 print:text-sm flex flex-wrap items-center gap-1">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> A calcular taxas...
                    </span>
                  ) : (
                    <span>
                      Período normal de inscrição até 22 de Janeiro de 2027: <strong>Taxa: {formatarMT(taxaInscricao)} + {formatarMT(taxaMatricula)} de Matrícula.</strong>
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* 2. Cursos */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <BookOpen className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">2. Cursos Disponíveis</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-main pl-4 py-1 print:border-black">
                  <h4 className="font-bold text-gray-900 text-lg print:text-base">Administração e Gestão – 3.360 MT/Mês</h4>
                  <p className="text-gray-600 text-sm mt-1 uppercase tracking-wide print:text-xs">Contabilidade | Gestão de Recursos Humanos | Gestão Geral</p>
                </div>
                <div className="border-l-4 border-brand-main pl-4 py-1 print:border-black">
                  <h4 className="font-bold text-gray-900 text-lg print:text-base">Tecnologias de Informação – 3.780 MT/Mês</h4>
                  <p className="text-gray-600 text-sm mt-1 uppercase tracking-wide print:text-xs">Programação Web | Administração de Redes | Suporte Informático</p>
                </div>
                <div className="border-l-4 border-brand-main pl-4 py-1 print:border-black">
                  <h4 className="font-bold text-gray-900 text-lg print:text-base">Manutenção Industrial – 3.780 MT/Mês</h4>
                  <p className="text-gray-600 text-sm mt-1 uppercase tracking-wide print:text-xs">Electricidade Industrial | Mecânica de Manutenção Industrial</p>
                </div>
              </div>
            </section>

            {/* 3. Duração */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <Clock className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">3. Duração</h3>
              </div>
              <p className="text-gray-700 font-medium print:text-sm">
                3 anos, incluindo estágio – <strong>Ensino Presencial</strong>
              </p>
            </section>

            {/* 4. Requisitos */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <FileCheck className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">4. Requisitos</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 marker:text-brand-main print:marker:text-black print:text-sm">
                <li>Cópia autenticada do B.I./passaporte</li>
                <li>Cópia autenticada do certificado de habilitações da 9ª NSNE, 10ª ou 12ª classe/Equivalente</li>
                <li>2 fotografias tipo passe</li>
                <li>NUIT</li>
                <li>Valor da primeira mensalidade</li>
                <li>Camisete: 890 MT</li>
              </ul>
            </section>

            {/* 5. Períodos */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <Clock className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">5. Períodos</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 print:bg-white print:p-2 print:border-gray-300">
                  <span className="block text-sm text-gray-500 mb-1 print:text-xs">Manhã</span>
                  <span className="font-bold text-gray-900 print:text-sm">07:00 às 12:00</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 print:bg-white print:p-2 print:border-gray-300">
                  <span className="block text-sm text-gray-500 mb-1 print:text-xs">Tarde</span>
                  <span className="font-bold text-gray-900 print:text-sm">12:10 às 17:10</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 print:bg-white print:p-2 print:border-gray-300">
                  <span className="block text-sm text-gray-500 mb-1 print:text-xs">Noite</span>
                  <span className="font-bold text-gray-900 print:text-sm">17:20 às 21:30</span>
                </div>
              </div>
            </section>

            {/* 6. Outras Condições */}
            <section>
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2 print:border-gray-300">
                <Info className="w-6 h-6 text-brand-main print:text-black" />
                <h3 className="text-xl font-bold text-gray-900 print:text-lg">6. Outras Condições</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 marker:text-brand-main print:marker:text-black print:text-sm">
                <li>Uso obrigatório de uniforme.</li>
                <li>Sempre que necessário O POLITEC informará com antecedência a alteração de qualquer condição previamente anunciada.</li>
              </ul>
            </section>

            {/* Assinatura / Rodapé */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center print:mt-10 print:pt-6 print:border-gray-300">
              <p className="text-gray-600 mb-1 print:text-sm">Maputo, 16 de Novembro de 2026</p>
              <p className="text-lg font-bold text-gray-900 print:text-base">A Direcção</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-brand-main font-semibold print:text-black">
                <MapPin className="w-4 h-4" />
                <span>87 0088 688</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}