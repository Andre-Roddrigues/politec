'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroPolitec() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-main/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-brand-lime/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 md:space-y-8">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-main/20 to-brand-main/10 border border-brand-main/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-brand-lime">POLITEC INSTITUTO</span>
            </div> */}
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block">Sucesso profissional</span>
              <span className="block bg-gradient-to-r from-brand-main via-brand-main to-brand-lime bg-clip-text text-transparent">
                começa aqui
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
              Formamos os profissionais mais qualificados do mercado. 
              Cursos técnicos e profissionalizantes com metodologia prática 
              e professores especialistas para transformar sua carreira.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cursos">
              <button className="group bg-gradient-to-r from-brand-main to-brand-main/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:from-brand-main/90 hover:to-brand-main transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-main/25 hover:scale-105">
                <span>Ver Cursos</span>
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

            {/* Stats */}
            
          </div>

          {/* Right Content - Image Container */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Circle Container with Image */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                {/* Replace this with your actual image path */}
                <Image
                  src="/images/politeclogo.PNG" // Atualize com o caminho da sua imagem
                  alt="POLITEC"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-main/20 via-transparent to-brand-lime/10"></div>
                
                {/* Decorative Rings */}
                <div className="absolute inset-0 border-2 border-brand-main/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border-2 border-brand-lime/10 rounded-full animate-spin-slow-reverse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
      `}</style>
    </div>
  );
}