// components/admin/dashboard/PendingActions.tsx
"use client";

import { AlertTriangle, UserCheck, Mail, Bell } from "lucide-react";

interface ActionItem {
  id: number;
  type: "warning" | "info" | "success" | "danger";
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export default function PendingActions() {
  const actions: ActionItem[] = [
    {
      id: 1,
      type: "warning",
      title: "Pagamentos Pendentes",
      description: "Aprovação necessária",
      count: 23,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    },
    {
      id: 2,
      type: "info",
      title: "Inscrições Novas",
      description: "Revisão de documentos",
      count: 15,
      icon: <UserCheck className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      id: 3,
      type: "success",
      title: "Emails Não Respondidos",
      description: "Responder em 24h",
      count: 8,
      icon: <Mail className="w-5 h-5" />,
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    },
    {
      id: 4,
      type: "danger",
      title: "Notificações Pendentes",
      description: "Enviar lembretes",
      count: 12,
      icon: <Bell className="w-5 h-5" />,
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Ações Pendentes
      </h2>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <div 
            key={action.id} 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.color.split(' ')[0]}`}>
                  <div className={action.color.split(' ')[1]}>
                    {action.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {action.count}
                </span>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Ver →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all">
          Ver Todas as Ações
        </button>
      </div>
    </div>
  );
}