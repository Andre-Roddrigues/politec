import React from 'react'
import AuthForm from '../../../components/Registro/authForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Registro | POLITEC",
  description:
    "Registre-se na POLITEC e tenha acesso a formações para impulsionar a sua carreira.",
};

export default function page() {
  return (
    <div>
      <AuthForm />
    </div>
  )
}
