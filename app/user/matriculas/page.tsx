// app/user/matriculas/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, BookOpen, Clock } from "lucide-react";
import { getMyEnrollments } from "../../../lib/enrollment-actions";

import toast from "react-hot-toast";
import EnrollmentCard from "../../../components/user/inscricoes/EnrollmentCard";
import Link from "next/link";

export default function MatriculasPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    setLoading(true);
    const res = await getMyEnrollments();
    if (res.success) {
      setEnrollments(res.data);
    } else {
      toast.error("Erro ao carregar as tuas inscrições.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-brand-main animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">A carregar as tuas matrículas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fichas de Inscrição</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerir os teus dados de inscrição e matrícula.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-brand-main/10 text-brand-main font-semibold rounded-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {enrollments.length} {enrollments.length === 1 ? "Curso" : "Cursos"}
          </span>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhuma inscrição encontrada</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Ainda não iniciaste nenhuma inscrição. Explora os cursos e candidata-te para começares a tua jornada.
          </p>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-main text-white font-medium rounded-xl hover:bg-brand-main/90 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Explorar Cursos
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-main/20 flex items-center justify-center text-brand-main">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {enrollment.curso?.nome || "Curso sem nome"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enrollment.curso?.duracao || "Duração não especificada"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Inscrição: {enrollment.dataInscricao ? new Date(enrollment.dataInscricao).toLocaleDateString("pt-MZ") : "-"}</span>
                </div>
              </div>

              {/* Card de Ficha */}
              <EnrollmentCard
                enrollment={enrollment}
                onRefresh={fetchEnrollments}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}