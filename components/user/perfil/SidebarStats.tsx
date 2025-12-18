"use client"
import React from "react"

const SidebarStats = ({ stats }: any) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-2">Estatísticas</h3>
      <ul className="text-sm space-y-1">
        <li>Experiências: {stats.experiences}</li>
        <li>Anos de Experiência: {stats.years}</li>
        <li>Projetos Concluídos: {stats.projects}</li>
      </ul>
    </div>
  )
}

export default SidebarStats
