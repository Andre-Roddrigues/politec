"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { routes } from "../../../config/routes";

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const res = await fetch(routes.formacoescandidato, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao buscar formações" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const body = await req.json();
    const res = await fetch(routes.adicionarformacao, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao adicionar formação" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const body = await req.json();
    const { id, ...rest } = body;
    const res = await fetch(`${routes.backend_url}/actualizar-formacao/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao atualizar formação" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

    await fetch(`${routes.backend_url}/formacao/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao deletar formação" }, { status: 500 });
  }
}
