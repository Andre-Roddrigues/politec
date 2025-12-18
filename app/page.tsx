import type { Metadata } from "next";
import CTAGraduacao from "../components/Landing/Graduacao/CTAGraduacao";
import GraduacaoPage from "../components/Landing/Graduacao/GraduacaoPage";

export const metadata: Metadata = {
  title: "Graduação Unitec",
  description: "Guia para preencher seu currículo na Unitec, incluindo informações pessoais, formação acadêmica e experiências relevantes para a graduação.",
};
export default function Home() {

  return (
    <div>
      <GraduacaoPage />
    </div>
  );
}
