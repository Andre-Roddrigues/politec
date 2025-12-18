"use client";
import React, { useState, useEffect } from "react";
import { getCandidaturas, Candidatura } from "../../../lib/candidaturas-get";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  HardHat,
  Calendar,
  CheckCircle,
  BookOpen,
  Award,
  User,
  Clock,
  FileCheck,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  AlertCircle,
  AlertTriangle,
  Loader2,
  BookA,
  Eye,
} from "lucide-react";
import { enviarCandidatura } from "../../../lib/enviar-candidatura-actions";
import toast from "react-hot-toast";
import CursoCandidaturaSkeleton from "../../../components/common/CursosSkeleton";
import { getCandidato } from "../../../lib/candidato-actions";
import Link from "next/link";

interface CursoReal {
  id: string;
  nome: string;
  preco: number;
  precoTeste: number;
  descricao: string | null;
  dataInicio: string | null;
  dataFim: string | null;
  createdAt: string;
  updatedAt: string;
}

const CursoCandidatura = () => {
  const router = useRouter();
  const params = useParams();
  const [curso, setCurso] = useState<CursoReal | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidaturasCount, setCandidaturasCount] = useState(0);
  const [hasCandidaturaForThisCourse, setHasCandidaturaForThisCourse] = useState(false);
  const [candidaturaLoading, setCandidaturaLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  // Benefícios do curso
  const beneficiosCurso = [
    "Certificado reconhecido",
    "Estágio em empresas parceiras",
    "Preparação para o mercado de trabalho",
    "Acesso a bolsa de emprego",
    "Material didático incluído",
    "Acompanhamento personalizado",
  ];

  // Benefícios para o candidato
  const beneficiosCandidato = [
    "Oportunidade de emprego na área",
    "Desenvolvimento de habilidades técnicas",
    "Networking com profissionais do sector",
    "Possibilidade de crescimento profissional",
    "Acesso a sector em alta demanda",
    "Salários competitivos no mercado",
  ];

  // Passos após a candidatura
  const passosAposCandidatura = [
    {
      titulo: "Análise da Candidatura",
      descricao:
        "Nossa equipe analisará a sua candidatura e poderás controlar o processo no seu Perfil",
      icone: <FileCheck className="w-6 h-6" />,
    },
    {
      titulo: "Teste de Diagnóstico",
      descricao: "Realização do teste para avaliar conhecimentos",
      icone: <GraduationCap className="w-6 h-6" />,
    },
    {
      titulo: "Início da Formação",
      descricao:
        "Após a aprovação no teste, será informado sobre a data do início da formação",
      icone: <BookOpen className="w-6 h-6" />,
    },
  ];

  // Requisitos do curso
  const requisitos = ["Idade mínima: 18 anos", "Disponibilidade para formação"];

  // Buscar curso real da API
  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await fetch(
          `https://backend-promet.unitec.academy/curso/${params.id}`
        );
        if (!response.ok) throw new Error("Erro ao buscar curso");
        const data: CursoReal = await response.json();
        setCurso(data);
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar curso.");
        setCurso(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurso();
  }, [params.id]);

  // Verificar candidaturas do candidato
  useEffect(() => {
    const checkCandidaturas = async () => {
      try {
        const candidato = await getCandidato();
        if (!candidato) {
          setCandidaturaLoading(false);
          return;
        }

        const candidaturas: Candidatura[] = await getCandidaturas();
        
        // Contar candidaturas ativas
        const count = candidaturas.filter(c => c.idCandidato === candidato.id).length;
        setCandidaturasCount(count);
        
        // Verificar se já tem candidatura para este curso específico
        const jaCandidatadoEsteCurso = candidaturas.some(
          (c) => c.idCandidato === candidato.id && c.idCurso === params.id
        );
        setHasCandidaturaForThisCourse(jaCandidatadoEsteCurso);
      } catch (error: any) {
        toast.error(error.message || "Erro ao verificar candidaturas.");
      } finally {
        setCandidaturaLoading(false);
      }
    };

    checkCandidaturas();
  }, [params.id]);

  // Função para candidatar-se - AGORA SEMPRE REDIRECIONA PARA CANDIDATURAS
  const handleCandidatarSe = async (cursoId: string) => {
    if (hasCandidaturaForThisCourse) {
      // Se já está candidatado, redireciona para ver candidaturas
      router.push("/user/candidaturas");
      return;
    }

    if (candidaturasCount >= 2) {
      // Se atingiu o limite, redireciona para ver candidaturas
      router.push("/user/candidaturas");
      return;
    }

    setFinalizando(true);

    try {
      const candidato = await getCandidato();
      if (!candidato) {
        throw new Error("Preencha os dados do seu perfil para candidatar-se.");
      }

      await enviarCandidatura({ idCurso: cursoId });
      setCandidaturasCount(prev => prev + 1);
      setHasCandidaturaForThisCourse(true);

      toast.success("Candidatura enviada com sucesso!");
      
      // SEMPRE redireciona para candidaturas após sucesso
      router.push("/user/candidaturas");
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar candidatura.");
      setFinalizando(false);
    }
  };

  const canApply = candidaturasCount < 2 && !hasCandidaturaForThisCourse;

  if (loading || candidaturaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <CursoCandidaturaSkeleton />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Curso não encontrado
          </h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-brand-main text-white rounded-lg hover:bg-brand-lime transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const descricao = curso.descricao ?? "Descrição não disponível";
  const dataInicio = curso.dataInicio
    ? new Date(curso.dataInicio).toLocaleDateString("pt-BR")
    : "A definir";
  const dataFim = curso.dataFim
    ? new Date(curso.dataFim).toLocaleDateString("pt-BR")
    : "A definir";

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-main-light/5 via-white to-brand-main-light/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-main/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-brand-main dark:text-brand-lime mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>

        {/* Cabeçalho */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-brand-main/10 rounded-full flex items-center justify-center mr-4">
                <HardHat className="w-6 h-6 text-brand-main" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {curso.nome}
                </h1>
                {/* Status das candidaturas */}
                <div className="flex items-center mt-2 gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Candidaturas: {candidaturasCount}/2
                  </span>
                  {candidaturasCount >= 2 && (
                    <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                      Limite atingido
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              {/* Botão principal - AGORA SEMPRE LEVA PARA CANDIDATURAS QUANDO NÃO PODE APLICAR */}
              {hasCandidaturaForThisCourse || candidaturasCount >= 2 ? (
                <Link
                  href="/user/candidaturas"
                  className="px-6 py-3 bg-brand-main text-white font-semibold rounded-lg hover:bg-brand-main/70 transition-colors duration-300 flex items-center justify-center min-w-[180px]"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Candidaturas
                </Link>
              ) : (
                <button
                  onClick={() => handleCandidatarSe(curso.id)}
                  disabled={finalizando}
                  className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center min-w-[180px] ${
                    finalizando
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-brand-main text-white hover:bg-brand-main/70"
                  }`}
                >
                  {finalizando ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    "Finalizar Candidatura"
                  )}
                </button>
              )}

              {/* Mensagens informativas */}
              {hasCandidaturaForThisCourse && (
                <div className="mt-2 flex items-center text-sm text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>Já te candidataste a este curso</span>
                </div>
              )}
              
              {candidaturasCount >= 2 && !hasCandidaturaForThisCourse && (
                <div className="mt-2 flex flex-col items-center text-sm text-red-600 dark:text-red-400">
                  <span>Limite de 2 candidaturas atingido</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Esquerda - 3 primeiros */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-brand-main mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  Início: {dataInicio}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-brand-main mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Duração: 30 Dias</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 text-brand-main mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Vagas limitadas</span>
              </div>
            </div>

            {/* Direita - 3 últimos */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm">
                <BookA className="w-4 h-4 text-brand-main mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  Teste de Diagnóstico: Online
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-brand-main mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Período: 09-24 de Outubro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Processo após candidatura */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-brand-main dark:text-white mb-6 text-center">
            Processo Após a Candidatura
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passosAposCandidatura.map((passo, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-brand-main/10 rounded-full flex items-center justify-center mb-3 text-brand-main">
                  {passo.icone}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  {passo.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
            <h3 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Informações Importantes
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• As vagas são limitadas</li>
              <li>• Início das aulas: {dataInicio}</li>
              <li>• Duração: 30 Dias</li>
              <li>• Modalidade: Presencial</li>
              <li>• Local: Após a aprovação da candidatura</li>
              <li>• Horário: Segunda a Sexta, 08:35-11:35 - 16:00-19:00</li>
              <li>• Limite: Máximo 2 candidaturas por candidato</li>
            </ul>
          </div>

          <div className="bg-brand-main/5 dark:bg-brand-main/10 rounded-xl p-5">
            <h3 className="text-md font-semibold text-brand-main dark:text-brand-lime mb-3 flex items-center">
              <HeartHandshake className="w-5 h-5 mr-2" />
              Por que escolher este curso?
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Sector em crescimento em Moçambique</li>
              <li>• Professores com experiência prática</li>
              <li>• Infraestrutura moderna e adequada</li>
              <li>• Parcerias com empresas do sector</li>
              <li>• Alta taxa de empregabilidade</li>
              <li>• Certificação reconhecida nacionalmente</li>
            </ul>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Benefícios do curso */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Benefícios do Curso
              </h3>
            </div>
            <ul className="space-y-3">
              {beneficiosCurso.map((beneficio, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {beneficio}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios do candidato */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Vantagens para Você
              </h3>
            </div>
            <ul className="space-y-3">
              {beneficiosCandidato.map((beneficio, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-brand-main mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {beneficio}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requisitos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Requisitos de Inscrição
              </h3>
            </div>
            <ul className="space-y-3">
              {requisitos.map((requisito, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {requisito}
                  </span>
                </li>
              ))}
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Interesse pela área de {curso.nome}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Final - AGORA SEMPRE LEVA PARA CANDIDATURAS QUANDO NÃO PODE APLICAR */}
        <div className="text-center mt-10">
          {hasCandidaturaForThisCourse || candidaturasCount >= 2 ? (
            <Link
              href="/user/candidaturas"
              className="w-1/2 px-8 py-4 bg-brand-main text-white font-bold rounded-lg hover:bg-brand-main/70 transition-colors duration-300 text-lg flex items-center justify-center mx-auto min-w-[280px] gap-2"
            >
              <Eye className="w-5 h-5" />
              Ver Candidaturas 
            </Link>
          ) : (
            <button
              onClick={() => handleCandidatarSe(curso.id)}
              disabled={finalizando}
              className={` px-8 py-4 font-bold rounded-lg transition-colors duration-300 text-lg flex items-center justify-center mx-auto min-w-[280px] gap-2 ${
                finalizando
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-brand-main text-white hover:bg-brand-lime"
              }`}
            >
              {finalizando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizando...
                </>
              ) : (
                "Quero me Candidatar Agora"
              )}
            </button>
          )}
          
          {/* Informação sobre o limite */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Podes candidatar-te a até 2 cursos diferentes. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoCandidatura;