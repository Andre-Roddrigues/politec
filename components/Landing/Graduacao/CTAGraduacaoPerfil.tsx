"use client"
import React from "react";
import { Check, Heart, FileText, Clock, MapPin, Calendar } from "lucide-react";

export default function CTAGraduacao() {
    return (
        <div className="relative bg-brand-main shadow-2xl overflow-hidden">
            {/* Formas geométricas */}
            <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-brand-lime transform rotate-12 translate-x-20 -translate-y-20 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue transform -rotate-12 translate-x-32 -translate-y-10 rounded-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-lime transform rotate-12 translate-x-32 translate-y-32 rounded-3xl"></div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-12 items-center">

                {/* Esquerda */}
                <div className="space-y-6 z-10">
                    {/* Logo PROMET */}
                    <div className="flex items-center space-x-3">
                        <div>
                            <div className="font-bold text-white text-2xl"><CompactCountdown /></div>
                            <div className="text-xs text-gray-300 mt-1">
                                Prazo de Pagamento até o dia <strong>28 de Novembro de 2025</strong>
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Graduação
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold">
                        <span className="text-brand-lime">que Transforma Futuros</span>
                    </h2>

                    {/* Descrição com Local e Hora */}
                    <div className=" mt-18">
                        <p className="text-white text-sm leading-relaxed max-w-md">
                            A sua graduação é o primeiro passo para transformar sonhos em
                            conquistas reais. Este é o momento de acreditar no seu potencial, 
                            investir no seu conhecimento e construir uma carreira que será 
                            motivo de orgulho para você e para quem acredita em você.
                        </p>
                        
                        {/* Informações do Evento */}
                        <div className="bg-white/10 mt-12 backdrop-blur-sm mt-20 rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-brand-lime" />
                                <div>
                                    <p className="text-white text-sm font-medium">
                                        Centro de Recursos Juvenis Mozarte
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        12 de Dezembro de 2025 às 09:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Direita - O que inclui a participação */}
                <div className="relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        {/* Custo */}
                        <div className="text-center mb-6">
                            <div className="text-white text-lg mb-2">A participação tem o custo de</div>
                            <div className="text-3xl font-bold text-brand-lime">2.800 MT</div>
                            <div className="text-white text-sm mt-1">que inclui:</div>
                        </div>
                        
                        {/* Itens incluídos */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-brand-lime rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-white text-sm">Faixa dupla</p>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-brand-lime rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-white text-sm">Moldura para o certificado</p>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-brand-lime rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <p className="text-white text-sm">Almoço para o(a) graduado(a) e 1 convidado</p>
                            </div>
                        </div>

                        {/* Responsabilidade social */}
                        <div className="bg-blue-500/20 rounded-lg p-4 mb-4 border border-blue-400/30">
                            <div className="flex items-start space-x-3">
                                <Heart className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-white font-semibold text-sm mb-1">Responsabilidade social:</div>
                                    <div className="text-white text-xs">
                                        15% do valor será destinado à Instituição Dom Orione, como forma de apoio solidário e  o(a) graduado(a) estará presente no acto da entrega, com direito a uma camiseta.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nota importante */}
                        <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                            <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-white font-semibold text-sm mb-1">Nota:</div>
                                    <div className="text-white text-xs">
                                        Se ainda não efectuou o pagamento do certificado (1.400 MT), poderá fazê-lo nesta plataforma em conjunto com o pagamento da graduação.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Componente de Contagem Regressiva Compacta (para o logo)
function CompactCountdown() {
    const calculateTimeLeft = () => {
        const targetDate = new Date('2025-11-28T23:59:59');
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference > 0) {
            return {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                segundos: Math.floor((difference % (1000 * 60)) / 1000),
            };
        }

        return { dias: 0, horas: 0, minutos: 0, segundos: 0};
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-xl">
                {timeLeft.dias}d {timeLeft.horas.toString().padStart(2, '0')}h {timeLeft.minutos.toString().padStart(2, '0')}m {timeLeft.segundos.toString().padStart(2, '0')}s
            </span>
        </div>
    );
}