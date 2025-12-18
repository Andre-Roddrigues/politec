import { routes } from "../config/routes";

// lib/resend-otp-actions.ts
export type ResendOtpResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function resendOtp(email: string): Promise<ResendOtpResponse> {
  try {
    const res = await fetch(routes.authresendotp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Erro ao reenviar OTP",
        data: data.data,
      };
    }

    return {
      success: true,
      message: data.message || "OTP reenviado com sucesso!",
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro de rede ao reenviar OTP",
    };
  }
}
