// Experiência profissional
export type Experience = {
  id: string;
  cargo: string;
  organizacao: string;
  dataFim: string;
  descricao?: string; // agora opcional
};

// Formação acadêmica
export type Education = {
  id: string;
  instituicao: string;
  curso: string;
  periodo: string;
  descricao?: string;
};

// Habilidade
export type Skill = {
  id: string;
  name: string;
};

// Dados do usuário
export type UserData = {
  id: string;
  nome: string;
  apelido?: string;
  username?: string;
  email: string;
  contacto: string;
  localizacao?: string;
  overview?: string;
  avatarUrl?: string | null;
  role?: "candidato" | "admin" | "empresa";
  createdAt?: string;
  updatedAt?: string;
  experiencias?: Experience[];
  formacoes?: Education[];
  skills?: Skill[];
};

// Props para componente Habilidades
export type HabilidadesProps = {
  skills: Skill[];
  isEditing: boolean;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

// Props para componente Experiência
export type ExperienciaProps = {
  experiencias: Experience[];
  addExperience: (exp: Experience) => void;
  removeExperience: (id: string) => void;
  isEditing: boolean;
};

// Props para componente Formação
export type FormacaoProps = {
  formacoes: Education[];
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  isEditing: boolean;
};
