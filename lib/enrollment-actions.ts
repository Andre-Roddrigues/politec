// lib/enrollment-actions.ts
"use server";

import { cookies } from "next/headers";
import { routes } from "../config/routes";

// Verifica se o utilizador tem ficha de inscrição para este curso
export async function checkEnrollmentStatus(courseId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return { hasEnrollment: false, data: null };

  try {
    const res = await fetch(routes.enrollmentsget, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return { hasEnrollment: false, data: null };

    const json = await res.json();
    const enrollments = json.data || [];
    
    const enrollment = enrollments.find(
      (e: any) => e.cursoId === courseId || e.courseId === courseId
    );

    return { hasEnrollment: !!enrollment, data: enrollment || null };
  } catch (error) {
    return { hasEnrollment: false, data: null };
  }
}

// Cria a ficha de inscrição
export async function createEnrollment(courseId: string, horarioId: string, formData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(routes.enrollmentspost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        horarioId,
        ...formData,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao criar inscrição");

    return { success: true, data: data.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Atualiza a ficha de inscrição existente
export async function updateEnrollment(enrollmentId: string, formData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return { success: false, error: "Não autenticado" };

  try {
    const res = await fetch(`${routes.enrollmentsput}/${enrollmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao atualizar ficha");

    return { success: true, data: data.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Lista todas as inscrições do utilizador
export async function getMyEnrollments() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return { success: false, data: [] };

  try {
    const res = await fetch(routes.enrollmentsget, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return { success: false, data: [] };

    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (error) {
    return { success: false, data: [] };
  }
}