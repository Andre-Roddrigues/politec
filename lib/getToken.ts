// @/lib/getToken.ts

import { cookies } from "next/headers";

export function getAuthToken(): string {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value || null;
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    return token;
  } catch (error) {
    console.error("Erro ao obter auth_token:", error);
    throw new Error('Token de autenticação não encontrado');
  }
}

export function getHeaders(contentType = false) {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
  };

  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}