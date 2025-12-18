"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  GraduationCap,
  Calendar,
  School,
  X,
  BookOpen,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export type FormationType = {
  id: string;
  nome: string;
  local: string;
  dataInicio: string;
  dataFim?: string;
  descricao?: string;
  duracao: string;
  cursando?: boolean; 
  usarDuracao?: boolean;
};

export default function Formacao() {
  const [formacoes, setFormacoes] = useState<FormationType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<FormationType, "id">>({
    nome: "",
    local: "",
    dataInicio: "",
    dataFim: "",
    descricao: "",
    duracao: "",
    cursando: false,
    usarDuracao: false,
  });

  const loadFormacoes = async () => {
    try {
      const res = await fetch("/api/formacoes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFormacoes(data);
      } else {
        setFormacoes([]);
        console.error("Resposta inesperada:", data);
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar formações");
      setFormacoes([]);
    }
  };

  useEffect(() => {
    loadFormacoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const hoje = new Date();

  // Validação quando não usar duração
  if (!form.usarDuracao) {
    if (form.dataInicio) {
      const inicio = new Date(form.dataInicio);

      if (inicio > hoje) {
        toast.error("O ano de início não pode ser maior que o ano actual.");
        return;
      }

      if (form.dataFim) {
        const fim = new Date(form.dataFim);
        if (fim < inicio) {
          toast.error("O ano de fim não pode ser menor que o ano de início.");
          return;
        }
      }
    }
  }

  // Monta payload básico
  const payload: any = {
    id: editId || undefined,
    nome: form.nome,
    local: form.local,
    descricao: form.descricao,
  };

  // Se usar duração
  if (form.usarDuracao) {
    if (form.duracao) {
      payload.duracao = form.duracao;
    }
    if (form.dataFim) {
      payload.dataFim = form.dataFim;
    }
    payload.cursando = false;
  } else {
    if (form.dataInicio) {
      payload.dataInicio = form.dataInicio;
    }
    if (form.dataFim && !form.cursando) {
      payload.dataFim = form.dataFim;
    }
    if (form.cursando) {
      payload.cursando = true;
    }
  }

  await toast.promise(
    (async () => {
      const res = await fetch("/api/formacoes", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    })(),
    {
      loading: editId ? "actualizando formação..." : "Adicionando formação...",
      success: () => {
        loadFormacoes();
        setForm({
          nome: "",
          local: "",
          dataInicio: "",
          dataFim: "",
          descricao: "",
          duracao: "",
          cursando: false,
          usarDuracao: false,
        });
        setEditId(null);
        setShowForm(false);
        return editId ? "Formação actualizada!" : "Formação adicionada!";
      },
      error: (err: any) => err.message || "Erro ao salvar formação",
    }
  );
};



  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente deletar esta formação?")) return;

    await toast.promise(
      (async () => {
        const res = await fetch(`/api/formacoes?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
      })(),
      {
        loading: "Removendo formação...",
        success: () => {
          loadFormacoes();
          return "Formação removida!";
        },
        error: (err: any) => err.message || "Erro ao remover formação",
      }
    );
  };

  const handleEdit = (f: FormationType) => {
    setForm({
      ...f,
      cursando: f.cursando || false,
      usarDuracao: f.usarDuracao || false,
    });
    setEditId(f.id);
    setShowForm(true);
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("-")[0];
  };

  const formatDisplayDate = (formation: FormationType) => {
    if (formation.usarDuracao) {
      const fim = formation.dataFim ? formatYear(formation.dataFim) : "";
      return `${formation.duracao}${fim ? ` (até ${fim})` : ""}`;
    } else {
      const inicio = formatYear(formation.dataInicio);
      const fim = formation.cursando
        ? "cursando"
        : formation.dataFim
        ? formatYear(formation.dataFim)
        : "";
      return `${inicio} - ${fim}`;
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl text-center font-bold text-brand-main dark:text-white">
          Formação Acadêmica
        </h2>
        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-main text-white rounded-lg hover:bg-blue-800 transition"
          >
            <Plus className="w-4 h-4" />
            Adicionar Formação
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {editId ? "Editar Formação" : "Adicionar Formação"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Curso *"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Instituição *"
                  value={form.local}
                  onChange={(e) => setForm({ ...form, local: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!form.usarDuracao}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            usarDuracao: !e.target.checked,
                            duracao: e.target.checked ? "" : form.duracao,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label className="text-gray-700 dark:text-gray-300">
                        Datas de início e fim
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.usarDuracao}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            usarDuracao: e.target.checked,
                            dataInicio: "",
                            cursando: false,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label className="text-gray-700 dark:text-gray-300">
                        Usar duração
                      </label>
                    </div>
                  </div>

                  {!form.usarDuracao && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ano de Início *
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2100"
                          value={form.dataInicio ? formatYear(form.dataInicio) : ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              dataInicio: e.target.value
                                ? `${e.target.value}-01-01`
                                : "",
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          required={!form.usarDuracao}
                          placeholder="Ex: 2020"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ano de Fim
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2100"
                          value={form.dataFim ? formatYear(form.dataFim) : ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              dataFim: e.target.value
                                ? `${e.target.value}-01-01`
                                : "",
                            })
                          }
                          disabled={form.cursando}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                          placeholder="Ex: 2024"
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="checkbox"
                            checked={form.cursando}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                cursando: e.target.checked,
                                dataFim: e.target.checked ? "" : form.dataFim,
                              })
                            }
                            disabled={form.usarDuracao}
                            className="w-4 h-4"
                          />
                          <label className="text-gray-700 dark:text-gray-300">
                            Cursando actualmente
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {form.usarDuracao && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Duração *
  </label>
  <div className="flex gap-2">
    <input
      type="number"
      min={1}
      max={100}
      value={form.duracao.replace(/[^0-9]/g, "")}
      onChange={(e) => {
        const numValue = e.target.value.replace(/[^0-9]/g, "");
        const unit = form.duracao.match(/[a-z]+/i)?.[0] || "dia";

        if (numValue) {
          const plural = parseInt(numValue) > 1 ? "s" : "";
          setForm({ ...form, duracao: `${numValue} ${unit}${plural}` });
        } else {
          setForm({ ...form, duracao: "" });
        }
      }}
      className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
      required={form.usarDuracao}
      placeholder="Ex: 4"
    />

    <select
      value={form.duracao.match(/[a-z]+/i)?.[0] || "dia"}
      onChange={(e) => {
        const numValue = form.duracao.replace(/[^0-9]/g, "") || "1";
        const plural = parseInt(numValue) > 1 ? "s" : "";
        setForm({ ...form, duracao: `${numValue} ${e.target.value}${plural}` });
      }}
      className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
    >
      <option value="dia">hora(s)</option>
      <option value="dia">dia(s)</option>
      <option value="semana">semana(s)</option>
      <option value="mes">mês(es)</option>
      <option value="ano">ano(s)</option>
    </select>
  </div>
</div>
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="Descrição"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white md:col-span-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 text-white bg-brand-lime rounded-lg hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Refazer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-brand-main text-white shadow-md hover:bg-blue-900 transition"
                >
                  {editId ? "Salvar Alterações" : "Adicionar Formação"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {formacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma formação adicionada ainda.</p>
            <p className="text-sm">
              Clique em Adicionar Formação para começar.
            </p>
          </div>
        ) : (
          formacoes.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-start dark:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                  <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {f.nome}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                    <School className="w-4 h-4" />
                    {f.local}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <Calendar className="w-4 h-4 inline-block" />{" "}
                    {formatDisplayDate(f)} {f.duracao}
                  </p>
                  {f.descricao && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300">
                        {f.descricao}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(f)}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
