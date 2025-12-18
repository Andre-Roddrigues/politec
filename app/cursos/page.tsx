"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ArrowLeft,
  Search,
  Grid,
  List
} from "lucide-react";
import Link from "next/link";
import { Curso, getCursos } from "../../lib/cursos-actions";
import CTAGraduacao from "../../components/Landing/Graduacao/CTAGraduacao";


const CursosPage = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getCursos();
        setCursos(data);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const filteredCursos = cursos.filter(curso =>
    curso.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-main"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-main dark:hover:text-brand-lime transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Link>
          
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Nossos Cursos
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-brand-main text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-brand-main text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-main focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">

        {/* Grid / List */}
        {/* Grid / List */}
<AnimatePresence mode="wait">
  {viewMode === "grid" ? (
    <motion.div key="grid-view" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredCursos.map((curso) => {
        const CursoIcon = curso.imgUrl ? (
          <img src={curso.imgUrl} alt={curso.nome} className="w-6 h-6" />
        ) : (
          <BookOpen className="w-6 h-6 text-brand-main" />
        );

        return (
          <Link key={curso.id} href={`/cursos/${curso.id}`}>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center w-12 h-12 bg-brand-main/10 rounded-lg mb-3 group-hover:bg-brand-main/20 transition-colors">
                  {CursoIcon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-brand-main transition-colors line-clamp-2">
                  {curso.nome}
                </h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>30 Dias</span>
                  </div>
                </div>
                <div className="mt-auto flex items-end justify-end">
                  <span className="text-xs bg-brand-main hover:bg-brand-main-dark text-white py-1.5 px-3 rounded-md transition-colors">
                    Ver curso
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  ) : (
    <motion.div key="list-view" variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
      {filteredCursos.map((curso) => {
        const CursoIcon = curso.imgUrl ? (
          <img src={curso.imgUrl} alt={curso.nome} className="w-6 h-6 flex-shrink-0" />
        ) : (
          <BookOpen className="w-6 h-6 text-brand-main flex-shrink-0" />
        );

        return (
          <Link key={curso.id} href={`/cursos/${curso.id}`}>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="flex items-center justify-center w-10 h-10 bg-brand-main/10 rounded-lg group-hover:bg-brand-main/20 transition-colors flex-shrink-0">
                  {CursoIcon}
                </div>
                <h3
                  className="font-semibold text-gray-800 dark:text-white group-hover:text-brand-main truncate max-w-xs"
                  title={curso.nome}
                >
                  {curso.nome}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-brand-main dark:text-brand-lime">
                  Grátis
                </span>
                <span className="text-xs bg-brand-main hover:bg-brand-main-dark text-white py-1.5 px-3 rounded-md transition-colors">
                  Ver curso
                </span>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  )}
</AnimatePresence>


        {filteredCursos.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Nenhum curso encontrado</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tente usar termos de pesquisa diferentes</p>
          </motion.div>
        )}
      </div>
      <CTAGraduacao />
    </div>
  );
};

export default CursosPage;
