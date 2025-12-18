"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BookOpen, ArrowRight } from "lucide-react";
import { Curso, getCursos } from "../../../lib/cursos-actions";
import Link from "next/link";

const TrainingAreas = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  // Dentro do useEffect
useEffect(() => {
  AOS.init({ duration: 800, once: true });
  const fetchCursos = async () => {
    const data = await getCursos();

    // Ordenar por data de criação ou id (mais antigos primeiro, mais recentes no fim)
    const sortedData = data.sort((a, b) => {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return aTime - bTime; // sempre retorna number
});


    setCursos(sortedData);
  };
  fetchCursos();
}, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleCount(10);
  };

  return (
    <section
      id="areas"
      className="relative py-20 bg-gradient-to-br from-brand-main-light/5 via-white to-brand-main-light/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-main/10"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-bgdark dark:text-white mb-6">
            Áreas de{" "}
            <span className="text-brand-main dark:text-brand-lime">Formação</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Principais áreas disponíveis na plataforma.
          </p>
        </div>

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {cursos.slice(0, visibleCount).map((curso, index) => (
            <div
              key={curso.id}
              className="group bg-white dark:bg-gray-800 rounded-lg p-5 transition-all duration-300 hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-brand-main/20"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
            <Link href="/cursos/[id]" as={`/cursos/${curso.id}`} passHref>
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-brand-main/5 transition-colors duration-300 mb-3">
                  <BookOpen className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-brand-main transition-colors duration-300" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-brand-main transition-colors duration-300 leading-tight">
                  {curso.nome}
                </h3>
                <div className="flex justify-end items-end">
                  {/* <Link href="/cursos/[id]" as={`/cursos/${curso.id}`} passHref> */}
                  <ArrowRight className="w-4 h-4 text-brand-main mt-1 ml-1 duration-300" />
                {/* </Link> */}
                </div>
                {/* Botão discreto */}
                {/* <Link
                  href={`/cursos/${curso.id}`}
                  className="mt-3 inline-flex items-center text-xs text-brand-main dark:text-brand-lime hover:underline"
                >
                  Ver mais <ArrowRight className="ml-1 w-3 h-3" />
                </Link> */}
              </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="text-center mt-10 space-x-4">
            <Link 
            href="/cursos"
              className="px-6 py-2 rounded-lg bg-brand-main text-white font-medium hover:bg-brand-lime transition-colors duration-300"
            >
              Mostrar mais
            </Link>
          {visibleCount > 10 && (
            <button
              onClick={handleShowLess}
              className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
            >
              Ver menos
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrainingAreas;
