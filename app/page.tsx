import type { Metadata } from "next";
import HeroPolitec from "../components/Landing/Hero2/HeroSection";

export const metadata: Metadata = {
  title: "POLITEC",
  // description: "Guia para preencher seu currículo na Unitec, incluindo informações pessoais, formação acadêmica e experiências relevantes para a graduação.",
};
export default function Home() {

  return (
    <div className="overflow-x-hidden">
      <HeroPolitec />
    </div>
  );
}
