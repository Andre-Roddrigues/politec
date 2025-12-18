"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Curso, getCursos } from "../../../lib/cursos-actions";
import { criarParceria, ParceriaData } from "../../../lib/parceria-actions";

import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CheckSquare, 
  FileText, 
  Award,
  Users,
  GraduationCap,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HeartHandshake,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const businessSectors = [
  "Tecnologia e Informática",
  "Saúde e Medicina",
  "Educação e Formação",
  "Construção Civil",
  "Agricultura e Agropecuária",
  "Comércio e Varejo",
  "Indústria e Manufactura",
  "Turismo e Hotelaria",
  "Serviços Financeiros",
  "Transportes e Logística",
  "Comunicação e Marketing",
  "Energia e Água",
  "Outro"
];

const partnershipTypes = [
  "Participar nos workshops do PROMET",
  "Apadrinhar estudantes (patrocínio de bolsas)",
  "Formar os seus próprios colaboradores no PROMET",
  "Aceder à base de dados de currículos PROMET"
];

interface FormData {
  nomeEmpresa: string;
  local: string;
  ramoActividade: string;
  webSite: string;
  isDisponivelVagaEstagio: boolean;
  descricao: string;
  logoUrl: string;
  responsavel: {
    nomeCompleto: string;
    email: string;
    telefone: string;
    whatsapp: string;
    cargo: string;
  };
  termsAgreed: boolean;
  dataVerified: boolean;
}

const PartnershipForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    nomeEmpresa: '',
    local: '',
    ramoActividade: '',
    webSite: '',
    isDisponivelVagaEstagio: false,
    descricao: '',
    logoUrl: '',
    responsavel: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      whatsapp: '',
      cargo: ''
    },
    termsAgreed: false,
    dataVerified: false
  });

  const steps = [
    { id: 'Empresa', icon: <Building className="w-5 h-5" /> },
    { id: 'Contacto', icon: <User className="w-5 h-5" /> },
    { id: 'Interesses', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'Colaboração', icon: <HeartHandshake className="w-5 h-5" /> },
  ];

 const benefits = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Networking com Profissionais Qualificados",
    description: "Participe em workshops e eventos para interagir com os candidatos"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Desenvolvimento de Colaboradores",
    description: "Capacite sua equipe com nossos programas de formação"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Visibilidade Institucional",
    description: "Fortaleça sua marca como empresa comprometida com a educação"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Base de Dados Exclusiva",
    description: "Acesso privilegiado ao banco de currículos de talentos qualificados"
  }
];


  useEffect(() => {
    const fetchCursos = async () => {
      const data = await getCursos();
      setCursos(data);
    };
    fetchCursos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('responsavel.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        responsavel: {
          ...prev.responsavel,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: keyof FormData, value: string | boolean) => {
    if (name === 'isDisponivelVagaEstagio') {
      setFormData(prev => ({
        ...prev,
        [name]: !prev[name]
      }));
    } else if (name === 'termsAgreed' || name === 'dataVerified') {
      setFormData(prev => ({
        ...prev,
        [name]: !prev[name]
      }));
    }
  };

  const handleInterestAreaChange = (value: string) => {
    setInterestAreas(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const handlePartnershipTypeChange = (value: string) => {
    setSelectedPartnershipTypes(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
    
    // Se selecionar "Apadrinhar estudantes", marca como disponível para vaga de estágio
    if (value === "Apadrinhar estudantes (patrocínio de bolsas)") {
      setFormData(prev => ({
        ...prev,
        isDisponivelVagaEstagio: true
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateStep = (step: number): boolean => {
  if (step === 1 && (!formData.nomeEmpresa || !formData.ramoActividade || !formData.local)) {
    toast.error("Por favor, preencha todos os campos obrigatórios da empresa");
    return false;
  }
  
  if (step === 2 && (!formData.responsavel.nomeCompleto || !formData.responsavel.cargo || !formData.responsavel.telefone || !formData.responsavel.email)) {
    toast.error("Por favor, preencha todos os campos obrigatórios do contacto");
    return false;
  }
  
  if (step === 4 && (!formData.termsAgreed || !formData.dataVerified)) {
    toast.error("Por favor, aceite os termos e declare a veracidade dos dados");
    return false;
  }
  
  return true;
};


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validateStep(currentStep)) {
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus("idle");

  try {
    const parceriaData: ParceriaData = {
      nomeEmpresa: formData.nomeEmpresa,
      local: formData.local,
      ramoActividade: formData.ramoActividade,
      webSite: formData.webSite.startsWith("http")
        ? formData.webSite
        : `https://${formData.webSite}`, // 👈 garante URL válida
      isDisponivelVagaEstagio: formData.isDisponivelVagaEstagio,
      descricao: `Interesses: ${interestAreas.join(", ")}. Formas de colaboração: ${selectedPartnershipTypes.join(", ")}`,
      responsavel: { ...formData.responsavel }
    };

    const response = await criarParceria(parceriaData);
    console.log("Parceria criada com sucesso:", response);

    setSubmitStatus("success");
    toast.success("Candidatura de parceria submetida com sucesso!");

    // Resetar o form
    setFormData({
      nomeEmpresa: "",
      local: "",
      ramoActividade: "",
      webSite: "",
      isDisponivelVagaEstagio: false,
      descricao: "",
      logoUrl: "",
      responsavel: {
        nomeCompleto: "",
        email: "",
        telefone: "",
        whatsapp: "",
        cargo: ""
      },
      termsAgreed: false,
      dataVerified: false
    });
    setInterestAreas([]);
    setSelectedPartnershipTypes([]);

  } catch (error) {
    console.error("Erro ao submeter a parceria:", error);
    setSubmitStatus("error");
    setErrorMessage(error instanceof Error ? error.message : "Erro inesperado");
    toast.error("Erro ao submeter a candidatura. Tente novamente.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Seção de Cabeçalho */}
      <div className="w-full bg-brand-main dark:bg-gray-900/80 p-12 flex flex-col justify-center items-center text-white">
        <div className="max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:text-4xl text-2xl font-bold mb-6"
          >
            Seja uma Instituição Parceira PROMET
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:text-xl tex:sm mb-8"
          >
            Junte-se ao Programa de Melhoria de Empregabilidade e Trabalho e tenha acesso a talentos qualificados
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {steps.map((step, index) => (
              <div key={step.id} className="md:flex hidden items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep > index ? 'bg-white text-brand-main' : 
                    currentStep === index + 1 ? 'bg-white text-brand-main bg-opacity-90' : 
                    'bg-white text-gray-400 bg-opacity-20'
                  }`}>
                    {step.icon}
                  </div>
                  <span className="text-sm">{step.id}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 ${currentStep > index ? 'bg-white bg-opacity-50' : 'bg-white bg-opacity-20'}`} />
                )}
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            className="bg-white text-brand-main bg-opacity-20 p-6 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3">Vantagens da Parceria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-brand-lime bg-opacity-10 p-1 rounded mr-2">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm opacity-80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Seção do Formulário */}
      <div className="w-full p-8 dark:bg-gray-800 text-white lg:p-12 flex flex-col justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Formulário de Parceria
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-300 mb-8"
          >
            Preencha o formulário para estabelecer uma parceria com o PROMET
          </motion.p>
          
          {/* Progresso */}
          <motion.div 
            className="flex items-center mb-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Linha de fundo */}
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Barra de progresso animada */}
                <motion.div 
                className="h-2 bg-brand-main rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
            
            {/* Marcadores de etapa */}
            <div className="flex items-center justify-between absolute w-full max-w-4xl -mt-1">
                {steps.map((_, index) => (
                <motion.div 
                    key={index}
                    className="relative flex flex-col items-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {/* Círculo do indicador */}
                    <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                        currentStep > index + 1 
                        ? 'bg-white text-brand-lime shadow-lg' 
                        : currentStep === index + 1 
                            ? 'bg-brand-main text-white shadow-lg ring-4 ring-brand-main/20' 
                            : 'border-2 border-gray-300 bg-white text-gray-400 dark:bg-gray-800 dark:border-gray-600'
                    }`}
                    >
                    {/* Número da etapa */}
                    <span className="font-semibold text-sm">
                        {index + 1}
                    </span>
                    
                    {/* Ícone de concluído */}
                    {currentStep > index + 1 && (
                        <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                        >
                        <CheckCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                    </div>
                    
                    {/* Rótulo da etapa */}
                    <motion.span 
                    className={`text-xs font-medium mt-2 whitespace-nowrap ${
                        currentStep === index + 1 
                        ? 'text-brand-main dark:text-brand-lime font-semibold' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    >
                    {steps[index].id}
                    </motion.span>
                </motion.div>
                ))}
            </div>
          </motion.div>
          
          {/* Status de submissão */}
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p>Formulário submetido com sucesso! Entraremos em contacto em breve.</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>Erro ao submeter o formulário: {errorMessage}</p>
            </div>
          )}
          
          {/* Passos do Formulário */}
          <div className="relative dark:bg-gray-100 p-4 rounded-xl text-gray-900 overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Passo 1: Informações da Empresa */}
              <motion.div
                initial={currentStep === 1 ? { opacity: 1 } : { opacity: 0 }}
                animate={currentStep === 1 ? { opacity: 1 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={currentStep === 1 ? 'block space-y-6' : 'hidden'}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-brand-main" />
                  Informações da Instituição
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa/Organização*</label>
                    <input
                      type="text"
                      id="nomeEmpresa"
                      name="nomeEmpresa"
                      required
                      value={formData.nomeEmpresa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                      placeholder="Nome da empresa/organização"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ramoActividade" className="block text-sm font-medium text-gray-700 mb-2">Sector de Actividade*</label>
                    <select
                      id="ramoActividade"
                      name="ramoActividade"
                      required
                      value={formData.ramoActividade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o sector de actividade</option>
                      {businessSectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="webSite" className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tex"
                        id="webSite"
                        name="webSite"
                        value={formData.webSite}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-2">Endereço Físico*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="local"
                        name="local"
                        required
                        value={formData.local}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                        placeholder="Endereço completo da empresa"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Passo 2: Ponto Focal */}
              <motion.div
                initial={currentStep === 2 ? { opacity: 1 } : { opacity: 0 }}
                animate={currentStep === 2 ? { opacity: 1 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={currentStep === 2 ? 'block space-y-6' : 'hidden'}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-brand-main" />
                  Ponto Focal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="responsavel.nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo*</label>
                    <input
                      type="text"
                      id="responsavel.nomeCompleto"
                      name="responsavel.nomeCompleto"
                      required
                      value={formData.responsavel.nomeCompleto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                      placeholder="Nome do ponto focal"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="responsavel.cargo" className="block text-sm font-medium text-gray-700 mb-2">Cargo*</label>
                    <input
                      type="text"
                      id="responsavel.cargo"
                      name="responsavel.cargo"
                      required
                      value={formData.responsavel.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                      placeholder="Cargo/função"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="responsavel.telefone" className="block text-sm font-medium text-gray-700 mb-2">Telefone*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="responsavel.telefone"
                        name="responsavel.telefone"
                        required
                        value={formData.responsavel.telefone}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                        placeholder="+258 8X XXX XXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="responsavel.whatsapp" className="block text-sm font-medium text-gray-700 mb-2">WhatsApp*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="responsavel.whatsapp"
                        name="responsavel.whatsapp"
                        required
                        value={formData.responsavel.whatsapp}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                        placeholder="+258 8X XXX XXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="responsavel.email" className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="responsavel.email"
                        name="responsavel.email"
                        required
                        value={formData.responsavel.email}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus-visible:outline-none focus:ring-brand-main focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Passo 3: Interesses da Empresa */}
              <motion.div
                initial={currentStep === 3 ? { opacity: 1 } : { opacity: 0 }}
                animate={currentStep === 3 ? { opacity: 1 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={currentStep === 3 ? 'block space-y-6' : 'hidden'}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <CheckSquare className="w-6 h-6 mr-2 text-brand-main" />
                  Interesses da Empresa
                </h3>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">
                    Áreas/Cursos em que a empresa gostaria de recrutar:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cursos.map((curso, index) => (
                      <label
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={interestAreas.includes(curso.nome)}
                          onChange={() => handleInterestAreaChange(curso.nome)}
                          className="rounded text-brand-main focus:ring-brand-main"
                        />
                        <span className="ml-3 text-gray-700">{curso.nome}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Passo 4: Formas de Colaboração */}
              <motion.div
                initial={currentStep === 4 ? { opacity: 1 } : { opacity: 0 }}
                animate={currentStep === 4 ? { opacity: 1 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={currentStep === 4 ? 'block space-y-6' : 'hidden'}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <HeartHandshake className="w-6 h-6 mr-2 text-brand-main" />
                  Formas de Colaboração
                </h3>
                
                <div className="space-y-4">
                  {partnershipTypes.map((type, index) => (
                    <label key={index} className="flex items-start p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedPartnershipTypes.includes(type)}
                        onChange={() => handlePartnershipTypeChange(type)}
                        className="mt-1 rounded text-brand-main focus:ring-brand-main"
                      />
                      <span className="ml-3 text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-brand-main" />
                  Confirmação
                </h3>
                
                <div className="mt-6 space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAgreed"
                      checked={formData.termsAgreed}
                      onChange={() => handleCheckboxChange('termsAgreed', true)}
                      className="mt-1 rounded text-brand-main focus:ring-brand-main"
                      required
                    />
                    <span className="ml-3 text-gray-700">
                      Declaro que a empresa tem interesse em estabelecer parceria com a Unitec Academy no âmbito
                      do PROMET – Programa de Melhoria de Empregabilidade e Trabalho, reconhecendo os benefícios
                      e responsabilidades da parceria.
                    </span>
                  </label>
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="dataVerified"
                      checked={formData.dataVerified}
                      onChange={() => handleCheckboxChange('dataVerified', true)}
                      className="mt-1 rounded text-brand-main focus:ring-brand-main"
                      required
                    />
                    <span className="ml-3 text-gray-700">
                      Ciente que os dados fornecidos são verídicos e estou autorizado a representar esta empresa.
                    </span>
                  </label>
                </div>
              </motion.div>
              
              {/* Botões de Navegação */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </button>
                )}
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-brand-main text-white rounded-lg hover:bg-brand-lime hover:text-brand-main transition-colors flex items-center"
                  >
                    Próximo <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        A processar...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Submeter Candidatura
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
              <Toaster position="top-right" reverseOrder={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipForm;