"use server";

import { routes } from "../config/routes";

export async function loginUser(credentials: {
  identifier: string; // pode ser username ou email
  password: string;
}) {
  try {
    const response = await fetch(routes.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();
    return data; // deve conter token/jwt
  } catch (error) {
    console.error("Erro no loginUser:", error);
    throw error;
  }
}
export async function googleLogin(token: string) {
  try {
    const response = await fetch("http://localhost:4200/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login com Google");
    }

    const data = await response.json();
    return data; // deve conter token/jwt
  } catch (error) {
    console.error("Erro no googleLogin:", error);
    throw error;
  }
}
