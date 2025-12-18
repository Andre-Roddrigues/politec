"use client"
import React, { useState } from "react"
import {
  FileText,
  Search,
  BarChart,
  GraduationCap,
  Users,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Workflow,
  MessageCircleQuestion,
} from "lucide-react"
import Link from "next/link"

const steps = [
  {
    title: "Candidatura gratuita",
    description: "Preencha o formulário online sem custos iniciais",
    icon: FileText,
    Link: '/formulario'
  },
  {
    title: "Pré-seleção",
    description: "Análise do seu perfil e experiência profissional",
    icon: Search,
  },
  {
    title: "Exame de diagnóstico",
    description: "Avaliação das suas competências (500 MT)",
    icon: BarChart,
    price: "500 MT",
  },
  {
    title: "Formação intensiva",
    description: "Programa de 30 dias com especialistas do mercado",
    icon: GraduationCap,
    price: "2,500 MT",
  },
  {
    title: "Workshop Mercado de Trabalho",
    description: "Preparação para entrevistas e técnicas de networking",
    icon: Users,
  },
  {
    title: "Inclusão na base de dados",
    description: "Acesso exclusivo às oportunidades das empresas parceiras",
    icon: Briefcase,
  },
]

const HowItWorksButton = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [open, setOpen] = useState(false)

  const StepIcon = steps[activeStep].icon

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-brand-main text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all"
      >
        <MessageCircleQuestion className="w-6 h-6" />
      </button>

      {/* Painel Flutuante */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 z-50 animate-slide-up">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Etapa {activeStep + 1}/{steps.length}
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-brand-main"
            >
              ✕
            </button>
          </div>

          {/* Ícone principal */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-main/10 flex items-center justify-center mb-3">
              <StepIcon className="w-8 h-8 text-brand-main" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {steps[activeStep].title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              {steps[activeStep].description}
            </p>
            {steps[activeStep].price && (
              <div className="mt-4 text-sm font-bold text-brand-main">
                {steps[activeStep].price}
              </div>
            )}
          </div>

          {/* Navegação */}
          <div className="flex justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="flex items-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </button>
            <button
              onClick={() =>
                setActiveStep((prev) =>
                  Math.min(steps.length - 1, prev + 1)
                )
              }
              disabled={activeStep === steps.length - 1}
              className="flex items-center px-3 py-2 rounded-lg bg-brand-main text-white disabled:opacity-40"
            >
              Próximo <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Linha do progresso */}
          <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-brand-main transition-all duration-500"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  )
}

export default HowItWorksButton
