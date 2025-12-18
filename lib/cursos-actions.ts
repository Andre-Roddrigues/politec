import { routes } from "../config/routes";

export type Curso = {
  id: string;
  nome: string;
  createdAt: string;
  imgUrl: string;
  precoTeste: string;
  preco: string;
  desconto: string;
};

export async function getCursos(): Promise<Curso[]> {
  try {
    const res = await fetch(routes.cursos, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Erro ao buscar cursos");

    const data = await res.json();

    return data.map((curso: any) => ({
      id: curso.id,
      nome: curso.nome,
    }));
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return [];
  }
}
