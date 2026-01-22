import type { Metadata } from "next";
import HeroPolitec from "../components/Landing/Hero2/HeroSection";
import AreasCursos from "../components/Landing/Areas/AreasCurso";
import Beneficios from "../components/Landing/Beneficios/beneficio";
import ComoFunciona from "../components/Landing/ComoFunciona/comoFunciona";
import CTAInscricao from "../components/Landing/CTAInscricao/CTAInscricao";
import NossoRegulamento from "../components/Landing/Regulamento/regulamento";
import Requisitos from "../components/Landing/requisitos/Requisitos";


export const metadata: Metadata = {
  title: "POLITEC - Instituto Médio",
  description: "Formamos os profissionais mais qualificados do mercado com cursos Médios e profissionalizantes.",
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroPolitec />
      <ComoFunciona />
      {/* <AreasCursos /> */}
      {/* <Beneficios /> */}
      <Requisitos />
      {/* <NossoRegulamento /> */}
      <CTAInscricao />
    </div>
  );
}