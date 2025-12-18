// "use client"
// import React, { useState } from "react"
// import Tabs from "./Tabs"
// import OverviewTab from "./tabs/OverviewTab"
// import ExperienceTab from "./tabs/ExperienceTab"
// import EducationTab from "./tabs/EducationTab"
// import SkillsTab from "./tabs/SkillsTab"
// import UserHeader from "./UserHeader"
// import SidebarStats from "./SidebarStats"
// import SidebarLanguages from "./SidebarLanguages"
// // // import { Skill } from "../types/user-types"

// // Tipos ----------------------
// export type Experience = {
//   id: number
//   position: string
//   company: string
//   startDate: string
//   endDate?: string
//   current: boolean
//   description?: string
// }


// export type Education = {
//   degree: string
//   institution: string
//   year: string
// }



// export type Project = {
//   name: string
//   description: string
//   link: string
// }

// export type Stats = {
//   experiences: number
//   years: number
//   projects: number
// }

// export type Language = {
//   name: string
//   level: string
// }

// export type UserData = {
//   name: string
//   title: string
//   location: string
//   bio: string
//   email: string
//   phone: string
//   experiences: Experience[]
//   education: Education[]
//   // skills: Skill[]
//   projects: Project[]
//   stats: Stats
//   languages: Language[]
// }

// // Componente principal ----------------------
// const UserProfile = () => {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isEditing, setIsEditing] = useState(false)

//   const [userData, setUserData] = useState<UserData>({
//     name: "André Novela",
//     title: "Contabilista Sénior",
//     location: "Maputo, Moçambique",
//     bio: "Sou um contabilista com mais de 10 anos de experiência em gestão financeira...",
//     email: "andre.novela@promet.co.mz",
//     phone: "+258 84 123 4567",
//    experiences: [
//   {
//     id: 1,
//     position: "Contabilista Sénior",
//     company: "Promet Moçambique",
//     startDate: "2018-01-01",
//     current: true,
//     description: "Gestão da contabilidade geral e financeira da empresa.",
//   }
// ],

//     education: [
//       { degree: "Licenciatura em Contabilidade e Auditoria", institution: "Universidade Eduardo Mondlane", year: "2012 - 2016" }
//     ],
//     // skills: [
//     //   { id: "1", name: "Contabilidade Financeira" },
//     //   { id: "2", name: "Gestão de Impostos" },
//     //   { id: "3", name: "Análise Financeira" },
//     //   { id: "4", name: "SAP" },
//     //   { id: "5", name: "Excel Avançado" }
//     // ],
//     projects: [
//       { name: "Sistema de Relatórios Financeiros", description: "Automatização de relatórios financeiros mensais", link: "https://github.com/exemplo" }
//     ],
//     stats: { experiences: 12, years: 10, projects: 8 },
//     languages: [
//       { name: "Português", level: "Nativo" },
//       { name: "Inglês", level: "Avançado" },
//     ]
//   })

//   // Funções auxiliares ----------------------
//   const addExperience = (exp: Experience) => {
//     setUserData((prev) => ({
//       ...prev,
//       experiences: [...prev.experiences, { ...exp, id: Date.now() }]
//     }))
//   }

//   const removeExperience = (id: number) => {
//     setUserData((prev) => ({
//       ...prev,
//       experiences: prev.experiences.filter((exp) => exp.id !== id)
//     }))
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <UserHeader
//         userData={userData}
//         isEditing={isEditing}
//         setIsEditing={setIsEditing}
//       />

//       <div className="flex flex-col lg:flex-row gap-6 mt-6">
//         {/* Sidebar */}
//         <aside className="lg:w-1/4">
//           <SidebarStats stats={userData.stats} />
//           <SidebarLanguages languages={userData.languages} />
//         </aside>

//         {/* Conteúdo principal */}
//         <main className="lg:w-3/4">
//           <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={[]} />

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
//             {/* {activeTab === "overview" && (
//               <OverviewTab
//                 userData={userData}
//                 isEditing={isEditing}
//                 setUserData={setUserData}
//               />
//             )} */}

//             {activeTab === "experience" && (
//               <ExperienceTab
//                 experiences={userData.experiences}
//                 isEditing={isEditing}
//                 addExperience={addExperience}
//                 removeExperience={removeExperience}
//               />
//             )}

//             {activeTab === "education" && (
//               <EducationTab
//                 education={userData.education}
//                 isEditing={isEditing}
//                 setUserData={setUserData}
//               />
//             )}

//             {/* {activeTab === "skills" && (
//               <SkillsTab
//                 skills={userData.skills}
//                 isEditing={isEditing}
//                 setUserData={setUserData}
//               />
//             )} */}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default UserProfile

// // Onde gostaria de fazer os Exames caso noa tenha na sua cidade.
