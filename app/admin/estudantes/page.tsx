// app/admin/estudantes/page.tsx

import { BookOpen, Clock, Users } from "lucide-react";
import EstudantesTable from "../../../components/admin/EstudantesTable/EstudantesTable";
import { listarEstudantes } from "../../../lib/listar-estudantes";

export default async function AdminEstudantesPage() {
  // Carregar dados iniciais no servidor
  const initialData = await listarEstudantes(1, 10);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciar Estudantes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualize, filtre e gerencie todos os estudantes inscritos nos cursos
        </p>
      </div>

      {/* Tabela de Estudantes */}
      <EstudantesTable 
        initialData={initialData.data} 
        initialTotal={initialData.total || 0}
      />
    </div>
  );
}