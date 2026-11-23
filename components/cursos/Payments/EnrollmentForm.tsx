// components/cursos/Payments/EnrollmentForm.tsx
"use client";

import { useState } from "react";
import { Loader2, User, FileText, Phone, Users, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createEnrollment, updateEnrollment } from "../../../lib/enrollment-actions";

interface EnrollmentFormProps {
  courseId: string;
  horarioId: string;
  initialData?: any; // Recebe os dados se for edição
  onSuccess: () => void;
  onCancel?: () => void;
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-brand-main focus:outline-none focus:ring-4 focus:ring-brand-main/15 dark:bg-gray-900 dark:border-gray-700 dark:text-white";
const labelCls = "block text-sm font-semibold text-gray-700 dark:text-gray-300";
const sectionCls = "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 dark:bg-gray-800 dark:border-gray-700";
const gridCls = "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5";
const fullCls = "sm:col-span-2";
const iconChipCls = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-main/10 text-brand-main";

export default function EnrollmentForm({ courseId, horarioId, initialData, onSuccess, onCancel }: EnrollmentFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  // Se for edição, preenche os campos com os dados existentes
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    surname: initialData?.surname || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    birthDate: initialData?.birthDate ? initialData.birthDate.split('T')[0] : "",
    nationality: initialData?.nationality || "Moçambicana",
    placeOfBirth: initialData?.placeOfBirth || "",
    documentType: initialData?.documentType || "BI",
    documentNumber: initialData?.documentNumber || "",
    documentIssuePlace: initialData?.documentIssuePlace || "",
    documentIssueDate: initialData?.documentIssueDate ? initialData.documentIssueDate.split('T')[0] : "",
    documentExpiryDate: initialData?.documentExpiryDate ? initialData.documentExpiryDate.split('T')[0] : "",
    academicLevel: initialData?.academicLevel || "",
    guardianName: initialData?.guardianName || "",
    guardianContact: initialData?.guardianContact || "",
    emergencyName: initialData?.emergencyName || "",
    emergencyContact: initialData?.emergencyContact || "",
    discoverySource: initialData?.discoverySource || "",
    discoverySourceOther: initialData?.discoverySourceOther || "",
    referredFriends: initialData?.referredFriends || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Lógica para calcular automaticamente a validade (+5 anos) ao inserir a data de emissão
    if (name === "documentIssueDate") {
      let newExpiryDate = "";
      if (value) {
        const issueDate = new Date(value);
        if (!isNaN(issueDate.getTime())) {
          // Adiciona 5 anos
          issueDate.setFullYear(issueDate.getFullYear() + 5);
          // Formata para YYYY-MM-DD (padrão do input type="date")
          newExpiryDate = issueDate.toISOString().split('T')[0];
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        documentIssueDate: value,
        documentExpiryDate: newExpiryDate, // Atualiza a validade automaticamente
      }));
      return;
    }

    // Atualização normal para os restantes campos
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let res;
    if (isEditing) {
      // Chama a action de update
      res = await updateEnrollment(initialData.id, formData);
    } else {
      // Chama a action de create
      res = await createEnrollment(courseId, horarioId, formData);
    }

    if (res.success) {
      toast.success(isEditing ? "Ficha atualizada com sucesso!" : "Ficha preenchida com sucesso!");
      onSuccess();
    } else {
      toast.error(res.error || "Erro ao guardar ficha.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* ────────── PASSO 1: DADOS PESSOAIS ────────── */}
      <section className={sectionCls}>
        <header className="mb-5 flex items-center gap-3">
          <span className={iconChipCls}><User className="h-5 w-5" /></span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-main">Passo 1</span>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">Dados Pessoais</h3>
          </div>
        </header>
        <div className={gridCls}>
          <div>
            <label className={labelCls}>Nome *</label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Apelido *</label>
            <input required name="surname" value={formData.surname} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Telefone *</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="+258..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Data de Nascimento *</label>
            <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nacionalidade *</label>
            <input required name="nationality" value={formData.nationality} onChange={handleChange} className={inputCls} />
          </div>
          <div className={fullCls}>
            <label className={labelCls}>Naturalidade (Local de Nascimento) *</label>
            <input required name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} placeholder="Ex: Maputo" className={inputCls} />
          </div>
        </div>
      </section>

      {/* ────────── PASSO 2: DOCUMENTAÇÃO & ACADÉMICO ────────── */}
      <section className={sectionCls}>
        <header className="mb-5 flex items-center gap-3">
          <span className={iconChipCls}><FileText className="h-5 w-5" /></span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-main">Passo 2</span>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">Documentação e Habilitações</h3>
          </div>
        </header>
        <div className={gridCls}>
          <div>
            <label className={labelCls}>Tipo de Documento *</label>
            <select required name="documentType" value={formData.documentType} onChange={handleChange} className={inputCls}>
              <option value="BI">Bilhete de Identidade (BI)</option>
              <option value="Passaporte">Passaporte</option>
              <option value="DIRE">DIRE</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Nº do Documento *</label>
            <input required name="documentNumber" value={formData.documentNumber} onChange={handleChange} placeholder="Ex: 110100123456A" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Local de Emissão *</label>
            <input required name="documentIssuePlace" value={formData.documentIssuePlace} onChange={handleChange} placeholder="Ex: Maputo" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Data de Emissão *</label>
            <input required type="date" name="documentIssueDate" value={formData.documentIssueDate} onChange={handleChange} className={inputCls} />
          </div>
          <div className={fullCls}>
            <label className={labelCls}>Data de Validade *</label>
            <input required type="date" name="documentExpiryDate" value={formData.documentExpiryDate} onChange={handleChange} className={inputCls} />
            <p className="mt-1.5 text-xs text-gray-500">
              * A validade é calculada automaticamente para 5 anos após a emissão (podes alterar manualmente se necessário).
            </p>
          </div>
          <div className={fullCls}>
            <label className={labelCls}>Nível Académico *</label>
            <select required name="academicLevel" value={formData.academicLevel} onChange={handleChange} className={inputCls}>
              <option value="">Selecione o seu nível...</option>
              <option value="10ª Classe">10ª Classe</option>
              <option value="12ª Classe">12ª Classe</option>
              <option value="Licenciatura">Licenciatura</option>
            </select>
          </div>
        </div>
      </section>

      {/* ────────── PASSO 3: CONTACTOS DE EMERGÊNCIA ────────── */}
      <section className={sectionCls}>
        <header className="mb-5 flex items-center gap-3">
          <span className={iconChipCls}><Phone className="h-5 w-5" /></span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-main">Passo 3</span>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">Contactos de Encarregado e Emergência</h3>
          </div>
        </header>
        <div className={gridCls}>
          <div>
            <label className={labelCls}>Nome do Encarregado *</label>
            <input required name="guardianName" value={formData.guardianName} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contacto do Encarregado *</label>
            <input required name="guardianContact" value={formData.guardianContact} onChange={handleChange} placeholder="+258..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nome de Emergência *</label>
            <input required name="emergencyName" value={formData.emergencyName} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contacto de Emergência *</label>
            <input required name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="+258..." className={inputCls} />
          </div>
        </div>
      </section>

      {/* ────────── PASSO 4: COMO NOS CONHECEU ────────── */}
      <section className={sectionCls}>
        <header className="mb-5 flex items-center gap-3">
          <span className={iconChipCls}><HelpCircle className="h-5 w-5" /></span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-main">Passo 4</span>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">Como soube de nós?</h3>
          </div>
        </header>
        <div className={gridCls}>
          <div className={fullCls}>
            <label className={labelCls}>Fonte de Descoberta *</label>
            <select required name="discoverySource" value={formData.discoverySource} onChange={handleChange} className={inputCls}>
              <option value="">Selecione...</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Amigos/Familiares">Amigos / Familiares</option>
              <option value="Rádio/TV">Rádio / Televisão</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {formData.discoverySource === "Outro" && (
            <div className={fullCls}>
              <label className={labelCls}>Especifique (Outro) *</label>
              <input required name="discoverySourceOther" value={formData.discoverySourceOther} onChange={handleChange} placeholder="Ex: Jornal local..." className={inputCls} />
            </div>
          )}

          <div className={fullCls}>
            <label className={labelCls}>Amigos Referenciados (Qtd)</label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="number" name="referredFriends" value={formData.referredFriends} onChange={handleChange} placeholder="Ex: 2" className={`${inputCls} pl-10`} />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── BOTÕES ────────── */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand-main px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand-main/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 sm:text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> A guardar...
            </>
          ) : (
            isEditing ? "Guardar Alterações" : "Guardar Ficha de Inscrição"
          )}
        </button>
      </div>
    </form>
  );
}