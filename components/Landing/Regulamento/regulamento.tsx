'use client';

import { 
  FileText, 
  Shield, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  UserCheck, 
  DollarSign, 
  Ban, 
  ChevronDown,
  Download,
  FileCheck,
  CheckCircle2,
  BookMarked,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';

export default function NossoRegulamento() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'regulamento' | 'termos'>('regulamento');

  const regulamentos = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Âmbito do Regulamento",
      description: "Aplica-se a todos os estudantes regularmente inscritos no POLITEC",
      fullText: "O presente regulamento aplica-se a todos os estudantes regularmente inscritos no POLITEC, estabelecendo as normas de funcionamento dos cursos técnicos profissionais."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Inscrição e Matrícula",
      description: "Processo de validação da inscrição e matrícula anual",
      fullText: "A inscrição só é válida após: (i) pagamento da taxa de matrícula/inscrição; (ii) pagamento de pelo menos uma prestação da propina; (iii) entrega completa da documentação exigida, devidamente autenticada (documento de identificação e certificado de habilitações). A matrícula é anual e depende da situação académica e financeira regular."
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: "Cancelamento ou Adiamento",
      description: "Direito do POLITEC em ajustar cursos conforme necessidade",
      fullText: "O POLITEC reserva-se o direito de adiar ou cancelar cursos caso não seja atingido o número mínimo de estudantes matriculados, garantindo sempre a qualidade da formação."
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Avaliação e Diagnóstico",
      description: "Teste de diagnóstico e módulos de reforço quando necessário",
      fullText: "O estudante poderá ser submetido a um teste de diagnóstico para avaliação dos conhecimentos iniciais. A reprovação não impede a frequência do curso, podendo implicar a participação obrigatória em módulos de reforço para garantir o sucesso académico."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Deveres do Estudante",
      description: "Responsabilidades e conduta esperada dos estudantes",
      fullText: "Constituem deveres do estudante: cumprir o regulamento interno, respeitar docentes, funcionários e colegas, manter conduta adequada em todas as instalações, usar obrigatoriamente o uniforme escolar identificado com o logotipo do POLITEC e zelar pelo património institucional."
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Regime Financeiro",
      description: "Normas de pagamento e condições financeiras",
      fullText: "As propinas são pagas em 11 prestações anuais. O prazo normal de pagamento decorre entre os dias 25 e 05 de cada mês. Do dia 06 ao dia 15 aplica-se multa de 15% e, a partir do dia 16, multa de 30%. A todos os valores acresce IVA à taxa legal de 5%."
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: "Incumprimento",
      description: "Consequências do não pagamento das propinas",
      fullText: "O não pagamento das propinas implica a suspensão da inscrição e o impedimento de praticar actos académicos, bem como de obter certificação ou informação académica até regularização da situação financeira."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Desistência",
      description: "Política sobre desistência do curso",
      fullText: "A desistência do estudante não confere direito à devolução de quaisquer valores pagos, independentemente do momento em que ocorra a desistência."
    }
  ];

  const termos = [
    "O curso integra o Catálogo Nacional de Qualificações Profissionais da ANEP",
    "O estudante poderá ser submetido a um teste de diagnóstico para avaliação dos conhecimentos iniciais",
    "O POLITEC reserva-se o direito de adiar ou cancelar o curso caso não seja atingido o número mínimo de estudantes",
    "A inscrição só é válida após pagamento da taxa de matrícula/inscrição e entrega da documentação",
    "É obrigatório o uso do uniforme escolar identificado com o logotipo do POLITEC",
    "As propinas são pagas em 11 prestações anuais, entre os dias 25 e 05 de cada mês",
    "Pagamentos fora do prazo estão sujeitos a multas de acordo com o regulamento",
    "A todos os valores pagos acresce IVA à taxa legal de 5%"
  ];

  const downloadFile = (type: 'regulamento' | 'formulario') => {
    toast.success(`Download do ${type === 'regulamento' ? 'Regulamento' : 'Formulário'} iniciado!`);
    // Aqui você pode implementar a lógica de download real
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50/50">
      {/* Header com gradiente */}
      <div className="relative">
        <div className="absolute inset-0  h-32 md:h-40"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
          <div className="text-center py-8 md:py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-brand-main to-brand-lime mb-6">
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-700 mb-4">
              Normas e <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">Regulamentos</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Conheça as regras e condições que regem sua formação no POLITEC
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Tabs de navegação */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8 md:mb-12">
          <button
            onClick={() => setActiveTab('regulamento')}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'regulamento'
                ? 'bg-gradient-to-r from-brand-main to-brand-lime text-white shadow-lg shadow-brand-main/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <BookMarked className="w-5 h-5" />
            Regulamento Interno
          </button>
          <button
            onClick={() => setActiveTab('termos')}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'termos'
                ? 'bg-gradient-to-r from-brand-main to-brand-lime text-white shadow-lg shadow-brand-main/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <Shield className="w-5 h-5" />
            Termos e Condições
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna esquerda - Regulamentos */}
          {activeTab === 'regulamento' ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Regulamento Interno</h2>
                <p className="text-gray-600">Conheça todas as normas que regem sua jornada académica</p>
              </div>
              
              <div className="space-y-3">
                {regulamentos.map((item, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                      expanded === index 
                        ? 'border-brand-main/40 shadow-lg shadow-brand-main/5' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => setExpanded(expanded === index ? null : index)}
                      className="w-full p-5 text-left flex items-start gap-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        expanded === index 
                          ? 'bg-gradient-to-br from-brand-main to-brand-lime text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 mt-1 ${
                            expanded === index ? 'rotate-180' : ''
                          }`} />
                        </div>
                        
                        {expanded === index && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{item.fullText}</p>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Coluna esquerda - Termos e Condições
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Termos e Condições</h2>
                <p className="text-gray-600">Informações essenciais sobre sua formação</p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="space-y-4">
                  {termos.map((termo, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-main/20 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-main/10 to-brand-lime/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-brand-main" />
                      </div>
                      <p className="text-gray-700 flex-1">{termo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Coluna direita - Informações complementares */}
          <div>
            <div className="sticky top-14 space-y-6">
              {/* Card de resumo */}
              <div className="bg-white rounded-2xl border-gray-200 shadow-sm p-6 text-white">
                <h3 className="text-xl text-gray-900 font-bold mb-4 flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-brand-lime" />
                  Resumo das Normas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-lime"></div>
                    <span className="text-gray-500">8 artigos do regulamento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-lime"></div>
                    <span className="text-gray-500">8 termos essenciais</span>
                  </div>
                  {/* <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-lime"></div>
                    <span className="text-gray-500">Documentação disponível para download</span>
                  </div> */}
                </div>
              </div>

              {/* Card de declaração */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Declaração</h3>
                <p className="text-gray-600 mb-6">
                  Ao realizar a inscrição, o estudante declara que leu e aceita integralmente os termos e condições aqui apresentados, comprometendo-se a cumpri-los durante toda a sua formação.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Documento legalmente válido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Download */}
        {/* <div className="mt-12 md:mt-16 bg-gradient-to-r from-brand-main via-brand-main to-brand-lime rounded-2xl p-8 md:p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Documentação Completa</h3>
                <p className="text-white/90 mb-2">
                  Baixe toda a documentação oficial do POLITEC
                </p>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <FileText className="w-4 h-4" />
                  <span>Documentos atualizados em {new Date().getFullYear()}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => downloadFile('regulamento')}
                  className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Regulamento (PDF)
                </button>
                
                <button 
                  onClick={() => downloadFile('formulario')}
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <FileText className="w-5 h-5" />
                  Formulário (PDF)
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Aviso Legal */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            As informações aqui apresentadas estão sujeitas a atualizações. Para informações mais recentes, consulte a secretaria do POLITEC.
          </p>
        </div>
      </div>
    </section>
  );
}

// Helper function para toast (simplificado)
const toast = {
  success: (message: string) => {
    console.log('Toast:', message);
    // Aqui você pode integrar com sua biblioteca de toast favorita
  }
};