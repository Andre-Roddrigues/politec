// lib/actions/getHorarioPrice.ts

export interface Curso {
  id: string;
  nome: string;
  duracao: string;
  descricao: string;
}

export interface Horario {
  id: string;
  periodo: string;
  hora: string;
}

export interface CursoHorario {
  id: string;
  cursoId: string;
  horarioId: string;
  mensalidade: string;
  inscricao: string;
  createdAt: string;
  updatedAt: string;
  curso: Curso;
  horario: Horario;
}

export interface HorarioPriceResponse {
  success: boolean;
  cursosHorarios: CursoHorario[];
}

export async function getHorarioPrice(): Promise<CursoHorario[]> {
  try {
    const res = await fetch(
      'https://backend-politec.unitec.ac.mz/cursos/horario-price',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error('Erro ao buscar horários e preços');
    }

    const data: HorarioPriceResponse = await res.json();

    return data.cursosHorarios;
  } catch (error) {
    console.error('Erro em getHorarioPrice:', error);
    return [];
  }
}
