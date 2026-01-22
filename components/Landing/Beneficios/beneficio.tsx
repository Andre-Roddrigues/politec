'use client';

import { CheckCircle, Users, Briefcase, Award, Clock, Building } from 'lucide-react';

export default function Beneficios() {
  const beneficios = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certificação Reconhecida",
      description: "Certificados válidos pelo Catálogo Nacional de Qualificações Profissionais da ANEP.",
      features: ["Reconhecimento nacional", "Padrão de qualidade"]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Estágio Garantido",
      description: "Experiência profissional em empresas parceiras durante a formação.",
      features: ["Empresas parceiras", "Acompanhamento tutorial"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professores Especialistas",
      description: "Corpo docente com experiência prática no mercado de trabalho.",
      features: ["Profissionais ativos", "Metodologia prática"]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horários Flexíveis",
      description: "Opções de horários laboral (manhã) para melhor se adaptar à sua rotina.",
      features: ["Turno da manhã", "Flexibilidade"]
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Material Didático",
      description: "Acesso a material de estudo atualizado e uniforme escolar identificado.",
      features: ["Manual do curso", "Uniforme completo"]
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Infraestrutura Moderna",
      description: "Laboratórios equipados e salas de aula climatizadas para melhor aprendizagem.",
      features: ["Laboratórios técnicos", "Ambiente climatizado"]
    }
  ];

  const stats = [
    { value: "90%", label: "Taxa de Empregabilidade" },
    { value: "+5.000", label: "Alunos Formados" },
    { value: "+20", label: "Cursos Disponíveis" },
    { value: "100%", label: "Certificação Garantida" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-main/5 via-white to-brand-lime/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-main/10 to-brand-lime/10 border border-brand-main/20 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-brand-main">VANTAGENS EXCLUSIVAS</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Benefícios <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">Exclusivos</span>
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Formação de qualidade com vantagens que fazem a diferença na sua carreira profissional
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-brand-main/30 hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-brand-main/10 to-brand-lime/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-brand-main">
                  {beneficio.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-main transition-colors">
                {beneficio.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {beneficio.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {beneficio.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-brand-lime rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="mt-16 bg-gradient-to-r from-brand-main/10 to-brand-lime/10 rounded-2xl p-6 md:p-8 border border-brand-main/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Condições de Pagamento
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-main mb-2">11x</div>
              <div className="text-gray-600">Prestações Anuais</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-main mb-2">25-05</div>
              <div className="text-gray-600">Prazo de Pagamento</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-main mb-2">5%</div>
              <div className="text-gray-600">IVA Incluído</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-main mb-2">15-30%</div>
              <div className="text-gray-600">Multa por Atraso</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}