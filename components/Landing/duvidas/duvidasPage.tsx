"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const faqItems = [
    {
      question: "Como posso me inscrever no programa PROMET?",
      answer: "Para se inscrever, basta clicar no botão 'Quero Participar' ou clica no botão 'Registro' no topo da página e preencher o formulário para criar a sua conta."
    },
    {
      question: "Quanto custa participar do programa?",
      answer: "As etapas como candidatura, pré-seleção, teste de perfil, workshop de empregabilidade e inclusão na base de talentos são gratuitas. Apenas a formação intensiva de 30 dias tem um custo de 2.500 Mt e o teste de diagnóstico que custa 500MT."
    },
    {
      question: "Quais são os requisitos para participar?",
      answer: "Não há requisitos rígidos de formação acadêmica. Buscamos pessoas motivadas, com vontade de aprender e desenvolver novas habilidades. O teste de perfil de carreira nos ajuda a identificar as áreas onde cada candidato tem maior potencial."
    },
    {
      question: "Quanto tempo dura o programa?",
      answer: "O programa tem duração total de 30 dias de formação intensiva, com carga horária prática e focada nas necessidades do mercado."
    },
    {
      question: "Recebo algum certificado ao final do programa?",
      answer: "Sim, todos os participantes que completarem com sucesso a formação recebem um certificado reconhecido pelas empresas parceiras, que atesta as competências desenvolvidas durante o programa."
    },
    {
      question: "Como funciona a conexão com as empresas parceiras?",
      answer: "Após a formação, seu perfil é incluído em nossa base de dados exclusiva, acessada apenas por empresas parceiras. Além disso, realizamos encaminhamentos diretos para oportunidades compatíveis com seu perfil."
    },
    {
      question: "E se eu não conseguir emprego imediatamente após o programa?",
      answer: "Mesmo após o curso, você mantém acesso à nossa rede de oportunidades. Seu perfil permanece ativo em nossa base e continuamos a encaminhá-lo para vagas que surgirem conforme seu perfil."
    },
    {
      question: "Posso fazer mais de uma formação?",
      answer: "Sim, mas em edições diferentes, mas cada uma requer uma nova inscrição e aprovação no processo seletivo específico da área."
    },
    {
      question: "As formações são presenciais ou online?",
      answer: "As formações são presenciais. Detalhes específicos como Localização, horário... são informados durante o processo de seleção."
    },
    {
      question: "Como posso me tornar uma empresa parceira?",
      answer: "Empresas interessadas em se tornar parceiras podem entrar em contato através do botão 'Quero ser Parceiro'. Oferecemos acesso privilegiado a talentos qualificados e preparados para o mercado."
    }
  ];

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleContacts = () => {
    setShowContacts(!showContacts);
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Telefones",
      value: "(+258) 870088787 | 834303184",
      href: "tel:+258870088787"
    },
    {
      icon: Mail,
      label: "Email",
      value: "promet@unitec.ac.mz",
      href: "mailto:promet@unitec.ac.mz"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Enviar mensagem",
      href: "https://wa.me/258834303184"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-brand-main/10 rounded-full mb-6"
          >
            <HelpCircle className="w-8 h-8 text-brand-main dark:text-brand-lime" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-main dark:text-white mb-4">
            Tire suas Dúvidas sobre o PROMET
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o programa PROMET e como participar.
          </p>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-main/20"
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                  {item.question}
                </span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-brand-main dark:text-brand-lime flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 pb-5">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Seção de contato adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-brand-main/5 to-brand-lime/5 rounded-2xl border border-brand-main/10 dark:border-brand-lime/10"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco para mais informações. Nossa equipe está pronta para ajudá-lo.
          </p>
          
          {/* Botão para mostrar/ocultar contatos */}
          <div className="relative inline-block">
            <button
              onClick={toggleContacts}
              className="px-6 py-3 border border-brand-main text-brand-main dark:border-brand-lime dark:text-brand-lime font-medium rounded-lg hover:bg-brand-main/5 transition-colors flex items-center gap-2"
            >
              Ver Contatos
              {showContacts ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Dropdown de contatos */}
            <AnimatePresence>
              {showContacts && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
                      Entre em Contato
                    </h3>
                    
                    <div className="space-y-3">
                      {contactItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : '_self'}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <div className="p-2 bg-brand-main/10 rounded-lg">
                              <item.icon className="w-4 h-4 text-brand-main dark:text-brand-lime" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {item.value}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Horário de atendimento: Segunda a Sexta, 8h-17h
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Overlay para fechar o dropdown ao clicar fora */}
          <AnimatePresence>
            {showContacts && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-0"
                onClick={() => setShowContacts(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;