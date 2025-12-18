import React from 'react'
import TermosCondicoes from '../../components/Landing/Termos/termosecondicoes'
import {Metadata} from 'next';

const metadata: Metadata = {
    title: "Termos e Condições | Promet",
    description:
      "Leia os termos e condições do PROMET para entender suas responsabilidades e direitos ao utilizar nossos serviços.",
};

export default function page() {
  return (
    <div>
      <TermosCondicoes />
    </div>
  )
}
