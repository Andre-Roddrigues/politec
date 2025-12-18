"use client"
import React from "react"

const SidebarLanguages = ({ languages }: any) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Idiomas</h3>
      <ul className="text-sm space-y-1">
        {languages.map((lang: any, index: number) => (
          <li key={index}>
            {lang.name} - {lang.level}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SidebarLanguages
