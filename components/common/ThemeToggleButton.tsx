"use client";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-6 w-14 rounded-full transition-colors duration-300 focus:outline-none
        ${isDark ? "bg-gray-800" : "bg-amber-100"}`}
      aria-label={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
    >
      {/* Thumb (interruptor) */}
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 flex items-center justify-center
          ${isDark ? "left-0.5 bg-gray-700" : "left-8 bg-amber-200 shadow-[0_0_8px_2px_rgba(245,158,11,0.6)]"}`}
      >
        {/* Sol (apenas sombra) */}
        {!isDark && (
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_1px_rgba(245,158,11,0.8)]" />
        )}

        {/* Lua com cratera (exatamente como você pediu) */}
        {isDark && (
          <div className="relative h-3 w-3 rounded-full bg-gray-300">
            <div className="absolute top-0.5 left-1 h-1 w-1 rounded-full bg-gray-400" />
          </div>
        )}
      </div>
    </button>
  );
};