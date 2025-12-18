"use client";

import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const CertificadoUpload: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("O arquivo não pode exceder 10MB");
        return;
      }

      uploadFile(selectedFile); // envia automaticamente
    }
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/addCertificado"); // rota interna para proxy

    // pega token manualmente do cookie
    const token = (document.cookie.match(/auth_token=([^;]+)/)?.[1]) || "";
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(100);

      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success("Certificado enviado com sucesso!");
        setProgress(0);
      } else {
        toast.error(`Erro ao enviar: ${xhr.responseText || "Servidor"}`);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      toast.error("Erro ao enviar certificado");
    };

    xhr.send(formData);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md bg-white">
      <Toaster />
      <h2 className="text-lg font-semibold mb-4">Enviar Certificado</h2>

      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={handleFileChange}
        className="mb-4"
        disabled={loading}
      />

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {!loading && progress === 0 && (
        <p className="text-sm text-gray-500">Selecione um arquivo para enviar</p>
      )}
    </div>
  );
};

export default CertificadoUpload;
