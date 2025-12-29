"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, User, BookOpen } from "lucide-react";
import { listarPagamentos, Pagamento } from "../../../lib/admin-payments";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface RecentPayment {
  id: string;
  student: string;
  course: string;
  status: "confirmado" | "pendente" | "processando" | "falhou";
  date: string;
  amount: string;
  method: string;
}

export default function RecentPayments() {
  const [payments, setPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPayments();
  }, []);

  const loadRecentPayments = async () => {
    try {
      const result = await listarPagamentos(1, 20); // busca mais, filtra depois

      if (result.success && result.pagamentos) {
        const sorted = result.pagamentos
          .sort(
            (a: any, b: any) =>
              new Date(b.dataPagamento).getTime() -
              new Date(a.dataPagamento).getTime()
          )
          .slice(0, 5); // 🔥 APENAS OS 5 MAIS RECENTES

        const recentPayments: RecentPayment[] = sorted.map((pagamento: any) => ({
          id: pagamento.id.substring(0, 6),
          student: pagamento.user?.nome || "Aluno",
          course: getCourseName(pagamento.itemNome),
          status: pagamento.status as any,
          date: format(new Date(pagamento.dataPagamento), "dd/MM", {
            locale: pt,
          }),
          amount: `${Number(pagamento.valor).toLocaleString("pt-MZ")} MT`,
          method: pagamento.metodoPagamento === "mpesa" ? "M-Pesa" : "Transferência",
        }));

        setPayments(recentPayments);
      }
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseName = (itemNome: string) => {
    switch (itemNome) {
      case "inscricao":
        return "Inscrição";
      case "mensalidade":
        return "Mensalidade";
      case "curso":
        return "Curso";
      default:
        return itemNome;
    }
  };

  const getStatusIcon = (status: RecentPayment["status"]) => {
    switch (status) {
      case "confirmado":
        return <Check className="w-3 h-3 text-green-500" />;
      case "pendente":
      case "processando":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "falhou":
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: RecentPayment["status"]) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "pendente":
      case "processando":
        return "bg-yellow-100 text-yellow-800";
      case "falhou":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: RecentPayment["status"]) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "pendente":
        return "Pendente";
      case "processando":
        return "Processando";
      case "falhou":
        return "Falhou";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b">
          <h2 className="text-base font-semibold">Últimos Pagamentos</h2>
        </div>
        <div className="p-4 flex justify-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Últimos Pagamentos
        </h2>
        <button
          onClick={() => (window.location.href = "/admin/pagamentos")}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Ver todos
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-500">
          Nenhum pagamento encontrado
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-main flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.student}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.course} • {payment.amount} • {payment.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {getStatusIcon(payment.status)}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{payment.method}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
