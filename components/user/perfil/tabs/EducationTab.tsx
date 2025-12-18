"use client"
import React from "react"

const EducationTab = ({ education, isEditing }: any) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Formação</h2>
      <ul className="space-y-3">
        {education.map((ed: any, index: number) => (
          <li key={index} className="border p-3 rounded">
            <p className="font-semibold">{ed.degree}</p>
            <p className="text-sm text-gray-600">{ed.institution}</p>
            <p className="text-sm">{ed.year}</p>
            {isEditing && (
              <button className="mt-2 text-red-500 text-sm">
                Remover
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EducationTab
