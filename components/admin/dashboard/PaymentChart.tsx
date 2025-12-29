// components/admin/dashboard/PaymentChart.tsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import { listarPagamentos } from "../../../lib/admin-payments";

export default function PaymentChart() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    pendentes: 0,
    falhados: 0,
    totalValue: 0,
    growth: 0
  });

  useEffect(() => {
    loadPaymentStats();
  }, []);

  const loadPaymentStats = async () => {
    setLoading(true);
    try {
      const result = await listarPagamentos(1, 1000);
      
      if (result.success && result.pagamentos) {
        const pagamentos = result.pagamentos;
        const total = pagamentos.length;
        const confirmados = pagamentos.filter(p => p.status === "confirmado").length;
        const pendentes = pagamentos.filter(p => p.status === "pendente" || p.status === "processando").length;
        const falhados = pagamentos.filter(p => p.status === "falhou").length;
        
        const totalValue = pagamentos
          .filter(p => p.status === "confirmado")
          .reduce((sum, p) => sum + Number(p.valor), 0);
        
        // Simulação de crescimento
        const growth = Math.round((confirmados / Math.max(total, 1)) * 100) - 50;
        
        setStats({
          total,
          confirmados,
          pendentes,
          falhados,
          totalValue,
          growth
        });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Estatísticas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Estatísticas
        </h2>
        <div className="flex items-center gap-1">
          {stats.growth >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growth >= 0 ? '+' : ''}{stats.growth}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Confirmados</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.confirmados}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {stats.total > 0 ? Math.round((stats.confirmados / stats.total) * 100) : 0}%
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Pendentes</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.pendentes}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            {stats.total > 0 ? Math.round((stats.pendentes / stats.total) * 100) : 0}%
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-800 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Falhados</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.falhados}
              </div>
            </div>
          </div>
          <div className="text-xs text-red-600 dark:text-red-400">
            {stats.total > 0 ? Math.round((stats.falhados / stats.total) * 100) : 0}%
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Receita</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round(stats.totalValue / 1000)}K
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            {stats.totalValue.toLocaleString("pt-MZ")} MT
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Total Pagamentos</div>
            <div className="font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 dark:text-gray-400">Taxa de Sucesso</div>
            <div className="font-bold text-gray-900 dark:text-white">
              {stats.total > 0 ? Math.round((stats.confirmados / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}