import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import UserProfile from '../../../components/user/perfil/perfilUser';
import CandidatoHeader from "../../../components/user/perfil/UserHeader";
import CTAGraduacaoPerfil from "../../../components/Landing/Graduacao/CTAGraduacaoPerfil";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Página de perfil do usuário, onde é possível visualizar e editar informações pessoais, histórico acadêmico.",
};

export default function Page() {
  return (
    <div className="min-h-screen">
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-800">
        <Link href="/" className="flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} />
          <span>Voltar para Início</span>
        </Link>
      </div>

      <CandidatoHeader />
      <UserProfile />
    </div>
      <CTAGraduacaoPerfil />
    </div>
  );
}
