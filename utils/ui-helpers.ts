// app/cursos/[id]/utils/ui-helpers.ts
import { Sun, Moon, Clock } from "lucide-react";
import React from "react";

export function getPeriodIcon(periodo: string): React.ReactElement {
  if (!periodo) {
    return React.createElement(Clock, { 
      className: "w-4 h-4 text-gray-500" 
    });
  }

  const periodoLower = periodo.toLowerCase();
  
  if (periodoLower.includes("manhã") || periodoLower.includes("manha")) {
    return React.createElement(Sun, { 
      className: "w-4 h-4 text-yellow-500" 
    });
  }
  
  if (periodoLower.includes("tarde")) {
    return React.createElement(Sun, { 
      className: "w-4 h-4 text-orange-500" 
    });
  }
  
  if (periodoLower.includes("noite") || 
      periodoLower.includes("pós") || 
      periodoLower.includes("pos")) {
    return React.createElement(Moon, { 
      className: "w-4 h-4 text-indigo-500" 
    });
  }
  
  return React.createElement(Clock, { 
    className: "w-4 h-4 text-gray-500" 
  });
}

export function formatHora(hora: string): string {
  if (!hora) return "--:--";
  return hora.replace(/H/g, ":").replace(/ - /g, " - ");
}