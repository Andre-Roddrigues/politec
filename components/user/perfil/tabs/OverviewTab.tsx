"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Edit3 } from "lucide-react";
import { updateUser } from "../../../../lib/user-actions";
import { UserData } from "../../types/user-types";

type OverviewTabProps = {
  userData: UserData
  isEditing: boolean
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
}
export default function VisaoGeral({ userData, isEditing: initialEditing, setUserData }: OverviewTabProps) {
  const [overview, setOverview] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser({ overview });
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-md">
            <Edit3 className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral</h2>
        </div>
        
        {!isEditing && (
          <motion.button
            onClick={handleEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Visão Geral atualizada com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {isEditing ? (
          <>
            <motion.textarea
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              placeholder="Escreva uma visão geral sobre você, suas experiências, objetivos e o que te motiva..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
              rows={6}
            />
            <div className="flex justify-end gap-3 pt-2">
              <motion.button
                onClick={() => setIsEditing(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar
                  </>
                )}
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl min-h-[150px]"
          >
            {overview ? (
              <p className="text-gray-800 dark:text-white whitespace-pre-line leading-relaxed">
                {overview}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
                <Edit3 className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-center">Nenhuma visão geral adicionada ainda.</p>
                <p className="text-sm mt-1">Clique em Editar para adicionar uma visão geral sobre você.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {!isEditing && overview && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          Clique em Editar para modificar sua visão geral
        </motion.div>
      )}
    </motion.div>
  );
}