'use client';

import { Calendar, Clock, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CTAInscricao() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Inscrições Abertas",
      description: "Matrículas para o próximo semestre"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Turmas Limitadas",
      description: "Vagas por ordem de chegada"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Pagamentos Flexíveis",
      description: "Pagamentos Seguros"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Certificação Garantida",
      description: "Reconhecimento nacional ANEP"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-main to-brand-lime relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center text-white">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Transforme sua <span className="text-brand-lime">Carreira</span> Hoje
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Inscreva-se agora e garanta sua vaga nos cursos Médios mais procurados do mercado
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
            <button className="group bg-white text-brand-main px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105">
              <span>Inscrever-se Agora</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}