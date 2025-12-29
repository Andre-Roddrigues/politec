import PagamentosTable from "../../../components/admin/Pagamentos/PagamentosTable";
import { listarPagamentos } from "../../../lib/admin-payments";


export default async function AdminPagamentosPage() {
  // Carregar dados iniciais no servidor
  const initialData = await listarPagamentos(1, 10);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciar Pagamentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualize, confirme e gerencie todos os pagamentos do sistema
        </p>
      </div>

      {/* Tabela de Pagamentos */}
      <PagamentosTable
        initialData={initialData.pagamentos} 
        initialTotal={initialData.total || 0}
      />
    </div>
  );
}