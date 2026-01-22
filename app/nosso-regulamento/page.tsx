import React from 'react'
import TermosCondicoes from '../../components/Landing/Termos/termosecondicoes'
import {Metadata} from 'next';
import NossoRegulamento from '../../components/Landing/Regulamento/regulamento';

const metadata: Metadata = {
    title: "Regulamento | Politec",
    description:
      "Leia o regulamento do POLITEC para entender suas responsabilidades e direitos ao utilizar nossos serviços.",
};

export default function page() {
  return (
    <div>
      <NossoRegulamento />
    </div>
  )
}
