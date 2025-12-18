"use server";

import { routes } from "../config/routes";

export async function resetPassword({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  try {
    const res = await fetch(routes.newpassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Erro ao redefinir senha");
    }

    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("Erro resetPassword:", error);
    return { success: false, error: error.message || "Erro inesperado" };
  }
}
