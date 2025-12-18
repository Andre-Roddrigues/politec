"use client"
import React, { useState, useEffect } from "react";
import CTAGraduacao from "./CTAGraduacao";
import Link from "next/link";

export default function GraduacaoPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            src: "/images/gr4.jpg",
            alt: "Profissional bem-sucedido"
        },
        {
            src: "/images/gr2.jpg",
            alt: "Estudantes em sala de aula"
        },
        {
            src: "/images/gr6.jpg", 
            alt: "Formatura universitária"
        },
        {
            src: "/images/gr5.jpg",
            alt: "Networking profissional"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Hero Section Motivacional */}
            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-block bg-brand-lime/20 text-brand-main px-6 py-2 rounded-full text-sm font-semibold">
                                Sua Carreira Começa Aqui
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-brand-lime/70 leading-tight">
                                A Graduação que o
                                <span className="text-brand-main"> Mercado Precisa</span>
                            </h1>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                Destaque-se no mercado de trabalho com uma formação que
                                combina conhecimento teórico e prático. Sua graduação é
                                o passaporte para oportunidades reais de crescimento profissional.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/user/perfil">
                                <button className="border-2 border-brand-main text-brand-main hover:bg-brand-main hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all">
                                    Criar Meu Perfil
                                </button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl overflow-hidden">
                                {/* Slide Container */}
                                <div className="relative h-96 rounded-2xl overflow-hidden">
                                    {slides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <img
                                                src={slide.src}
                                                alt={slide.alt}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>
                                    ))}
                                    
                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all shadow-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all shadow-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all ${
                                                    index === currentSlide 
                                                        ? 'bg-white' 
                                                        : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-lime rounded-2xl rotate-12"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-blue rounded-2xl -rotate-12"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção - Perfil para o Mercado de Trabalho */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Perfil para o Mercado de Trabalho
                        </h2>
                        <p className="text-xl text-gray-700">
                            Construa um perfil profissional que chame a atenção das melhores
                            empresas. Sua graduação é o diferencial que vai destacar seu
                            currículo no competitivo mercado actual.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-20 h-20 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-2xl">1</div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Preencha o Seu Perfil</h3>
                            <p className="text-gray-700">
                                Crie seu perfil profissional com suas formações,
                                experiências e principais competências.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-20 h-20 bg-brand-lime rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-2xl">2</div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vantagens Exclusivas</h3>
                            <p className="text-gray-700">
                                Você será integrado na nossa base de dados de talentos,
                                aumentando suas chances de ser escolhido para as melhores oportunidades
                            </p>
                        </div>

                        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-20 h-20 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="text-white font-bold text-2xl">3</div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Marque a Sua Graduação</h3>
                            <p className="text-gray-700">
                                Dê o primeiro passo rumo ao
                                sucesso profissional que você merece.
                                Garanta sua graduação e comece a construir uma carreira sólida e promissora hoje mesmo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mensagem Inspiradora */}
            <section className="py-20 bg-brand-lime text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl  font-bold mb-8">
                            Seu Futuro Profissional Espera por Você
                        </h2>
                        <p className="text-xl md:text-xl mb-8 leading-relaxed">
                            Enquanto você hesita, outras pessoas estão conquistando as vagas
                            que poderiam ser suas. A graduação não é apenas um diploma -
                            é a chave que abre portas para oportunidades reais.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefícios da Graduação */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        Por que uma Graduação Faz a Diferença?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-lime mb-2">Maiores Recompensas</h3>
                            <p className="text-gray-700">
                                Profissionais com graduação ganham em média 2,5 vezes mais
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-main mb-2">Estabilidade</h3>
                            <p className="text-gray-700">
                                Menos chance de ficar desempregado com diploma
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-lime mb-2">Promoções</h3>
                            <p className="text-gray-700">
                                3x mais chances de alcançar cargos de liderança
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-brand-main rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-main mb-2">Networking</h3>
                            <p className="text-gray-700">
                                Conecte-se com profissionais e empresas do mercado
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <CTAGraduacao />
        </div>
    );
}