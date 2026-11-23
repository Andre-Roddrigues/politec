// components/Cursos/EnrollmentCard.tsx
"use client";

import { useState } from "react";
import { User, FileText, CheckCircle2, Edit, AlertCircle, CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";
import EnrollmentForm from "../../cursos/Payments/EnrollmentForm";


interface EnrollmentCardProps {
  enrollment: any;
  onRefresh: () => void;
}

export default function EnrollmentCard({ enrollment, onRefresh }: EnrollmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Se estiver em modo de edição
  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Editar Ficha de Inscrição
        </h3>
        <EnrollmentForm
          courseId={enrollment.cursoId}
          horarioId={enrollment.horarioId}
          initialData={enrollment}
          onSuccess={() => {
            setIsEditing(false);
            onRefresh();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // Calcular data formatada
  const dataFormatada = new Date(enrollment.createdAt || enrollment.dataInscricao).toLocaleDateString("pt-MZ", {
    day: "2-digit", month: "long", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      {/* Cabeçalho do Card */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-main/10 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-brand-main" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Ficha de Inscrição
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Submetida a {dataFormatada}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            enrollment.status === "aprovado" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : enrollment.status === "rejeitado"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            {enrollment.status}
          </span>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>

      {/* Corpo do Card - Dados */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Coluna 1: Dados Pessoais */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
            <User className="w-4 h-4 text-brand-main" /> Dados Pessoais
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Nome Completo</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.firstName} {enrollment.surname}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right break-all">{enrollment.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Telefone</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Data de Nasc.</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">
                {new Date(enrollment.birthDate).toLocaleDateString('pt-MZ')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Naturalidade</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.placeOfBirth}</dd>
            </div>
          </dl>
        </div>

        {/* Coluna 2: Documentação */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
            <FileText className="w-4 h-4 text-brand-main" /> Documentação
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Documento</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.documentType} - {enrollment.documentNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Emissão</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">
                {new Date(enrollment.documentIssueDate).toLocaleDateString('pt-MZ')} ({enrollment.documentIssuePlace})
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Validade</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">
                {new Date(enrollment.documentExpiryDate).toLocaleDateString('pt-MZ')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Nível Académico</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.academicLevel}</dd>
            </div>
          </dl>
        </div>

        {/* Coluna 3 (Extra): Contactos de Emergência */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
            <AlertCircle className="w-4 h-4 text-brand-main" /> Encarregado / Emergência
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Encarregado</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.guardianName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Contacto Encarregado</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.guardianContact}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Emergência</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.emergencyName} ({enrollment.emergencyContact})</dd>
            </div>
          </dl>
        </div>

        {/* Coluna 4 (Extra): Origem */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
            <User className="w-4 h-4 text-brand-main" /> Origem
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Como nos conheceu</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.discoverySource}</dd>
            </div>
            {enrollment.discoverySourceOther && (
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Outro (Especificar)</dt>
                <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.discoverySourceOther}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Amigos Referenciados</dt>
              <dd className="font-semibold text-gray-900 dark:text-white text-right">{enrollment.referredFriends || "0"}</dd>
            </div>
          </dl>
        </div>

      </div>
    </motion.div>
  );
}