// components/common/ComingSoon.tsx
"use client";

import { motion } from "framer-motion";
import { Clock, Rocket, Calendar, Mail } from "lucide-react";
import { useState } from "react";

interface ComingSoonProps {
  pageName?: string;
  launchDate?: string;
  showSubscribe?: boolean;
}

export default function ComingSoon({
  pageName = "esta página",
  launchDate = "30 de Janeiro 2024",
  showSubscribe = true
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulando chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscribed(true);
    setEmail("");
    setLoading(false);
    
    // Reset após 5 segundos
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Icon Container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-brand-main to-brand-lime flex items-center justify-center"
        >
          <Clock className="w-16 h-16 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-brand-lime dark:text-white mb-4"
        >
          Em Breve
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        >
          <span className="font-semibold text-brand-main dark:text-brand-lime capitalize">
            {pageName}
          </span>{" "}
          está a caminho! Estamos trabalhando arduamente para trazer uma experiência incrível.
        </motion.p>

        {/* Launch Date Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8 shadow-lg"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Calendar className="w-6 h-6 text-brand-main dark:text-brand-lime" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data de Lançamento Prevista
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {launchDate}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Fique atento para novidades!
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-brand-main to-brand-lime"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>Desenvolvimento</span>
            <span>85%</span>
            <span>Pronto para lançar</span>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Voltar
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}