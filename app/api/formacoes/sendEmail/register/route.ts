import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { email, nome } = await request.json();

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Enviar para o utilizador
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "🎉 Bem-vindo à Unitec!",
      text: `Olá ${nome},\n\nA sua conta foi criada com sucesso!\nAgora pode entrar e explorar os nossos serviços.\n\nEquipa Unitec`,
    };

    // Copiar para suporte/admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: "suporte@unitec.ac.mz",
      subject: "Novo registo na plataforma",
      text: `Um novo utilizador registou-se:\n\nNome: ${nome}\nEmail: ${email}`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { message: "E-mails de registo enviados com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erro ao enviar e-mails de registo:", error);
    return NextResponse.json(
      { message: "Erro ao enviar e-mails." },
      { status: 500 }
    );
  }
}
