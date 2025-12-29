// components/admin/dashboard/TopCourses.tsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, BookOpen } from "lucide-react";
import { listarEstudantes } from "../../../lib/listar-estudantes";

interface Course {
  id: string;
  name: string;
  enrollments: number;
  growth: number;
  color: string;
}

export default function TopCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopCourses();
  }, []);

  const loadTopCourses = async () => {
    try {
      const result = await listarEstudantes(1, 1000);
      
      if (result.success && result.data) {
        // Agrupar estudantes por curso
        const courseMap = new Map();
        
        result.data.forEach(estudante => {
          const curso = estudante.cursoHorario.curso;
          const cursoId = curso.id;
          
          if (!courseMap.has(cursoId)) {
            courseMap.set(cursoId, {
              id: cursoId,
              name: curso.nome,
              enrollments: 0,
              color: getColorForCourse(curso.nome)
            });
          }
          
          const course = courseMap.get(cursoId);
          course.enrollments += 1;
        });
        
        // Converter para array e ordenar por número de inscrições
        const coursesArray = Array.from(courseMap.values())
          .sort((a, b) => b.enrollments - a.enrollments)
          .slice(0, 5); // Top 5 cursos
        
        // Calcular crescimento (simulado)
        coursesArray.forEach(course => {
          course.growth = calculateGrowth(course.enrollments);
        });
        
        setCourses(coursesArray);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorForCourse = (courseName: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-rose-500"
    ];
    
    // Gerar cor baseada no hash do nome do curso
    const hash = courseName.split('').reduce((acc, char) => 
      acc + char.charCodeAt(0), 0
    );
    
    return colors[hash % colors.length];
  };

  const calculateGrowth = (enrollments: number) => {
    // Simulação simples de crescimento
    if (enrollments > 50) return 45;
    if (enrollments > 30) return 32;
    if (enrollments > 20) return 25;
    if (enrollments > 10) return 18;
    if (enrollments > 5) return 12;
    return 8;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Cursos Populares
          </h2>
        </div>
        <div className="p-4">
          <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Cursos Populares
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Top {courses.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {courses.map((course, index) => (
          <div key={course.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${course.color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{course.enrollments} inscritos</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{course.growth}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ml-2">
                <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ 
                      width: `${Math.min(course.enrollments * 100 / (courses[0]?.enrollments || 1), 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {courses.length === 0 && (
        <div className="p-4 text-center">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhum curso encontrado
          </p>
        </div>
      )}
    </div>
  );
}