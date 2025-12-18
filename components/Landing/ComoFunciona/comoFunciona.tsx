"use client"
import React from 'react';
import { 
  ClipboardList, 
  Search, 
  BarChart3, 
  GraduationCap, 
  Briefcase, 
  Rocket,
  CheckCircle,
  UserCheck,
  FileText,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

// Variantes de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
const HowItWorks = () => {
  const diagnostico = [
    {
      number: 1,
      pergunta: "Como se faz a Candidatura?",
      resposta: "Candidatura: Preencha nosso formulário online com suas informações básicas e currículo."
    }
  ]
  const steps = [
    {
      number: 1,
      icon: <ClipboardList className="w-5 h-5" />,
      title: 'Candidatura',
      description: 'Preencha nosso formulário online com suas informações básicas e currículo.',
      price: 'Gratuito | Online',
      free: true
    },
    {
      number: 2,
      icon: <Search className="w-5 h-5" />,
      title: 'Pré-seleção',
      description: 'Análise do perfil e competências pela nossa equipe especializada.',
      price: "Gratuito | Online",
      free: true
    },
    {
      number: 3,
      icon: <UserCheck className="w-5 h-5" />,
      title: 'Teste de Perfil de Carreira',
      description: 'Pequeno questionário para identificar suas áreas de maior afinidade.',
      price: 'Gratuito | Online',
      free: true
    },
    {
      number: 4,
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Exame de diagnóstico',
      description: 'Avaliação técnica para verificar suas competências na área desejada.',
      price: '500 MT | Online',
      free: false
    },
    {
      number: 5,
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'Formação Intensiva (30 dias)',
      description: 'Curso prático e intensivo com foco nas necessidades atuais do mercado.',
      price: '2,500 MT | Presencial',
      free: false
    },
    {
      number: 6,
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Workshop de Empregabilidade',
      description: 'Sessões interativas sobre mercado de trabalho e melhores práticas.',
      price: "Gratuito | Presencial",
      free: true
    },
    {
      number: 7,
      icon: <FileText className="w-5 h-5" />,
      title: 'Currículo Profissional',
      description: 'Optimização de um currículo profissional de acordo com padrões de mercado.',
      price: "Gratuito | Online",
      free: true
    },
    {
      number: 8,
      icon: <Users className="w-5 h-5" />,
      title: 'Inclusão na Base de Talentos',
      description: 'Seu perfil é incluído no nosso banco e encaminhado para empresas parceiras.',
      price: "Gratuito | Online",
      free: true
    }
  ];

  return (
    <section id="funcionamento" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-brand-main dark:text-white mb-2">
            Como Funciona
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Conheça nosso processo de integração passo a passo
          </p>
        </motion.div>
        
        {/* Grid de 4 colunas com animação */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step) => (
            <motion.div 
              key={step.number} 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              // variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              {/* Cabeçalho com número e ícone */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <motion.div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                      step.free 
                        ? 'bg-blue-100 text-brand-main dark:bg-blue-900/30 dark:text-blue-400' 
                        : step.price 
                          ? 'bg-lime-100 text-brand-lime dark:bg-lime-900/30 dark:text-lime-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: step.number * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {step.number}
                  </motion.div>
                  <motion.div 
                    className="w-8 h-8 bg-brand-main/10 dark:bg-brand-main/20 rounded-lg flex items-center justify-center text-brand-main dark:text-brand-lime"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>
                
                {step.price && (
                  <motion.div 
                    className={`py-1 px-2 rounded-full text-xs font-medium ${
                      step.free 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: step.number * 0.1 + 0.2 }}
                  >
                    {step.free ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {step.price}
                      </span>
                    ) : (
                      step.price
                    )}
                  </motion.div>
                )}
              </div>
              
              {/* Título e descrição */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;