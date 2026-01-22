'use client';

import { useState } from 'react';
import { 
  UserPlus,
  Brain,
  CreditCard,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Award,
  ChevronRight
} from 'lucide-react';

export default function ComoFunciona() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Criar Conta",
      description: "Registe-se na nossa plataforma para aceder ao sistema de inscrições.",
      icon: <UserPlus className="w-5 h-5" />,
      details: ["Criação de conta pessoal", "Acesso à área de estudante"]
    },
    {
      number: "02",
      title: "Teste Vocacional",
      op:"(opcional)",
      description: "Descubra a área profissional mais adequada ao seu perfil.",
      icon: <Brain className="w-5 h-5" />,
      details: ["Teste de aptidões", "Recomendações personalizadas"]
    },
    {
      number: "03",
      title: "Escolher Formação",
      description: "Selecione o curso e efectue o pagamento numa das nossas contas.",
      icon: <CreditCard className="w-5 h-5" />,
      details: ["Seleção do curso", "Pagamento Seguro"]
    },
    {
      number: "04",
      title: "Dashboard",
      description: "Aceda ao seu painel para gerir toda a sua inscrição e formação.",
      icon: <LayoutDashboard className="w-5 h-5" />,
      details: ["Acompanhamento do processo", "Gestão de documentos"]
    },
    {
      number: "05",
      title: "Formação",
      description: "Aulas presenciais com metodologia prática e especialistas.",
      icon: <GraduationCap className="w-5 h-5" />,
      details: ["Aulas teórico-práticas", "Material didático incluído"]
    },
    {
      number: "06",
      title: "Certificação",
      description: "Certificado reconhecido pelo Catálogo Nacional da ANEP.",
      icon: <Award className="w-5 h-5" />,
      details: ["Certificado técnico", "Diploma profissional"]
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-main/20 bg-gradient-to-r from-brand-main/5 to-brand-lime/5">
              <div className="w-1.5 h-1.5 bg-brand-main rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-brand-main tracking-wide">PROCESSO DE ADMISSÃO</span>
            </span>
          </div> */}
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4 tracking-tight">
            PROCESSO <span className="relative">
              <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">
                SIMPLES
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-main/30 to-brand-lime/30"></span>
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Um processo digital e estruturado para iniciar sua formação profissional
          </p>
        </div>

        {/* Mobile Steps Navigation */}
        <div className="md:hidden mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${activeStep === index ? 'bg-brand-main text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Top Row */}
        <div className="relative mb-8">
          {/* Desktop Timeline Line for Top Row */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-0.5 w-3/4 bg-gradient-to-r from-brand-main/10 via-brand-lime/10 to-transparent top-1/2"></div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.slice(0, 3).map((step, index) => (
              <div 
                key={step.number}
                className={`relative transition-all duration-500 ${activeStep === index ? 'md:scale-[1.02]' : 'opacity-95 hover:opacity-100'}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-brand-main/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full relative overflow-hidden group">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeStep === index ? 'opacity-100' : ''}`}></div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeStep === index ? 'bg-gradient-to-br from-brand-main to-brand-lime scale-110' : 'bg-gray-100'}`}>
                      <div className={`${activeStep === index ? 'text-white' : 'text-gray-600'}`}>
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === index ? 'bg-brand-main text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <span className="font-bold text-sm">{step.number}</span>
                      </div>
                      <div className={`h-px flex-1 ${activeStep === index ? 'bg-gradient-to-r from-brand-main to-brand-lime' : 'bg-gray-200'}`}></div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${activeStep === index ? 'text-brand-main' : 'text-gray-900'}`}>
                      {step.title} <span className="text-xl">{step.op}</span>
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-brand-lime scale-125' : 'bg-gray-300'}`}></div>
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Timeline Dot for Desktop */}
                  <div className={`hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-4 border-white transition-all duration-300 ${activeStep === index ? 'bg-brand-main scale-125' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connecting Arrows */}
        <div className="hidden md:flex justify-center items-center my-6">
          <div className="flex items-center space-x-2">
            {[1, 2].map((arrow) => (
              <div key={arrow} className="flex items-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-brand-main/10 to-brand-lime/10"></div>
                <ChevronRight className="w-5 h-5 text-brand-main/30 mx-2" />
                <div className="w-8 h-0.5 bg-gradient-to-r from-brand-main/10 to-brand-lime/10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Bottom Row */}
        <div className="relative mt-8">
          {/* Desktop Timeline Line for Bottom Row */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-0.5 w-3/4 bg-gradient-to-r from-brand-main/10 via-brand-lime/10 to-transparent top-1/2"></div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.slice(3, 6).map((step, originalIndex) => {
              const index = originalIndex + 3;
              return (
                <div 
                  key={step.number}
                  className={`relative transition-all duration-500 ${activeStep === index ? 'md:scale-[1.02]' : 'opacity-95 hover:opacity-100'}`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-brand-main/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeStep === index ? 'opacity-100' : ''}`}></div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeStep === index ? 'bg-gradient-to-br from-brand-main to-brand-lime scale-110' : 'bg-gray-100'}`}>
                        <div className={`${activeStep === index ? 'text-white' : 'text-gray-600'}`}>
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative">
                      {/* Step Indicator */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === index ? 'bg-brand-main text-white' : 'bg-gray-100 text-gray-600'}`}>
                          <span className="font-bold text-sm">{step.number}</span>
                        </div>
                        <div className={`h-px flex-1 ${activeStep === index ? 'bg-gradient-to-r from-brand-main to-brand-lime' : 'bg-gray-200'}`}></div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${activeStep === index ? 'text-brand-main' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Details */}
                      <ul className="space-y-3">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-brand-lime scale-125' : 'bg-gray-300'}`}></div>
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline Dot for Desktop */}
                    <div className={`hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-4 border-white transition-all duration-300 ${activeStep === index ? 'bg-brand-main scale-125' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        {/* <div className="mt-12 md:mt-16">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Progresso do Processo</span>
              <span className="text-sm font-semibold text-brand-main">{activeStep + 1}/{steps.length}</span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-main to-brand-lime transition-all duration-500 ease-out"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div> */}

        {/* CTA */}
        {/* <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-brand-main to-brand-main/90 text-white px-8 py-4 rounded-xl font-semibold hover:from-brand-main hover:to-brand-lime transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
            <span>Criar Minha Conta</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <p className="text-gray-500 text-sm mt-6">
            Tem alguma dúvida? <a href="#contact" className="text-brand-main font-medium hover:underline">Fale com nosso consultor</a>
          </p>
        </div> */}
      </div>
    </section>
  );
}