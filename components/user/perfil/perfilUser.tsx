"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tabs from "./Tabs";
import DadosPessoais from "./tabs/DadosPessoais";
import Experiencia from "./tabs/ExperienceTab";
import Formacao from "./tabs/Formacao";
import VisaoGeral from "./tabs/OverviewTab";
import { UserData } from "../types/user-types";
import { getCandidato, Candidato } from "../../../lib/candidato-actions";
import Idiomas from "./tabs/Idiomas";

const tabs = ["Dados Pessoais", "Formação", "Experiência", "Idiomas"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isEditing, setIsEditing] = useState(true);
  const [candidato, setCandidato] = useState<Candidato | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCandidato();
      setCandidato(data);
    };
    fetchData();
  }, []);

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case "Dados Pessoais":
        return <DadosPessoais />;
      case "Idiomas":
        return (
          <Idiomas
          />
        );
      case "Experiência":
        return <Experiencia isEditing={isEditing} />;
      case "Formação":
        return <Formacao />;
      default:
        return null;
    }
  };

  return (
    <div className="md:p-6 w-full md:max-w-6xl mx-auto">
      <Tabs
        tabs={tabs}
        renderTabContent={renderTabContent} 
      />
    </div>
  );
}
