"use client";

import React, { useEffect, useState } from "react";
import { getCandidato } from "../../../lib/candidato-actions";

export interface Certificado {
  id: string;
  imgUrl: string;
  motivo: string | null;
  idCandidato: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ListaCertificadosProps {
  onLoad?: (certificados: Certificado[]) => void; // ✅ nova prop
}

const ListaCertificados: React.FC<ListaCertificadosProps> = ({ onLoad }) => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const candidato = await getCandidato();
        console.log("📌 Dados do candidato recebidos:", candidato);

        if (!candidato || !candidato.id) {
          setError("ID do candidato não encontrado.");
          return;
        }

        const resp = await fetch(
          `https://backend-promet.unitec.academy/listar-certificados/${candidato.id}`
        );

        console.log("📌 Resposta bruta do fetch:", resp);

        if (!resp.ok) throw new Error("Erro ao buscar certificados");

        const data: Certificado[] = await resp.json();
        console.log("📌 Dados de certificados recebidos:", data);

        setCertificados(data);

        // ✅ dispara para o MainCandidatura
        if (onLoad) {
          onLoad(data);
        }
      } catch (err: any) {
        console.error("❌ Erro ao buscar certificados:", err);
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificados();
  }, [onLoad]);

//   if (loading) return <p>Carregando certificados...</p>;
//   if (error) return <p>{error}</p>;
//   if (certificados.length === 0) return <p>Não há certificados disponíveis.</p>;

  return (
    <div className="space-y-2">
      {/* {certificados.map((cert) => (
        <div
          key={cert.id}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="font-medium text-gray-800 dark:text-white">
            Status: {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
          </p>
          {cert.motivo && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Motivo: {cert.motivo}
            </p>
          )}
          <a
            href={cert.imgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline text-sm"
          >
            Ver Certificado
          </a>
        </div>
      ))} */}
    </div>
  );
};

export default ListaCertificados;
