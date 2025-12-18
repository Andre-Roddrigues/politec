import React from 'react'
import ForgotPasswordForm from '../../components/common/RecuperSenha/passwordReset'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha | Promet",
  description: "Recupere sua senha e continue acessando formações.",
};

export default function page() {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  )
}
