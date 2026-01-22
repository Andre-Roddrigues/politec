'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Wrench, 
  Building, 
  Calendar, 
  Users, 
  ChevronDown,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  Bookmark
} from 'lucide-react';

export default function AreasCursos() {
  const [expandedAreas, setExpandedAreas] = useState<number[]>([]);

  const toggleArea = (index: number) => {
    setExpandedAreas(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const areas = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Área de Gestão",
      mensalidade: "3.200 MT",
      duracao: "3 anos + estágio",
      horario: "Laboral-M 07:00 - 12:00",
      vagas: "40 vagas disponíveis",
      cursos: [
        "Contabilidade",
        "Gestão de Recursos Humanos",
        "Gestão Geral",
        "Iniciação à Banca",
        "Gestão de Logística"
      ],
      descricao: "Formação completa em gestão empresarial com foco nas necessidades do mercado moçambicano.",
      destaques: [
        "Professores com experiência no mercado",
        "Material didático atualizado",
        "Estágio em empresas parceiras"
      ]
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Área de TIC's",
      mensalidade: "3.600 MT",
      duracao: "3 anos + estágio",
      horario: "Laboral-M 07:00 - 12:00",
      vagas: "35 vagas disponíveis",
      cursos: [
        "Programação Web",
        "Administração de Sistemas e Redes Informáticas"
      ],
      descricao: "Formação técnica em tecnologias de informação e comunicação para o mercado digital.",
      destaques: [
        "Laboratórios equipados",
        "Certificações Microsoft e Cisco",
        "Projetos reais durante o curso"
      ]
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Manutenção Industrial",
      mensalidade: "3.600 MT",
      duracao: "3 anos + estágio",
      horario: "Laboral-M 07:00 - 12:00",
      vagas: "30 vagas disponíveis",
      cursos: [
        "Electricidade Industrial",
        "Mecânica de Manutenção Industrial",
        "Refrigeração e Climatização"
      ],
      descricao: "Formação especializada em manutenção e operação de equipamentos industriais.",
      destaques: [
        "Workshops práticos semanais",
        "Equipamentos industriais reais",
        "Parcerias com indústrias locais"
      ]
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Construção Civil",
      mensalidade: "3.600 MT",
      duracao: "3 anos + estágio",
      horario: "Laboral-M 07:00 - 12:00",
      vagas: "25 vagas disponíveis",
      cursos: [
        "Construção Civil",
        "Canalização"
      ],
      descricao: "Formação técnica para profissionais da construção civil e infraestruturas.",
      destaques: [
        "Visitas técnicas a obras",
        "Simuladores de construção",
        "Orientação profissional contínua"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-main/5 to-brand-lime/5 border border-brand-main/10 mb-6">
            <div className="w-1.5 h-1.5 bg-brand-main rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-brand-main tracking-wide">
              NOSSA OFERTA FORMATIVA
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Áreas de <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">
              Formação
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Cursos técnicos profissionais reconhecidos nacionalmente
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {areas.map((area, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                expandedAreas.includes(index) ? 'shadow-2xl' : ''
              }`}
            >
              {/* Header */}
              <div 
                className="bg-gradient-to-r from-brand-main to-brand-main/90 p-6 cursor-pointer transition-all duration-300 group"
                onClick={() => toggleArea(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mt-1">
                      <div className="text-white">
                        {area.icon}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {area.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-white/90">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{area.duracao}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{area.horario}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90">
                          <Bookmark className="w-4 h-4" />
                          <span className="text-sm">{area.vagas}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-right mb-3">
                      <div className="text-2xl font-bold text-white">{area.mensalidade}</div>
                      <div className="text-white/80 text-sm">mensalidade</div>
                    </div>
                    
                    <ChevronDown 
                      className={`w-5 h-5 text-white transition-all duration-300 group-hover:scale-110 ${
                        expandedAreas.includes(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Content - Always visible basic info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-main/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-main" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Duração</div>
                      <div className="font-medium text-gray-900">{area.duracao}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-main/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-brand-main" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Horário</div>
                      <div className="font-medium text-gray-900">{area.horario}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-main/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-brand-main" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Mensalidade</div>
                      <div className="font-medium text-gray-900">{area.mensalidade}</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  {area.descricao}
                </p>
              </div>

              {/* Expandable Content */}
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedAreas.includes(index) 
                    ? 'max-h-[800px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0">
                  {/* Cursos Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-brand-lime" />
                      Cursos Disponíveis
                    </h4>
                    
                    <div className="space-y-3">
                      {area.cursos.map((curso, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-brand-main/30 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-brand-main/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-brand-main">{idx + 1}</span>
                          </div>
                          <span className="text-gray-800">{curso}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destaques */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-main" />
                      Destaques da Formação
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {area.destaques.map((destaque, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-gradient-to-r from-brand-main/5 to-brand-lime/5 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-brand-lime mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{destaque}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-brand-main/5 to-brand-lime/5 rounded-xl p-5 border border-brand-main/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-main mb-1">11x</div>
                        <div className="text-xs text-gray-600">Prestações</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-main mb-1">5%</div>
                        <div className="text-xs text-gray-600">IVA Incluído</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-main mb-1">90%</div>
                        <div className="text-xs text-gray-600">Empregabilidade</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-main mb-1">100%</div>
                        <div className="text-xs text-gray-600">ANEP</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 group relative overflow-hidden bg-gradient-to-r from-brand-main to-brand-lime text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                      <span className="relative z-10">Inscrever-se Agora</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-lime to-brand-main opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button className="flex-1 border-2 border-brand-main text-brand-main px-5 py-3 rounded-xl font-semibold hover:bg-brand-main/5 transition-all duration-300">
                      Mais Informações
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions (visible when collapsed) */}
              {!expandedAreas.includes(index) && (
                <div className="p-6 pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">{area.cursos.length} cursos</div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="text-sm text-gray-500">3 anos</div>
                    </div>
                    <button 
                      onClick={() => toggleArea(index)}
                      className="text-brand-main font-medium hover:text-brand-lime transition-colors text-sm"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-brand-main/5 to-brand-lime/5 rounded-2xl p-8 border border-brand-main/10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-main mb-2">4</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Áreas de Formação</div>
              <p className="text-gray-600 text-sm">
                Cobertura completa do mercado profissional
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-main mb-2">12</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cursos Técnicos</div>
              <p className="text-gray-600 text-sm">
                Especializações profissionais diversas
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-main mb-2">3</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Anos de Formação</div>
              <p className="text-gray-600 text-sm">
                Incluindo estágio profissional
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-main mb-2">500+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Alunos Formados</div>
              <p className="text-gray-600 text-sm">
                Profissionais no mercado de trabalho
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-brand-main to-brand-lime text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg">
            <span>Explorar Todas as Áreas</span>
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            Clique em qualquer área para expandir e ver todos os detalhes
          </p>
        </div>
      </div>
    </section>
  );
}