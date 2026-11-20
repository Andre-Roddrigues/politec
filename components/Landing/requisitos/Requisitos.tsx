'use client';

import {
  FileText,
  IdCard,
  BookOpen,
  Camera,
  Hash,
  ClipboardCheck,
  Wallet,
  GraduationCap,
  Info,
  Phone,
} from 'lucide-react';

type Documento = {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  obrigatorio: boolean;
};

type Passo = {
  numero: string;
  titulo: string;
  descricao: string;
};

const documentos: Documento[] = [
  {
    icon: <IdCard className="h-5 w-5" aria-hidden="true" />,
    titulo: 'Documento de identificação',
    descricao: 'BI ou passaporte válido, original e cópia.',
    obrigatorio: true,
  },
  {
    icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
    titulo: 'Certificado de habilitações',
    descricao: 'Certificado do 9.º, 10.º ou 12.º ano, original e cópia.',
    obrigatorio: true,
  },
  {
    icon: <Camera className="h-5 w-5" aria-hidden="true" />,
    titulo: 'Fotografias',
    descricao: 'Duas fotografias tipo passe, recentes.',
    obrigatorio: true,
  },
  {
    icon: <Hash className="h-5 w-5" aria-hidden="true" />,
    titulo: 'NUIT',
    descricao: 'Documento do Número Único de Identificação Tributária.',
    obrigatorio: true,
  },
];

const passos: Passo[] = [
  {
    numero: '01',
    titulo: 'Reúna a documentação',
    descricao: 'Prepare todos os documentos exigidos em original e cópia.',
  },
  {
    numero: '02',
    titulo: 'Efectue a inscrição',
    descricao: 'Apresente a sua documentação na secretaria.',
  },
  {
    numero: '03',
    titulo: 'Regularize a matrícula',
    descricao: 'Concluídas as formalidades, fica oficialmente matriculado.',
  },
  {
    numero: '04',
    titulo: 'Receba o cartão de estudante',
    descricao: 'O cartão identifica-o como aluno durante todo o curso.',
  },
];

export default function Requisitos() {
  return (
    <section
      id="requisitos"
      aria-labelledby="requisitos-titulo"
      className="relative overflow-hidden bg-slate-50 py-20 md:py-28"
    >
      {/* Decoração de fundo discreta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-lime/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-brand-main/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="mx-auto mb-14 max-w-3xl text-center">

          <h2
            id="requisitos-titulo"
            className="mt-5 text-3xl font-bold tracking-tight text-slate-800 md:text-4xl"
          >
            Requisitos de{' '}
            <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">
              inscrição
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Consulte a documentação necessária e os passos para concluir a sua
            matrícula com segurança.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Documentação */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-main/10 text-brand-main">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold text-slate-800 md:text-2xl">
                Documentação exigida
              </h3>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {documentos.map((doc) => (
                <li
                  key={doc.titulo}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-main/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-main/10 text-brand-main transition-colors group-hover:bg-brand-main group-hover:text-white">
                      {doc.icon}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-800">
                          {doc.titulo}
                        </h4>
                        {doc.obrigatorio && (
                          <span className="rounded-full bg-brand-lime/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {doc.descricao}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Aviso */}
            {/* <div className="mt-6 flex gap-3 rounded-2xl border border-brand-main/20 bg-brand-main/5 p-4">
              <Info
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-main"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-slate-700">
                Todos os documentos devem ser apresentados no momento da
                inscrição. Em caso de dúvida, contacte a secretaria antes de se
                deslocar.
              </p>
            </div> */}
          </div>

          {/* Processo */}
          <aside className="lg:col-span-2" aria-labelledby="processo-titulo">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime/15 text-slate-700">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3
                id="processo-titulo"
                className="text-xl font-semibold text-slate-800 md:text-2xl"
              >
                Processo de matrícula
              </h3>
            </div>

            <ol className="relative space-y-6 border-l-2 border-slate-200 pl-8">
              {passos.map((passo) => (
                <li key={passo.numero} className="relative">
                  <span className="absolute -left-[calc(2rem+5px)] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-main to-brand-lime text-xs font-bold text-white shadow">
                    {passo.numero}
                  </span>
                  <h4 className="font-semibold text-slate-800">
                    {passo.titulo}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {passo.descricao}
                  </p>
                </li>
              ))}
            </ol>

            {/* Chamada para contacto */}
            {/* <div className="mt-10 rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              <div className="mb-3 flex items-center gap-3">
                <Wallet className="h-5 w-5 text-brand-lime" aria-hidden="true" />
                <p className="font-semibold">Dúvidas sobre taxas?</p>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-300">
                Os valores em vigor são indicados pela secretaria, que o
                orienta no pagamento.
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-lime px-4 py-2.5 text-sm font-semibold text-slate-900 transition-transform duration-200 hover:scale-[1.02]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contactar a secretaria
              </a>
            </div> */}
          </aside>
        </div>
      </div>
    </section>
  );
}