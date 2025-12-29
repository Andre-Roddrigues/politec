// app/admin/dashboard/page.tsx

import DashboardLayout from "../../../components/admin/dashboard/DashboardLayout";
import PaymentChart from "../../../components/admin/dashboard/PaymentChart";
import PendingActions from "../../../components/admin/dashboard/PendingActions";
import RecentPayments from "../../../components/admin/dashboard/RecentPayments";
import StatsCards from "../../../components/admin/dashboard/StatsCards";
import TopCourses from "../../../components/admin/dashboard/TopCourses";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie pagamentos, cursos e inscrições
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <StatsCards />

        {/* Gráfico e Ações */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PaymentChart />
          </div>
          <div>
            <PendingActions />
          </div>
        </div> */}

        {/* Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPayments />
          <TopCourses />
        </div>
      </div>
    </DashboardLayout>
  );
}