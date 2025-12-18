"use client";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ChevronDown, X, Languages } from "lucide-react";
import { getIdiomas, Idioma } from "../../../../lib/idioma-actions";
import {
  IdiomaCandidato,
  addUserIdiomas,
  getUserIdiomas,
  deleteUserIdioma,
} from "../../../../lib/add-idioma-candidato";

export default function Idiomas() {
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [userIdiomas, setUserIdiomas] = useState<IdiomaCandidato[]>([]);
  const [selectedIdiomaId, setSelectedIdiomaId] = useState<string | null>(null);
  const [selectedFluencia, setSelectedFluencia] = useState<string>("");
  const [showIdiomaDropdown, setShowIdiomaDropdown] = useState(false);
  const [showFluenciaDropdown, setShowFluenciaDropdown] = useState(false);

  // Agora no formato {label, value}
  const niveisProficiencia = [
    { label: "Básico", value: "basico" },
    { label: "Intermédiario", value: "intermediario" },
    { label: "Avançado", value: "avancado" },
    { label: "Fluente", value: "fluente" },
  ];

  useEffect(() => {
    loadIdiomas();
    loadUserIdiomas();
  }, []);

  const loadIdiomas = async () => {
    const result = await getIdiomas();
    if (!result.success) {
      toast.error(result.error || "Erro ao carregar idiomas");
      setIdiomas([]);
      return;
    }
    setIdiomas(result.data || []);
  };

  const loadUserIdiomas = async () => {
    const result = await getUserIdiomas();
    if (!result.success) {
      toast.error(result.error || "Erro ao carregar seus idiomas");
      setUserIdiomas([]);
      return;
    }
    const mapped: IdiomaCandidato[] = (result.data || []).map((item) => ({
      idIdioma: item.id,
      fluencia: item.candidato?.[0]?.fluencia || "",
    }));
    setUserIdiomas(mapped);
  };

  const selectIdioma = (idioma: Idioma) => {
    setSelectedIdiomaId(idioma.id || null);
    setShowIdiomaDropdown(false);
  };

  const selectFluencia = (nivelValue: string) => {
    setSelectedFluencia(nivelValue);
    setShowFluenciaDropdown(false);
  };

  const handleSalvar = async () => {
    if (!selectedIdiomaId || !selectedFluencia) return;

    const payload: IdiomaCandidato = {
      idIdioma: selectedIdiomaId,
      fluencia: selectedFluencia, // já vai no formato sem acento
    };

    console.log(">>> Enviando idioma candidato (JSON):", payload);

    const result = await toast.promise(addUserIdiomas(payload), {
      loading: "Salvando idioma...",
      success: "Idioma salvo com sucesso!",
      error: (err) => err.message || "Erro ao salvar idioma",
    });

    if (result.success) {
      setUserIdiomas((prev) => [
        ...prev,
        { idIdioma: selectedIdiomaId, fluencia: selectedFluencia },
      ]);
      setSelectedIdiomaId(null);
      setSelectedFluencia("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente remover este idioma?")) return;

    const result = await toast.promise(deleteUserIdioma(id), {
      loading: "Removendo idioma...",
      success: "Idioma removido!",
      error: (err) => err.message || "Erro ao remover idioma",
    });

    if (result.success) {
      setUserIdiomas((prev) => prev.filter((i) => i.idIdioma !== id));
    }
  };

  const selectedIdioma = idiomas.find((i) => i.id === selectedIdiomaId);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <span className="bg-brand-main bg-clip-text text-transparent">Idiomas</span>
      </h2>

      {/* Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Idioma */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Idioma
          </label>
          <button
            type="button"
            onClick={() => setShowIdiomaDropdown(!showIdiomaDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-brand-main dark:hover:border-brand-lime transition-colors"
          >
            <span>{selectedIdioma?.nome || "Selecione um idioma"}</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${showIdiomaDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showIdiomaDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {idiomas.map((idioma) => (
                <div
                  key={idioma.id}
                  onClick={() => selectIdioma(idioma)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedIdiomaId === idioma.id ? "bg-brand-main/10 text-brand-main dark:text-brand-lime" : ""
                  }`}
                >
                  {idioma.nome}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fluência */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nível de Proficiência
          </label>
          <button
            type="button"
            onClick={() => setShowFluenciaDropdown(!showFluenciaDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-brand-main dark:hover:border-brand-lime transition-colors"
          >
            <span>
              {selectedFluencia
                ? niveisProficiencia.find((n) => n.value === selectedFluencia)?.label
                : "Selecione o nível"}
            </span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${showFluenciaDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showFluenciaDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              {niveisProficiencia.map((nivel) => (
                <div
                  key={nivel.value}
                  onClick={() => selectFluencia(nivel.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedFluencia === nivel.value
                      ? "bg-brand-main/10 text-brand-main dark:text-brand-lime"
                      : ""
                  }`}
                >
                  {nivel.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSalvar}
        disabled={!selectedIdiomaId || !selectedFluencia}
        className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors ${
          selectedIdiomaId && selectedFluencia
            ? "bg-brand-main hover:bg-brand-main/90"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Salvar
      </button>

      {/* Lista de idiomas */}
      {userIdiomas.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg mt-6">
          <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum idioma adicionado ainda.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Adicione seu primeiro idioma usando o formulário acima.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Seus Idiomas</h3>
          {userIdiomas.map((idioma, index) => {
            const info = idiomas.find((i) => i.id === idioma.idIdioma);
            return (
              <div
                key={`${idioma.idIdioma}-${index}`}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm flex justify-between items-center transition-all hover:shadow-md"
              >
                <div className="flex-1">
                  <p className="font-bold text-lg text-brand-main dark:text-brand-lime">{info?.nome}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-brand-main to-brand-lime h-2.5 rounded-full"
                        style={{
                          width:
                            idioma.fluencia === "fluente"
                              ? "100%"
                              : idioma.fluencia === "avancado"
                              ? "75%"
                              : idioma.fluencia === "intermediario"
                              ? "50%"
                              : "25%",
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-3 min-w-[100px]">
                      {
                        niveisProficiencia.find((n) => n.value === idioma.fluencia)?.label ||
                        idioma.fluencia
                      }
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDelete(idioma.idIdioma)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remover idioma"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
