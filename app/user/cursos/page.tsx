// app/cursos/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { BookOpen, GraduationCap, Users, TrendingUp } from "lucide-react";
import { getUserCursos } from "../../../lib/get-user-cursos";
import CursosUser from "../../../components/user/Cursos/CursosUsers";

export const metadata: Metadata = {
  title: "Meus Cursos - POLITEC",
  description: "Gerencie suas inscrições e acompanhe seus cursos",
};

async function CursosContent() {
  try {
    const inscricoes = await getUserCursos();
    return <CursosUser inscricoes={inscricoes} />;
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Erro ao carregar cursos
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Não foi possível carregar suas inscrições. Tente novamente mais tarde.
        </p>
      </div>
    );
  }
}

export default function MeusCursosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header da Página */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Cursos</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe suas inscrições, progresso e mensalidades
              </p>
            </div>
          </div>

          {/* Cards de Estatísticas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
          </div>
        </div>

        {/* Conteúdo Principal com Loading */}
        <Suspense
          fallback={
            <div className="space-y-6">
              {/* Skeleton Loader */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:w-72 space-y-4">
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <CursosContent />
        </Suspense>
      </div>
    </div>
  );
}