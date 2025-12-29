// app/api/admin/export-estudantes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { formato, filtros } = body;

    // Construir query parameters para o backend
    const params = new URLSearchParams({
      format: formato,
      ...(filtros.search && { search: filtros.search }),
      ...(filtros.status && { status: filtros.status }),
      ...(filtros.cursoId && { cursoId: filtros.cursoId }),
    });

    // Fazer request para o backend
    const backendResponse = await fetch(
      `https://backend-politec.unitec.ac.mz/admin/exportar-estudantes?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.statusText}`);
    }

    const blob = await backendResponse.blob();

    // Retornar o arquivo
    return new NextResponse(blob, {
      headers: {
        "Content-Type": formato === "excel" 
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
          : "application/pdf",
        "Content-Disposition": `attachment; filename="estudantes_export.${formato === 'excel' ? 'xlsx' : 'pdf'}"`,
      },
    });
  } catch (error) {
    console.error("Erro na exportação:", error);
    return NextResponse.json(
      { error: "Erro ao exportar estudantes" },
      { status: 500 }
    );
  }
}