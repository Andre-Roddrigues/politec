"use client";
import React from "react";

const CursoCandidaturaSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-main-light/5 via-white to-brand-main-light/10 dark:from-gray-900 dark:via-gray-800 dark:to-brand-main/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Botão Voltar Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Cabeçalho do Curso Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 mb-6 animate-pulse">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
              <div>
                <div className="h-7 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-12 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Processo após candidatura Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 animate-pulse">
          <div className="h-7 w-64 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"></div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
                <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid com três colunas Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((card) => (
            <div key={card} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg mr-3"></div>
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full mr-2 mt-0.5"></div>
                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Informações adicionais Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((card) => (
            <div key={card} className="rounded-xl p-5 bg-gray-100 dark:bg-gray-700 animate-pulse">
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <li key={item} className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Final Skeleton */}
        <div className="text-center mt-10 animate-pulse">
          <div className="h-14 w-64 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto"></div>
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default CursoCandidaturaSkeleton;