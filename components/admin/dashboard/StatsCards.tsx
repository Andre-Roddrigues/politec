// components/admin/dashboard/StatsCards.tsx - Versão com dados reais

// components/admin/dashboard/StatsCards.tsx - Versão Ultra Lite com dados reais
"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { getPaymentStats } from "../../../lib/admin-payments";
import toast from "react-hot-toast";

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getPaymentStats();
      
      if (data) {
        setStats(data);
      } else {
        toast.error("Erro ao carregar estatísticas");
      }
    } catch (error) {
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statsItems = [
    {
      title: "Total",
      value: stats?.total?.toLocaleString("pt-MZ") || "0",
      icon: DollarSign,
      color: "text-blue-500",
      description: "Pagamentos"
    },
    {
      title: "Confirmados",
      value: stats?.confirmados?.toLocaleString("pt-MZ") || "0",
      icon: CheckCircle,
      color: "text-green-500",
      description: "Aprovados"
    },
    {
      title: "Pendentes",
      value: stats?.pendentes?.toLocaleString("pt-MZ") || "0",
      icon: Clock,
      color: "text-yellow-500",
      description: "Em análise"
    },
    {
      title: "Falhados",
      value: stats?.falhados?.toLocaleString("pt-MZ") || "0",
      icon: XCircle,
      color: "text-red-500",
      description: "Não concluídos"
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsItems.map((_, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-10"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Estatísticas de Pagamentos
        </h3>
        <button
          onClick={loadStats}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsItems.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {stat.title}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  {stat.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {stat.description}
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}