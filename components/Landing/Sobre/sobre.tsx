"use client";
import React, { useEffect, useState } from "react";
import { Curso, getCursos } from "../../../lib/cursos-actions";
const WhatIsPromet = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
    const [visibleCount, setVisibleCount] = useState(10);
  
   useEffect(() => {
     const fetchCursos = async () => {
       const data = await getCursos();
   
       const sortedData = data.sort((a, b) => {
     const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
     const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
     return aTime - bTime; 
   });
   
   
       setCursos(sortedData);
     };
     fetchCursos();
   }, []);
  return (
    <section id="sobre" className="relative py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="absolute top-0 right-0 -mt-16 mr-16 opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200" className="text-brand-main">
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-bgdark dark:text-white">
            O que é o <span className="text-brand-main dark:text-brand-lime">PROMET</span>?
          </h2>
          <div className="w-20 h-1 bg-brand-lime mx-auto mt-4"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="lg:w-1/2">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              O PROMET é um programa intensivo de 30 dias que oferece formação prática nas áreas 
              mais procuradas pelo mercado, conectando diretamente os participantes a empresas parceiras.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-bgdark dark:text-white">Programa intensivo de 30 dias</h3>
                  <p className="text-gray-600 dark:text-gray-400">Formação acelerada com foco na empregabilidade</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-bgdark dark:text-white">Formação prática em áreas de alta procura</h3>
                  <p className="text-gray-600 dark:text-gray-400">Conteúdos relevantes e alinhados com as necessidades do mercado</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-bgdark dark:text-white">Workshops com empresas e encaminhamento para oportunidades</h3>
                  <p className="text-gray-600 dark:text-gray-400">Conexão direta com empregadores e acesso a vagas exclusivas</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative max-w-md">
              <div className="absolute -inset-4 bg-brand-main/10 rounded-2xl rotate-3"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-brand-main/20">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-brand-main/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-brand-bgdark dark:text-white mb-4">Programa de 30 Dias</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-brand-main/5 rounded-lg">
                    <div className="text-2xl font-bold text-brand-main">{cursos.length}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Áreas</div>
                  </div>
                  <div className="text-center p-3 bg-brand-lime/5 rounded-lg">
                    <div className="text-2xl font-bold text-brand-lime">30</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dias</div>
                  </div>
                  <div className="text-center p-3 bg-brand-main/5 rounded-lg">
                    <div className="text-2xl font-bold text-brand-main">100%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Prático</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-brand-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Conexão com empresas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsPromet;