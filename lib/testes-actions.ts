import Cookies from "js-cookie";
import { Candidato, listarCertificados } from "./addCertificadoAction";
import { routes } from "../config/routes";

export interface Pagamento {
  id: string;
  candidatoId: string;
  edicaoId: string;
  itemNome: string;
  itemId: string;
  valor: number;
  desconto: number | null;
  metodoPagamento: string;
  referencia: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teste {
  id: string;
  cursoId: string;
  candidaturaId: string;
  status: string;
  descricao: string | null;
  data: string | null;
  preco: number;
  contadorTeste: number;
  createdAt: string;
  updatedAt: string;
  pontuacao:string;
  pagamentos?: Pagamento[];
}

export interface CandidaturaTeste {
  cursos: {
    id: string;
    nome: string;
    preco: number;
    precoTeste: number;
    descricao?: string | null;
    imgUrl?: string | null;
    desconto?: number | null;
    createdAt: string;
    updatedAt: string;
  };
  id: string;
  status: string;
  idCandidato: string;
  idEdicao: string;
  idCurso: string;
  createdAt: string;
  updatedAt: string;
  testesdiagnosticos: Teste[];
  pagamentos?: Pagamento[];
  certificados?: Certificado[];
  certificadoAprovado?: boolean; // <-- adicionamos aqui
}
export type Certificado = {
  id: string;
  imgUrl: string;
  motivo: string | null;
  idCandidato: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  candidato: Candidato;
};
// Fetch dos testes com integração de certificados
export const getTestesByCandidatura = async (): Promise<CandidaturaTeste[]> => {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado");

    const response = await fetch(routes.candidaturastestescandidato,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Erro ao buscar testes da candidatura");

    const data: CandidaturaTeste[] = await response.json();

    // Buscar certificados de cada candidatura
    const formattedData: CandidaturaTeste[] = await Promise.all(
      data.map(async (c) => {
        const testes = c.testesdiagnosticos || [];

        // Buscar certificados
        const certificadosResp = await listarCertificados(c.idCandidato);
        const certificados: Certificado[] = certificadosResp.data || [];
        const certificadoAprovado = certificados.some(
          (cert) => cert.status.toLowerCase() === "aprovado"
        );

        return {
          ...c,
          testesdiagnosticos: testes,
          certificadoAprovado,
        };
      })
    );

    return formattedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
