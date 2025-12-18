"use client";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { routes } from "../../config/routes";
export default function GoogleLoginButton() {

  const router = useRouter();
  
  const handleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    try {
      const res = await fetch(routes.googleLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (data?.token) {
        Cookies.set("auth_token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
      }
        
        toast.success("Login realizado com sucesso!");
        router.push("/user/perfil");
    
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Erro no login Google")}
    
    />
  );
}
