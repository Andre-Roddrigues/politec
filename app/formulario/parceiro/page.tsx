import React from 'react'
import ParceriaForm from '../../../components/common/Empresa/FormParceiro'
import PartnershipForm from '../../../components/common/Empresa/FormParceiro'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seja Parceiro | Promet",
  description:
    "Dê visibilidade a sua marca e contribua para gerar oportunidades de emprego e capacitação profissional.",
};

export default function page() {
  return (
    <div>
      <PartnershipForm />
    </div>
  )
}
